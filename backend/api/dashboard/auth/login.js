import {
  clean,
  createSessionToken,
  getRequestIp,
  getSql,
  hashRequestKey,
  methodNotAllowed,
  readJson,
  sendJson,
  setSessionCookie,
  verifyPassword,
} from '../../../lib/dashboard-auth.js';

const MAX_FAILED_ATTEMPTS = 8;

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  const body = await readJson(req);
  const identifier = clean(body.identifier, 320).toLowerCase();
  const password = clean(body.password, 500);

  if (!identifier || !password) {
    return sendJson(res, 400, { error: 'Email/username and password are required.' });
  }

  const sql = getSql();
  const requestKey = hashRequestKey(`${getRequestIp(req)}|${identifier}`);
  const attempts = await sql`
    select count(*)::int as count
    from dashboard_login_attempts
    where request_key = ${requestKey}
      and success = false
      and created_at > now() - interval '15 minutes'
  `;

  if ((attempts[0]?.count || 0) >= MAX_FAILED_ATTEMPTS) {
    return sendJson(res, 429, { error: 'Too many login attempts. Please try again later.' });
  }

  const users = await sql`
    select id, email, username, name, password_hash, role, is_active
    from dashboard_users
    where lower(email) = ${identifier}
       or lower(coalesce(username, '')) = ${identifier}
    limit 1
  `;
  const user = users[0];
  const valid = Boolean(user?.is_active) && verifyPassword(password, user.password_hash);

  await sql`
    insert into dashboard_login_attempts (request_key, identifier, success)
    values (${requestKey}, ${identifier}, ${valid})
  `;

  if (!valid) {
    return sendJson(res, 401, { error: 'Invalid credentials.' });
  }

  await sql`update dashboard_users set last_login_at = now(), updated_at = now() where id = ${user.id}`;

  const token = createSessionToken(user);
  setSessionCookie(res, token);
  return sendJson(res, 200, {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });
}
