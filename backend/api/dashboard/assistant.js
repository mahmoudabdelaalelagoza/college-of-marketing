import { clean, getSql, methodNotAllowed, readJson, requireDashboardUser, sendJson } from '../../lib/dashboard-auth.js';
import {
  createAssistantSource,
  deleteAssistantSource,
  getAssistantDashboard,
  saveAssistantSettings,
  updateAssistantSource,
} from '../../lib/assistant.js';

export default async function handler(req, res) {
  const user = await requireDashboardUser(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') return getDashboard(req, res);
    if (req.method === 'POST') return postAction(req, res, user);
    if (req.method === 'PATCH') return patchAction(req, res);
    if (req.method === 'DELETE') return deleteAction(req, res);
    return methodNotAllowed(res, 'GET, POST, PATCH, DELETE');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Assistant request failed.';
    return sendJson(res, 400, { error: message });
  }
}

async function getDashboard(_req, res) {
  const sql = getSql();
  const payload = await getAssistantDashboard(sql);
  return sendJson(res, 200, payload);
}

async function postAction(req, res, user) {
  const body = await readJson(req);
  const action = clean(body.action, 80);
  const sql = getSql();

  if (action === 'save-settings') {
    const settings = await saveAssistantSettings(sql, body.settings || body, user.id);
    return sendJson(res, 200, { settings });
  }

  if (action === 'create-source') {
    const source = await createAssistantSource(sql, body.source || body);
    return sendJson(res, 201, { source });
  }

  return sendJson(res, 400, { error: 'Unknown assistant action.' });
}

async function patchAction(req, res) {
  const body = await readJson(req);
  const id = clean(body.id || body.source?.id, 80);
  if (!id) return sendJson(res, 400, { error: 'Source id is required.' });

  const sql = getSql();
  const source = await updateAssistantSource(sql, id, body.source || body);
  if (!source) return sendJson(res, 404, { error: 'Source not found.' });
  return sendJson(res, 200, { source });
}

async function deleteAction(req, res) {
  const id = clean(req.query?.id, 80);
  if (!id) return sendJson(res, 400, { error: 'Source id is required.' });

  const sql = getSql();
  const result = await deleteAssistantSource(sql, id);
  return sendJson(res, 200, result);
}
