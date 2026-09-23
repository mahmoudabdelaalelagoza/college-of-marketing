import { clean, getSql, methodNotAllowed, sendJson } from '../../lib/dashboard-auth.js';
import { getResource, listResources } from '../../lib/cms-resources.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  const resourceName = clean(req.query?.resource, 80);
  if (resourceName === 'resources') return sendJson(res, 200, { resources: listResources() });

  const resource = getResource(resourceName);
  if (!resource) return sendJson(res, 404, { error: 'Unknown resource.' });

  const slug = clean(req.query?.slug, 160);
  const sql = getSql();
  const where = publicWhere(resource);
  const params = [];
  let query = `select * from ${resource.table}`;

  if (slug) {
    query += ` where ${where ? `${where} and ` : ''}slug = $1`;
    params.push(slug);
  } else if (where) {
    query += ` where ${where}`;
  }

  query += orderBy(resource);
  const rows = await sql.query(query, params);
  return sendJson(res, 200, { resource: resourceName, items: rows, item: slug ? rows[0] || null : undefined });
}

function publicWhere(resource) {
  if (resource.public?.published) return 'is_published = true';
  if (resource.public?.approved) return "status = 'approved' and consent = true";
  if (resource.public?.active) return 'is_active = true';
  if (resource.public?.visible) return 'is_visible = true';
  if (resource.table === 'site_settings') return 'is_public = true';
  return '';
}

function orderBy(resource) {
  if (resource.table === 'events') return ' order by starts_at asc nulls last, display_order asc, created_at desc';
  if (resource.fields.includes('display_order')) return ' order by display_order asc, created_at desc';
  return ' order by created_at desc';
}
