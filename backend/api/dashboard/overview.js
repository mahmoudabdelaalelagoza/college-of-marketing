import { getSql, methodNotAllowed, requireDashboardUser, sendJson } from '../../lib/dashboard-auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  const user = await requireDashboardUser(req, res);
  if (!user) return;

  const sql = getSql();
  const leadRows = await sql`
    select
      count(*)::int as total,
      count(*) filter (where status = 'new')::int as new_count,
      count(*) filter (where is_read = false)::int as unread_count,
      count(*) filter (where follow_up_at is not null and follow_up_at <= now())::int as due_followups
    from lead_submissions
  `;
  const newsletterRows = await sql`select count(*)::int as total from newsletter_subscriptions`;
  const recent = await sql`
    select id, name, email, organisation, interest, source, status, is_read, created_at
    from lead_submissions
    order by created_at desc
    limit 5
  `;

  return sendJson(res, 200, {
    leads: leadRows[0] || { total: 0, new_count: 0, unread_count: 0, due_followups: 0 },
    newsletters: newsletterRows[0] || { total: 0 },
    recentLeads: recent,
  });
}
