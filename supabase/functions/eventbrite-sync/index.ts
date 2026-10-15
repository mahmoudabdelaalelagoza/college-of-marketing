import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type EventbriteSettingsRow = {
  id: number;
  private_token_encrypted: string | null;
  organization_id: string | null;
  public_backend_url: string | null;
  sync_interval_minutes: number;
  auto_sync_enabled: boolean;
  show_uncategorized: boolean;
  connection_status: string;
  last_test_at: string | null;
  last_full_sync_at: string | null;
  last_sync_status: string | null;
};

type EventbriteEvent = {
  id: string;
  name?: { text?: string | null; html?: string | null } | null;
  description?: { text?: string | null; html?: string | null } | null;
  summary?: string | null;
  url?: string | null;
  start?: { utc?: string | null; timezone?: string | null } | null;
  end?: { utc?: string | null; timezone?: string | null } | null;
  status?: string | null;
  published?: string | null;
  logo?: { url?: string | null; original?: { url?: string | null } | null } | null;
  venue?: {
    name?: string | null;
    address?: {
      localized_address_display?: string | null;
      address_1?: string | null;
      city?: string | null;
      country?: string | null;
    } | null;
  } | null;
  category?: { name?: string | null } | null;
  subcategory?: { name?: string | null } | null;
  format?: { name?: string | null } | null;
  online_event?: boolean | null;
  ticket_availability?: {
    minimum_ticket_price?: { display?: string | null } | null;
  } | null;
};

