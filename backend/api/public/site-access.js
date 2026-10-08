import { getSql, methodNotAllowed, readJson, sendJson } from '../../lib/dashboard-auth.js';
import {
  clearPreviewCookie,
  getSiteAccessSettings,
  publicSiteAccessPayload,
  setPreviewCookie,
  verifyPreviewPin,
} from '../../lib/site-access.js';

export default async function handler(req, res) {
  try {
    const sql = getSql();

    if (req.method === 'GET') {
      const settings = await getSiteAccessSettings(sql);
      return sendJson(res, 200, publicSiteAccessPayload(settings, req));
    }

    if (req.method === 'POST') {
      const body = await readJson(req);
      const settings = await getSiteAccessSettings(sql);
      if (!settings.maintenance_enabled) {
        clearPreviewCookie(res);
        return sendJson(res, 200, publicSiteAccessPayload(settings, req));
      }

      if (!verifyPreviewPin(body.pin, settings.preview_pin_hash)) {
        return sendJson(res, 401, { error: 'Invalid preview code.' });
      }

      setPreviewCookie(res);
      return sendJson(res, 200, {
        maintenance_enabled: true,
        unlocked: true,
        title: settings.title,
        message: settings.message,
      });
    }

    if (req.method === 'DELETE') {
      clearPreviewCookie(res);
      const settings = await getSiteAccessSettings(sql);
      return sendJson(res, 200, publicSiteAccessPayload(settings, req));
    }

    return methodNotAllowed(res, 'GET, POST, DELETE');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Site access unavailable.';
    return sendJson(res, 400, { error: message });
  }
}
