import { clean, getSql, methodNotAllowed, readJson, requireDashboardUser, sendJson } from '../../lib/dashboard-auth.js';

const statuses = new Set(['new', 'contacted', 'qualified', 'closed']);

export default async function handler(req, res) {
  const user = await requireDashboardUser(req, res);
  if (!user) return;

  if (req.method === 'GET') return listLeads(req, res);
  if (req.method === 'PATCH') return updateLead(req, res, user);
  return methodNotAllowed(res, 'GET, PATCH');
}

async function listLeads(req, res) {
  const sql = getSql();
  const query = req.query || {};
  const status = clean(query.status, 40);
  const search = clean(query.q, 120);
  const unreadOnly = String(query.unread || '') === '1';
  const limit = Math.min(Math.max(Number(query.limit || 50), 1), 100);
  const searchLike = `%${search}%`;

  const rows = await sql.query(
    `select id, name, email, organisation, interest, message, source, status, is_read,
            assigned_to, internal_notes, follow_up_at, created_at, updated_at
       from lead_submissions
      where ($1 = '' or status = $1)
        and ($2 = false or is_read = false)
        and (
          $3 = ''
          or name ilike $4
          or email ilike $4
          or coalesce(organisation, '') ilike $4
          or coalesce(interest, '') ilike $4
          or coalesce(message, '') ilike $4
        )
      order by created_at desc
      limit $5`,
    [status, unreadOnly, search, searchLike, limit],
  );

  const stats = await sql`
    select
      count(*)::int as total,
      count(*) filter (where status = 'new')::int as new_count,
      count(*) filter (where is_read = false)::int as unread_count,
      count(*) filter (where follow_up_at is not null and follow_up_at <= now())::int as due_followups
    from lead_submissions
  `;

  return sendJson(res, 200, { leads: rows, stats: stats[0] });
}

async function updateLead(req, res, user) {
  const body = await readJson(req);
  const id = clean(body.id, 80);
  if (!id) return sendJson(res, 400, { error: 'Lead id is required.' });

  const status = body.status === undefined ? undefined : clean(body.status, 40);
  if (status !== undefined && !statuses.has(status)) {
    return sendJson(res, 400, { error: 'Invalid lead status.' });
  }

  const isRead = typeof body.is_read === 'boolean' ? body.is_read : undefined;
  const internalNotes = body.internal_notes === undefined ? undefined : clean(body.internal_notes, 2000);
  const followUpAt = body.follow_up_at === undefined ? undefined : clean(body.follow_up_at, 80);

  const sql = getSql();
  const currentRows = await sql`select * from lead_submissions where id = ${id} limit 1`;
  const current = currentRows[0];
  if (!current) return sendJson(res, 404, { error: 'Lead not found.' });

  const nextStatus = status ?? current.status;
  const nextRead = isRead ?? current.is_read;
  const nextNotes = internalNotes ?? current.internal_notes;
  const nextFollowUp = followUpAt === undefined ? current.follow_up_at : followUpAt || null;

  const rows = await sql`
    update lead_submissions
       set status = ${nextStatus},
           is_read = ${nextRead},
           internal_notes = ${nextNotes || null},
           follow_up_at = ${nextFollowUp},
           assigned_to = coalesce(assigned_to, ${user.id}),
           updated_at = now()
     where id = ${id}
     returning id, name, email, organisation, interest, message, source, status, is_read,
               assigned_to, internal_notes, follow_up_at, created_at, updated_at
  `;

  return sendJson(res, 200, { lead: rows[0] });
}