type EventbriteOrganization = { id: string; name: string };
type SupabaseClient = ReturnType<typeof createClient>;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const supabaseUrl = requireEnv('SUPABASE_URL');
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    const authorization = request.headers.get('authorization') || '';

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    await requireDashboardUser(serviceClient, authorization);
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || '');

    if (action === 'save-settings') {
      return json(await saveSettings(serviceClient, body.settings || {}));
    }

    if (action === 'organizations') {
      const settings = await loadSettings(serviceClient);
      const organizations = await listOrganizations(await decryptStoredToken(settings));
      const organizationId = resolveOrganizationId(organizations, settings.organization_id);
      const saved = organizationId !== settings.organization_id
        ? await updateSettingsStatus(serviceClient, {
            organization_id: organizationId,
            connection_status: organizationId ? 'configured' : 'selection-required',
          })
        : settings;
      return json({ settings: safeSettings(saved), organizations });
    }

    if (action === 'test') {
      const settings = await loadSettings(serviceClient);
      const token = await decryptStoredToken(settings);
      const organizations = await listOrganizations(token);
      const organizationId = resolveOrganizationId(organizations, settings.organization_id);
      if (!organizationId) {
        const saved = await updateSettingsStatus(serviceClient, { organization_id: null, connection_status: 'selection-required' });
        return json({ settings: safeSettings(saved), organizations, result: { ok: false, count: 0, needs_selection: true } });
      }
      const events = await fetchEventbrite(organizationId, token, 1);
      const saved = await updateSettingsStatus(serviceClient, {
        organization_id: organizationId,
        connection_status: 'verified',
        last_test_at: new Date().toISOString(),
        last_sync_status: 'Connection verified',
      });
      return json({ settings: safeSettings(saved), organizations, result: { ok: true, count: events.length } });
    }

    if (action === 'sync') {
      const result = await syncEvents(serviceClient);
      return json(result);
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Eventbrite sync error';
    return json({ error: message }, 400);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured for the Eventbrite function.`);
  return value;
}

async function requireDashboardUser(client: SupabaseClient, authorization: string) {
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new Error('Dashboard sign-in required.');
  const { data: authData, error: authError } = await client.auth.getUser(token);
  if (authError || !authData.user) throw new Error('Dashboard sign-in required.');

  const { data: profile, error: profileError } = await client
    .from('dashboard_profiles')
    .select('id')
    .eq('id', authData.user.id)
    .eq('is_active', true)
    .in('role', ['admin', 'editor'])
    .maybeSingle();

  if (profileError || !profile) throw new Error('Dashboard admin access required.');
  return authData.user;
}

async function loadSettings(client: SupabaseClient): Promise<EventbriteSettingsRow> {
  const { data, error } = await client.from('eventbrite_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data as EventbriteSettingsRow;

  const { data: inserted, error: insertError } = await client.from('eventbrite_settings').insert({ id: 1 }).select('*').single();
  if (insertError) throw new Error(insertError.message);
  return inserted as EventbriteSettingsRow;
}

async function saveSettings(client: SupabaseClient, payload: Record<string, unknown>) {
  const existing = await loadSettings(client);
  const privateToken = String(payload.private_token || '').trim();
  const removeToken = Boolean(payload.remove_token);
  const token = removeToken ? null : privateToken || (existing.private_token_encrypted ? await decryptStoredToken(existing) : null);
  const organizations = token ? await listOrganizations(token) : [];
  const requestedOrganizationId = typeof payload.organization_id === 'string'
    ? payload.organization_id.trim()
    : existing.organization_id;
  const organizationId = token ? resolveOrganizationId(organizations, requestedOrganizationId) : null;

  const update: Record<string, unknown> = {
    id: 1,
    organization_id: organizationId,
    public_backend_url: nullableText(payload.public_backend_url),
    sync_interval_minutes: clampInteger(payload.sync_interval_minutes, 5, 1440, 15),
    auto_sync_enabled: Boolean(payload.auto_sync_enabled),
    show_uncategorized: payload.show_uncategorized !== false,
    updated_at: new Date().toISOString(),
    connection_status: !token ? 'unverified' : organizationId ? 'configured' : 'selection-required',
  };

  if (removeToken) {
    update.private_token_encrypted = null;
  } else if (privateToken) {
    update.private_token_encrypted = await encryptText(privateToken);
  }

  const { data, error } = await client.from('eventbrite_settings').upsert(update, { onConflict: 'id' }).select('*').single();
  if (error) throw new Error(error.message);
  return { settings: safeSettings(data as EventbriteSettingsRow), organizations };
}

async function updateSettingsStatus(client: SupabaseClient, patch: Record<string, unknown>) {
  const { data, error } = await client
    .from('eventbrite_settings')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as EventbriteSettingsRow;
}

async function syncEvents(client: SupabaseClient) {
  const settings = await loadSettings(client);
  const token = await decryptStoredToken(settings);
  const organizations = await listOrganizations(token);
  const organizationId = resolveOrganizationId(organizations, settings.organization_id);
  if (!organizationId) throw new Error('Select an Eventbrite organisation in connection settings before syncing.');
  const jobId = crypto.randomUUID();
  const startedAt = new Date().toISOString();

  await client.from('eventbrite_sync_jobs').insert({
    id: jobId,
    sync_type: 'manual',
    status: 'running',
    trigger_source: 'dashboard',
    started_at: startedAt,
  });

  try {
    const eventbriteEvents = await fetchEventbrite(organizationId, token);
    const ids = eventbriteEvents.map((event) => event.id);
    const existingIds = await loadExistingEventbriteIds(client, ids);
    const hiddenStates = await loadExistingHiddenStates(client, ids);
    const rows = eventbriteEvents.map((event) => mapEvent(event, hiddenStates.get(event.id) ?? false));

    let createdCount = 0;
    let updatedCount = 0;

    if (rows.length) {
      createdCount = rows.filter((row) => !existingIds.has(row.eventbrite_id)).length;
      updatedCount = rows.length - createdCount;
      const { error } = await client.from('events').upsert(rows, { onConflict: 'eventbrite_id' });
      if (error) throw new Error(error.message);
    }

    const finishedAt = new Date().toISOString();
    const message = `Synced ${rows.length} Eventbrite event${rows.length === 1 ? '' : 's'}.`;

    await client.from('eventbrite_sync_jobs').update({
      status: 'completed',
      created_count: createdCount,
      updated_count: updatedCount,
      message,
      finished_at: finishedAt,
    }).eq('id', jobId);

    const saved = await updateSettingsStatus(client, {
      organization_id: organizationId,
      connection_status: 'verified',
      last_full_sync_at: finishedAt,
      last_sync_status: message,
    });

    return {
      settings: safeSettings(saved),
      job: {
        id: jobId,
        sync_type: 'manual',
        status: 'completed',
        trigger_source: 'dashboard',
        attempt: 1,
        created_count: createdCount,
        updated_count: updatedCount,
        hidden_count: 0,
        skipped_count: 0,
        message,
        started_at: startedAt,
        finished_at: finishedAt,
        created_at: startedAt,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Eventbrite sync failed';
    await client.from('eventbrite_sync_jobs').update({ status: 'failed', message, finished_at: new Date().toISOString() }).eq('id', jobId);
    await updateSettingsStatus(client, { connection_status: 'failed', last_sync_status: message });
    throw new Error(message);
  }
}

async function listOrganizations(token: string): Promise<EventbriteOrganization[]> {
  const organizations: EventbriteOrganization[] = [];
  let continuation = '';

  for (let page = 0; page < 20; page += 1) {
    const url = new URL('https://www.eventbriteapi.com/v3/users/me/organizations/');
    if (continuation) url.searchParams.set('continuation', continuation);

    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${payload?.error_description || payload?.error || response.statusText}`);
    }
    if (!Array.isArray(payload.organizations)) throw new Error('Eventbrite returned an unexpected organizations response.');

    for (const organization of payload.organizations) {
      if (organization?.id) {
        organizations.push({ id: String(organization.id), name: String(organization.name || 'Unnamed organisation') });
      }
    }

    if (!payload.pagination?.has_more_items) {
      if (!organizations.length) throw new Error('This Eventbrite token has no organisations. Check the token account permissions.');
      return organizations;
    }
    if (!payload.pagination.continuation) throw new Error('Eventbrite did not provide the next organizations page.');
    continuation = payload.pagination.continuation;
  }

  throw new Error('Too many Eventbrite organisations to load.');
}

