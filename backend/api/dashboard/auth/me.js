import { methodNotAllowed, requireDashboardUser, sendJson } from '../../../lib/dashboard-auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  const user = await requireDashboardUser(req, res);
  if (!user) return;

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
