import crypto from 'node:crypto';

const EVENTBRITE_API_BASE = 'https://www.eventbriteapi.com/v3';

export async function getEventbriteSettings(sql) {
  await ensureSettingsRow(sql);
  const rows = await sql`select * from eventbrite_settings where id = 1 limit 1`;
  const settings = rows[0] || {};
  return {
    ...settings,
    has_token: Boolean(settings.private_token_encrypted || process.env.EVENTBRITE_PRIVATE_TOKEN),
    private_token_encrypted: undefined,
  };
}

export async function saveEventbriteSettings(sql, input, userId) {
  await ensureSettingsRow(sql);
  const existingRows = await sql`select private_token_encrypted from eventbrite_settings where id = 1 limit 1`;
  const existingToken = existingRows[0]?.private_token_encrypted || null;
  const removeToken = Boolean(input.remove_token);
  const nextToken = typeof input.private_token === 'string' && input.private_token.trim()
    ? encryptSecret(input.private_token.trim())
    : removeToken
      ? null
      : existingToken;

  const rows = await sql`
    update eventbrite_settings
       set private_token_encrypted = ${nextToken},
           organization_id = ${nullable(input.organization_id)},
           public_backend_url = ${nullable(input.public_backend_url)},
           sync_interval_minutes = ${clampNumber(input.sync_interval_minutes, 5, 1440, 15)},
           auto_sync_enabled = ${Boolean(input.auto_sync_enabled)},
           show_uncategorized = ${Boolean(input.show_uncategorized)},
           updated_by = ${userId},
           updated_at = now()
     where id = 1
     returning *
  `;

  return maskSettings(rows[0]);
}

export async function testEventbriteConnection(sql) {
  const config = await getPrivateConfig(sql);
  const payload = await eventbriteFetch(config, '/organizations/' + encodeURIComponent(config.organizationId) + '/events/?page_size=1');
  await sql`
    update eventbrite_settings
       set connection_status = 'verified',
           last_test_at = now(),
           updated_at = now()
     where id = 1
  `;
  return { ok: true, count: payload.events?.length || 0 };
}