function resolveOrganizationId(organizations: EventbriteOrganization[], requestedId: string | null) {
  if (requestedId && organizations.some((organization) => organization.id === requestedId)) return requestedId;
  return organizations.length === 1 ? organizations[0].id : null;
}

async function fetchEventbrite(organizationId: string, token: string, limitPages = 10): Promise<EventbriteEvent[]> {
  const events: EventbriteEvent[] = [];
  let continuation = '';

  for (let page = 0; page < limitPages; page += 1) {
    const url = new URL(`https://www.eventbriteapi.com/v3/organizations/${encodeURIComponent(organizationId)}/events/`);
    url.searchParams.set('status', 'live,started');
    url.searchParams.set('order_by', 'start_asc');
    url.searchParams.set('expand', 'venue,ticket_availability,category,subcategory,format,logo');
    if (continuation) url.searchParams.set('continuation', continuation);

    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = payload?.error_description || payload?.error || response.statusText;
      throw new Error(`Eventbrite API error: ${detail}`);
    }

    if (Array.isArray(payload.events)) events.push(...payload.events);
    if (!payload.pagination?.has_more_items || !payload.pagination?.continuation) break;
    continuation = payload.pagination.continuation;
  }

  return events;
}

async function loadExistingEventbriteIds(client: SupabaseClient, ids: string[]) {
  if (!ids.length) return new Set<string>();
  const { data, error } = await client.from('events').select('eventbrite_id').in('eventbrite_id', ids);
  if (error) throw new Error(error.message);
  return new Set((data || []).map((row) => String(row.eventbrite_id)));
}

async function loadExistingHiddenStates(client: SupabaseClient, ids: string[]) {
  if (!ids.length) return new Map<string, boolean>();
  const { data, error } = await client.from('events').select('eventbrite_id, is_hidden').in('eventbrite_id', ids);
  if (error) throw new Error(error.message);
  return new Map((data || []).map((row) => [String(row.eventbrite_id), Boolean(row.is_hidden)]));
}

function mapEvent(event: EventbriteEvent, isHidden: boolean) {
  const title = event.name?.text?.trim() || 'Untitled Event';
  const descriptionText = event.description?.text?.trim() || '';
  const summary = (event.summary || descriptionText.slice(0, 220)).trim() || null;
  const venueAddress = event.venue?.address?.localized_address_display || [event.venue?.address?.address_1, event.venue?.address?.city, event.venue?.address?.country].filter(Boolean).join(', ');
  const location = event.online_event ? 'Online' : [event.venue?.name, venueAddress].filter(Boolean).join(', ');
  const categories = [event.category?.name, event.subcategory?.name, event.format?.name].filter(Boolean);
  const status = event.status || null;

  return {
    title,
    slug: `${slugify(title)}-${event.id}`,
    summary,
    description: event.description?.html || descriptionText || null,
    image_url: event.logo?.original?.url || event.logo?.url || null,
    image_alt: title,
    starts_at: event.start?.utc || null,
    ends_at: event.end?.utc || null,
    timezone: event.start?.timezone || null,
    location: location || null,
    organiser: 'Eventbrite',
    category: event.category?.name || event.subcategory?.name || null,
    classifications: categories,
    format: event.online_event ? 'Online' : event.format?.name || 'In person',
    sales_status: status,
    price_label: event.ticket_availability?.minimum_ticket_price?.display || null,
    cta_label: 'Register',
    cta_url: event.url || null,
    source_url: event.url || null,
    source: 'eventbrite',
    eventbrite_id: event.id,
    eventbrite_url: event.url || null,
    eventbrite_status: status,
    eventbrite_published_at: event.published || null,
    raw_eventbrite: event,
    last_synced_at: new Date().toISOString(),
    is_active: status !== 'canceled',
    is_hidden: isHidden,
  };
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'event';
}

function nullableText(value: unknown) {
  const next = String(value || '').trim();
  return next || null;
}

function clampInteger(value: unknown, min: number, max: number, fallback: number) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function safeSettings(settings: EventbriteSettingsRow) {
  const { private_token_encrypted: token, ...safe } = settings;
  return { ...safe, has_token: Boolean(token) };
}

async function decryptStoredToken(settings: EventbriteSettingsRow) {
  if (!settings.private_token_encrypted) throw new Error('Save an Eventbrite private API token first.');
  return decryptText(settings.private_token_encrypted);
}

async function encryptionKey() {
  const secret = requireEnv('EVENTBRITE_TOKEN_SECRET');
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
  return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function encryptText(value: string) {
  const key = await encryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(value));
  return `${base64(iv)}.${base64(new Uint8Array(cipher))}`;
}

async function decryptText(value: string) {
  const [ivPart, cipherPart] = value.split('.');
  if (!ivPart || !cipherPart) throw new Error('Stored Eventbrite token cannot be read. Save the token again.');
  const key = await encryptionKey();
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(ivPart) }, key, fromBase64(cipherPart));
  return decoder.decode(plain);
}

function base64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}
