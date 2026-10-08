import { getSql, methodNotAllowed, readJson, requireDashboardUser, sendJson } from '../../lib/dashboard-auth.js';
import { dashboardSiteAccessPayload, getSiteAccessSettings, updateSiteAccessSettings } from '../../lib/site-access.js';

export default async function handler(req, res) {
  const user = await requireDashboardUser(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') {
      const sql = getSql();
      const settings = await getSiteAccessSettings(sql);
      return sendJson(res, 200, { settings: dashboardSiteAccessPayload(settings) });
    }

    if (req.method === 'POST' || req.method === 'PATCH') {
      const body = await readJson(req);
      const sql = getSql();
      const settings = await updateSiteAccessSettings(sql, body.settings || body, user.id);
      return sendJson(res, 200, { settings });
    }

    return methodNotAllowed(res, 'GET, POST, PATCH');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Site access request failed.';
    return sendJson(res, 400, { error: message });
  }
}
