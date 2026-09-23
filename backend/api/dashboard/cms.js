import { clean, getSql, methodNotAllowed, readJson, requireDashboardUser, sendJson } from '../../lib/dashboard-auth.js';
import { getResource, listResources } from '../../lib/cms-resources.js';

export default async function handler(req, res) {
  const user = await requireDashboardUser(req, res);
  if (!user) return;

  if (req.method === 'GET') return listItems(req, res);
  if (req.method === 'POST') return createItem(req, res, user);
  if (req.method === 'PATCH') return updateItem(req, res, user);
  if (req.method === 'DELETE') return deleteItem(req, res);
  return methodNotAllowed(res, 'GET, POST, PATCH, DELETE');
}

async function listItems(req, res) {
  const resourceName = clean(req.query?.resource, 80);
  if (resourceName === 'resources') return sendJson(res, 200, { resources: listResources() });

  const resource = getResource(resourceName);
  if (!resource) return sendJson(res, 404, { error: 'Unknown CMS resource.' });

  const q = clean(req.query?.q, 120);
  const limit = Math.min(Math.max(Number(req.query?.limit || 100), 1), 200);
  const sql = getSql();
  const rows = q
    ? await searchRows(sql, resource, q, limit)
    : await sql.query(`select * from ${resource.table} order by created_at desc limit $1`, [limit]);

  return sendJson(res, 200, { resource: resourceName, items: rows });
}

async function createItem(req, res, user) {
  const body = await readJson(req);
  const resourceName = clean(body.resource, 80);
  const resource = getResource(resourceName);
  if (!resource) return sendJson(res, 404, { error: 'Unknown CMS resource.' });

  const payload = normalizePayload(resource, body.item || body, user.id);
  if (Object.keys(payload).length === 0) {
    return sendJson(res, 400, { error: 'No fields provided.' });
  }

  const sql = getSql();
  const row = await insertRow(sql, resource.table, payload);
  return sendJson(res, 201, { item: row });
}

async function updateItem(req, res, user) {
  const body = await readJson(req);
  const resourceName = clean(body.resource, 80);
  const id = clean(body.id || body.item?.id, 80);
  const resource = getResource(resourceName);
  if (!resource) return sendJson(res, 404, { error: 'Unknown CMS resource.' });
  if (!id) return sendJson(res, 400, { error: 'Item id is required.' });

  const payload = normalizePayload(resource, body.item || body, user.id);
  delete payload.id;
  delete payload.resource;

  if (body.action === 'publish' && resource.table === 'page_content_sections') {
    return publishPageSection(res, id, user.id);
  }

  if (Object.keys(payload).length === 0) {
    return sendJson(res, 400, { error: 'No fields provided.' });
  }

  const sql = getSql();
  const row = await updateRow(sql, resource.table, id, payload);
  if (!row) return sendJson(res, 404, { error: 'Item not found.' });
  return sendJson(res, 200, { item: row });
}

async function deleteItem(req, res) {
  const resourceName = clean(req.query?.resource, 80);
  const id = clean(req.query?.id, 80);
  const resource = getResource(resourceName);
  if (!resource) return sendJson(res, 404, { error: 'Unknown CMS resource.' });
  if (!id) return sendJson(res, 400, { error: 'Item id is required.' });

  const sql = getSql();
  await sql.query(`delete from ${resource.table} where id = $1`, [id]);
  return sendJson(res, 200, { ok: true });
}

async function searchRows(sql, resource, q, limit) {
  const like = `%${q}%`;
  const clauses = resource.search.map((field, index) => `coalesce(${field}::text, '') ilike $${index + 1}`);
  const params = resource.search.map(() => like);
  params.push(limit);
  return sql.query(
    `select * from ${resource.table} where ${clauses.join(' or ')} order by created_at desc limit $${params.length}`,
    params,
  );
}

function normalizePayload(resource, input, userId) {
  const payload = {};
  for (const field of resource.fields) {
    if (!(field in input)) continue;
    payload[field] = normalizeValue(resource, field, input[field]);
  }

  if ('updated_by' in input && input.updated_by) payload.updated_by = input.updated_by;
  if (resource.table === 'page_content_sections') payload.updated_by = userId;
  if (resource.table === 'media_assets') payload.uploaded_by = userId;
  if (resource.table === 'site_settings') payload.updated_by = userId;
  if (resource.table === 'testimonials' && 'status' in payload && payload.status !== 'pending') {
    payload.reviewed_by = userId;
    payload.reviewed_at = new Date().toISOString();
  }

  return payload;
}

function normalizeValue(resource, field, value) {
  if (resource.booleans.includes(field)) return Boolean(value);
  if (resource.numbers.includes(field)) return Number(value || 0);
  if (resource.json.includes(field)) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return field === 'detail' ? {} : [];
      return JSON.parse(trimmed);
    }
    return value ?? (field === 'detail' ? {} : []);
  }
  return typeof value === 'string' ? value.trim() || null : value ?? null;
}

async function insertRow(sql, table, payload) {
  const columns = Object.keys(payload);
  const placeholders = columns.map((_, index) => `$${index + 1}`);
  const values = columns.map((column) => payload[column]);
  const rows = await sql.query(
    `insert into ${table} (${columns.join(', ')}) values (${placeholders.join(', ')}) returning *`,
    values,
  );
  return rows[0];
}

async function updateRow(sql, table, id, payload) {
  const columns = Object.keys(payload);
  const assignments = columns.map((column, index) => `${column} = $${index + 1}`);
  const values = columns.map((column) => payload[column]);
  values.push(id);
  const rows = await sql.query(
    `update ${table} set ${assignments.join(', ')}, updated_at = now() where id = $${values.length} returning *`,
    values,
  );
  return rows[0] || null;
}

async function publishPageSection(res, id, userId) {
  const sql = getSql();
  const rows = await sql`
    update page_content_sections
       set published_value = draft_value,
           version = version + 1,
           updated_by = ${userId},
           updated_at = now()
     where id = ${id}
     returning *
  `;
  const section = rows[0];
  if (!section) return sendJson(res, 404, { error: 'Item not found.' });

  await sql`
    insert into page_content_versions (page_content_section_id, version, published_value, published_by)
    values (${section.id}, ${section.version}, ${section.published_value}, ${userId})
  `;

  return sendJson(res, 200, { item: section });
}
