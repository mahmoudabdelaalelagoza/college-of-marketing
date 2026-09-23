import { clearSessionCookie, methodNotAllowed, sendJson } from '../../../lib/dashboard-auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  clearSessionCookie(res);
  return sendJson(res, 200, { ok: true });
}
