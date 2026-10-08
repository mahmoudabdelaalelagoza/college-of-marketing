import { clean, getSql, methodNotAllowed, sendJson } from '../../lib/dashboard-auth.js';
import { getPublicFieldsByName, getPublicJsonArrayFieldsByName, getResource, listResources } from '../../lib/cms-resources.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  const resourceName = clean(req.query?.resource, 80);
  if (resourceName === 'resources') return sendJson(res, 200, { resources: listResources() });

  const resource = getResource(resourceName);
  if (!resource) return sendJson(res, 404, { error: 'Unknown resource.' });

  // Only explicitly whitelisted columns are selectable. An empty list means the
  // resource has not been reviewed for public exposure, so it is not served.
  const columns = getPublicFieldsByName(resourceName);
  if (columns.length === 0) return sendJson(res, 404, { error: 'Unknown resource.' });

  const slug = clean(req.query?.slug, 160);
  // Page sections are addressed by page path rather than slug.
  const page = clean(req.query?.page, 160);
  const sql = getSql();
  const where = publicWhere(resource);
  const params = [];
  const select = columns.map((column) => `"${column}"`).join(', ');
  let query = `select ${select} from ${resource.table}`;

  if (slug) {
    query += ` where ${where ? `${where} and ` : ''}slug = $1`;
    params.push(slug);
  } else if (page && resource.table === 'page_content_sections') {
    query += ` where ${where ? `${where} and ` : ''}page_path = $1`;
    params.push(page);
  } else if (where) {
    query += ` where ${where}`;
  }

  query += orderBy(resource);
  const rows = await sql.query(query, params);
  const items = normaliseJsonArrays(rows, getPublicJsonArrayFieldsByName(resourceName));
  return sendJson(res, 200, { resource: resourceName, items, item: slug ? items[0] || null : undefined });
}

/**
 * Coerces the jsonb columns declared as arrays into real arrays.
 *
 * The database type `jsonb` does not enforce array shape, so a hand-edited or
 * legacy row can hold `{}` and still be served. Clients are typed against
 * arrays, and anything calling `.map()` on an object throws, taking the whole
 * section down with it. Normalising here keeps the public contract stable
 * without forcing a destructive migration over rows that may not be ours.
 */
function normaliseJsonArrays(rows, arrayFields) {
  if (arrayFields.length === 0) return rows;
  return rows.map((row) => {
    let patched = row;
    for (const field of arrayFields) {
      if (patched[field] === undefined) continue;
      const value = patched[field];
      if (Array.isArray(value)) continue;
      // An empty object carries no entries, so it represents an absent list
      // rather than a list of one blank item. The real `mahmoud abdelaal` row
      // held `{}` here, which would otherwise be published as `[{}]`.
      if (value && typeof value === 'object' && Object.keys(value).length === 0) {
        patched = { ...patched, [field]: [] };
        continue;
      }
      patched = { ...patched, [field]: value === null ? [] : [value] };
    }
    return patched;
  });
}

function publicWhere(resource) {
  if (resource.public?.published) return 'is_published = true';
  if (resource.public?.approved) return "status = 'approved' and consent = true";
  if (resource.table === 'events') return 'is_active = true and coalesce(is_hidden, false) = false';
  if (resource.public?.active) return 'is_active = true';
  if (resource.public?.visible) return 'is_visible = true';
  if (resource.table === 'site_settings') return 'is_public = true';
  return '';
}

function orderBy(resource) {
  if (resource.table === 'events') return ' order by starts_at asc nulls last, display_order asc, created_at desc';
  if (resource.table === 'page_content_sections') return ' order by page_path asc, section_key asc, field_key asc';
  if (resource.fields.includes('display_order')) return ' order by display_order asc, created_at desc';
  return ' order by created_at desc';
}