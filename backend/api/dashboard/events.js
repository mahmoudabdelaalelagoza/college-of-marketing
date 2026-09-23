import { clean, getSql, methodNotAllowed, readJson, requireDashboardUser, sendJson } from '../../lib/dashboard-auth.js';
import {
  addClassification,
  getEventbriteSettings,
  listEventDashboard,
  saveEventbriteSettings,
  syncEventbriteEvents,
  testEventbriteConnection,
  updateClassification,
  updateEventVisibility,
} from '../../lib/eventbrite.js';

export default async function handler(req, res) {
  const user = await requireDashboardUser(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') return listEvents(req, res);
    if (req.method === 'POST') return postAction(req, res, user);
    if (req.method === 'PATCH') return patchAction(req, res);
    return methodNotAllowed(res, 'GET, POST, PATCH');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Events request failed.';
    return sendJson(res, 400, { error: message });
  }
}

async function listEvents(req, res) {
  const q = clean(req.query?.q, 120);
  const sql = getSql();
  const payload = await listEventDashboard(sql, q);
  return sendJson(res, 200, payload);
}

async function postAction(req, res, user) {
  const body = await readJson(req);
  const action = clean(body.action, 80);
  const sql = getSql();

  if (action === 'save-settings') {
    const settings = await saveEventbriteSettings(sql, body.settings || body, user.id);
    return sendJson(res, 200, { settings });
  }

  if (action === 'test-connection') {
    const result = await testEventbriteConnection(sql);
    const settings = await getEventbriteSettings(sql);
    return sendJson(res, 200, { result, settings });
  }

  if (action === 'sync') {
    const job = await syncEventbriteEvents(sql, 'dashboard');
    const payload = await listEventDashboard(sql, '');
    return sendJson(res, 200, { job, ...payload });
  }

  if (action === 'add-classification') {
    const classification = await addClassification(sql, body.classification || body);
    return sendJson(res, 201, { classification });
  }

  return sendJson(res, 400, { error: 'Unknown events action.' });
}

async function patchAction(req, res) {
  const body = await readJson(req);
  const action = clean(body.action, 80);
  const id = clean(body.id, 80);
  const sql = getSql();

  if (!id) return sendJson(res, 400, { error: 'ID is required.' });

  if (action === 'classification') {
    const classification = await updateClassification(sql, id, body.classification || body);
    if (!classification) return sendJson(res, 404, { error: 'Classification not found.' });
    return sendJson(res, 200, { classification });
  }

  if (action === 'event-visibility') {
    const event = await updateEventVisibility(sql, id, body.event || body);
    if (!event) return sendJson(res, 404, { error: 'Event not found.' });
    return sendJson(res, 200, { event });
  }

  return sendJson(res, 400, { error: 'Unknown events action.' });
}