export async function syncEventbriteEvents(sql, triggerSource = 'dashboard') {
  const config = await getPrivateConfig(sql);
  const jobRows = await sql`
    insert into eventbrite_sync_jobs (sync_type, status, trigger_source, attempt, started_at)
    values ('full', 'running', ${triggerSource}, 1, now())
    returning *
  `;
  const job = jobRows[0];

  try {
    const remoteEvents = await fetchAllOrganizationEvents(config);
    const settings = await getEventbriteSettings(sql);
    const visibility = await getClassificationVisibility(sql);
    let created = 0;
    let updated = 0;
    let hidden = 0;
    let skipped = 0;

    for (const remoteEvent of remoteEvents) {
      const mapped = mapEventbriteEvent(remoteEvent, settings, visibility);
      if (!mapped.title || !mapped.eventbrite_id) {
        skipped += 1;
        continue;
      }

      if (mapped.is_hidden) hidden += 1;
      const exists = await sql`select id from events where eventbrite_id = ${mapped.eventbrite_id} limit 1`;
      await upsertEvent(sql, mapped);
      if (exists.length) updated += 1;
      else created += 1;

      await upsertClassifications(sql, mapped.classifications);
    }

    const completed = await sql`
      update eventbrite_sync_jobs
         set status = 'complete',
             created_count = ${created},
             updated_count = ${updated},
             hidden_count = ${hidden},
             skipped_count = ${skipped},
             finished_at = now()
       where id = ${job.id}
       returning *
    `;

    await sql`
      update eventbrite_settings
         set connection_status = 'verified',
             last_full_sync_at = now(),
             last_sync_status = 'complete',
             updated_at = now()
       where id = 1
    `;

    return completed[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Eventbrite sync failed.';
    const failed = await sql`
      update eventbrite_sync_jobs
         set status = 'failed',
             message = ${message.slice(0, 1000)},
             finished_at = now()
       where id = ${job.id}
       returning *
    `;

    await sql`
      update eventbrite_settings
         set connection_status = 'failed',
             last_sync_status = 'failed',
             updated_at = now()
       where id = 1
    `;

    return failed[0];
  }
}

export async function listEventDashboard(sql, q = '') {
  await ensureSettingsRow(sql);
  const like = '%' + q + '%';
  const events = q
    ? await sql.query(
        `select * from events where coalesce(source, '') = 'eventbrite' and (title ilike $1 or coalesce(category, '') ilike $1 or coalesce(location, '') ilike $1) order by starts_at desc nulls last limit 200`,
        [like],
      )
    : await sql`select * from events where coalesce(source, '') = 'eventbrite' order by starts_at desc nulls last limit 200`;

  const statsRows = await sql`
    select
      count(*)::int as total,
      count(*) filter (where is_active = true and coalesce(is_hidden, false) = false and (starts_at is null or starts_at >= now()))::int as public_upcoming,
      count(*) filter (where is_active = true and coalesce(is_hidden, false) = false and starts_at < now())::int as public_past,
      count(*) filter (where is_active = false or coalesce(is_hidden, false) = true)::int as hidden_draft
    from events
    where coalesce(source, '') = 'eventbrite'
  `;

  const classifications = await sql`select * from event_classifications order by classification_type asc, name asc`;
  const jobs = await sql`select * from eventbrite_sync_jobs order by created_at desc limit 50`;
  const settings = await getEventbriteSettings(sql);

  return {
    events,
    stats: statsRows[0] || { total: 0, public_upcoming: 0, public_past: 0, hidden_draft: 0 },
    classifications,
    jobs,
    settings,
    worker: { status: 'offline' },
  };
}

export async function addClassification(sql, input) {
  const name = String(input.name || '').trim();
  if (!name) throw new Error('Classification name is required.');
  const slug = String(input.slug || slugify(name)).trim();
  const type = String(input.classification_type || input.type || 'local').trim() || 'local';
  const rows = await sql`
    insert into event_classifications (name, slug, classification_type, source)
    values (${name}, ${slug}, ${type}, 'dashboard')
    on conflict (slug) do update set name = excluded.name, classification_type = excluded.classification_type
    returning *
  `;
  return rows[0];
}

export async function updateClassification(sql, id, input) {
  const rows = await sql`
    update event_classifications
       set is_visible = ${Boolean(input.is_visible)},
           updated_at = now()
     where id = ${id}
     returning *
  `;
  await refreshEventVisibility(sql);
  return rows[0] || null;
}

export async function updateEventVisibility(sql, id, input) {
  const rows = await sql`
    update events
       set is_hidden = ${Boolean(input.is_hidden)},
           is_active = ${'is_active' in input ? Boolean(input.is_active) : true},
           updated_at = now()
     where id = ${id}
     returning *
  `;
  return rows[0] || null;
}

async function ensureSettingsRow(sql) {
  await sql`
    insert into eventbrite_settings (id)
    values (1)
    on conflict (id) do nothing
  `;
}

async function getPrivateConfig(sql) {
  await ensureSettingsRow(sql);
  const rows = await sql`select private_token_encrypted, organization_id from eventbrite_settings where id = 1 limit 1`;
  const settings = rows[0] || {};
  const token = process.env.EVENTBRITE_PRIVATE_TOKEN || decryptSecret(settings.private_token_encrypted || '');
  const organizationId = settings.organization_id || process.env.EVENTBRITE_ORGANIZATION_ID;

  if (!token) throw new Error('Eventbrite private token is missing.');
  if (!organizationId) throw new Error('Eventbrite organization ID is missing.');
  return { token, organizationId };
}

async function fetchAllOrganizationEvents(config) {
  const events = [];
  let continuation = '';
  for (let page = 0; page < 20; page += 1) {
    const params = new URLSearchParams({
      page_size: '200',
      status: 'all',
      expand: 'venue,organizer,category,subcategory,format,logo,ticket_availability',
    });
    if (continuation) params.set('continuation', continuation);
    const payload = await eventbriteFetch(config, '/organizations/' + encodeURIComponent(config.organizationId) + '/events/?' + params.toString());
    events.push(...(payload.events || []));
    if (!payload.pagination?.has_more_items || !payload.pagination?.continuation) break;
    continuation = payload.pagination.continuation;
  }
  return events;
}

async function eventbriteFetch(config, path) {
  const response = await fetch(EVENTBRITE_API_BASE + path, {
    headers: {
      Authorization: 'Bearer ' + config.token,
      Accept: 'application/json',
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload.error_description || payload.error || response.statusText;
    throw new Error('Eventbrite API error: ' + detail);
  }
  return payload;
}

function mapEventbriteEvent(event, settings, visibility) {
  const classifications = [event.category?.name, event.subcategory?.name, event.format?.name].filter(Boolean);
  const hasHiddenClassification = classifications.some((name) => visibility.get(slugify(name)) === false);
  const isUncategorized = classifications.length === 0;
  const hideUncategorized = isUncategorized && settings.show_uncategorized === false;
  const startsAt = event.start?.utc || event.start?.local || null;
  const endsAt = event.end?.utc || event.end?.local || null;
  const plainDescription = stripHtml(event.description?.text || event.description?.html || '');
  const summary = event.summary || plainDescription.slice(0, 240) || null;
  const url = event.url || null;

  return {
    eventbrite_id: String(event.id || ''),
    title: event.name?.text || event.name?.html || 'Untitled Eventbrite event',
    slug: 'eventbrite-' + String(event.id || crypto.randomUUID()),
    summary,
    description: event.description?.html || event.description?.text || null,
    image_url: event.logo?.url || event.logo?.original?.url || null,
    image_alt: event.name?.text || null,
    starts_at: startsAt,
    ends_at: endsAt,
    timezone: event.start?.timezone || event.end?.timezone || null,
    location: event.online_event ? 'Online' : event.venue?.name || event.venue?.address?.localized_area_display || null,
    organiser: event.organizer?.name || null,
    category: event.category?.name || null,
    classifications,
    format: event.online_event ? 'Virtual' : event.format?.name || null,
    sales_status: event.status || event.ticket_availability?.sales_status || null,
    price_label: 'Register',
    cta_label: 'Register',
    cta_url: url,
    source_url: url,
    source: 'eventbrite',
    eventbrite_url: url,
    eventbrite_status: event.status || null,
    eventbrite_published_at: event.published || null,
    is_active: event.status !== 'canceled' && event.status !== 'draft',
    is_hidden: hasHiddenClassification || hideUncategorized,
    raw_eventbrite: event,
  };
}

async function upsertEvent(sql, event) {
  await sql`
    insert into events (
      eventbrite_id, title, slug, summary, description, image_url, image_alt, starts_at, ends_at, timezone,
      location, organiser, category, classifications, format, sales_status, price_label, cta_label, cta_url,
      source_url, source, eventbrite_url, eventbrite_status, eventbrite_published_at, is_active, is_hidden,
      raw_eventbrite, last_synced_at, updated_at
    ) values (
      ${event.eventbrite_id}, ${event.title}, ${event.slug}, ${event.summary}, ${event.description}, ${event.image_url}, ${event.image_alt}, ${event.starts_at}, ${event.ends_at}, ${event.timezone},
      ${event.location}, ${event.organiser}, ${event.category}, ${JSON.stringify(event.classifications)}, ${event.format}, ${event.sales_status}, ${event.price_label}, ${event.cta_label}, ${event.cta_url},
      ${event.source_url}, ${event.source}, ${event.eventbrite_url}, ${event.eventbrite_status}, ${event.eventbrite_published_at}, ${event.is_active}, ${event.is_hidden},
      ${JSON.stringify(event.raw_eventbrite)}, now(), now()
    )
    on conflict (eventbrite_id) do update set
      title = excluded.title,
      summary = excluded.summary,
      description = excluded.description,
      image_url = excluded.image_url,
      image_alt = excluded.image_alt,
      starts_at = excluded.starts_at,
      ends_at = excluded.ends_at,
      timezone = excluded.timezone,
      location = excluded.location,
      organiser = excluded.organiser,
      category = excluded.category,
      classifications = excluded.classifications,
      format = excluded.format,
      sales_status = excluded.sales_status,
      price_label = excluded.price_label,
      cta_label = excluded.cta_label,
      cta_url = excluded.cta_url,
      source_url = excluded.source_url,
      source = excluded.source,
      eventbrite_url = excluded.eventbrite_url,
      eventbrite_status = excluded.eventbrite_status,
      eventbrite_published_at = excluded.eventbrite_published_at,
      is_active = excluded.is_active,
      is_hidden = excluded.is_hidden,
      raw_eventbrite = excluded.raw_eventbrite,
      last_synced_at = now(),
      updated_at = now()
  `;
}

async function upsertClassifications(sql, names) {
  for (const name of names) {
    await sql`
      insert into event_classifications (name, slug, classification_type, source)
      values (${name}, ${slugify(name)}, 'eventbrite', 'eventbrite')
      on conflict (slug) do nothing
    `;
  }
}

async function getClassificationVisibility(sql) {
  const rows = await sql`select slug, is_visible from event_classifications`;
  return new Map(rows.map((row) => [row.slug, row.is_visible]));
}

async function refreshEventVisibility(sql) {
  const visibility = await getClassificationVisibility(sql);
  const rows = await sql`select id, classifications from events where coalesce(source, '') = 'eventbrite'`;
  for (const row of rows) {
    const classifications = Array.isArray(row.classifications) ? row.classifications : [];
    const hidden = classifications.some((name) => visibility.get(slugify(name)) === false);
    await sql`update events set is_hidden = ${hidden}, updated_at = now() where id = ${row.id}`;
  }
}

function maskSettings(settings) {
  return {
    ...settings,
    has_token: Boolean(settings?.private_token_encrypted || process.env.EVENTBRITE_PRIVATE_TOKEN),
    private_token_encrypted: undefined,
  };
}

function encryptSecret(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', secretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ['v1', iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join(':');
}

function decryptSecret(value) {
  if (!value || !value.startsWith('v1:')) return '';
  const [, ivRaw, tagRaw, encryptedRaw] = value.split(':');
  const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey(), Buffer.from(ivRaw, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedRaw, 'base64url')), decipher.final()]).toString('utf8');
}

function secretKey() {
  const secret = process.env.DASHBOARD_SECRET || process.env.DATABASE_URL || 'local-development-secret';
  return crypto.createHash('sha256').update(secret).digest();
}

function nullable(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || null;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(Math.round(number), min), max);
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'event';
}
