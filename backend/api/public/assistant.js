import { getSql, methodNotAllowed, readJson, sendJson } from '../../lib/dashboard-auth.js';
import { answerAssistantQuestion, getPublicAssistantSettings } from '../../lib/assistant.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const sql = getSql();
      const settings = await getPublicAssistantSettings(sql);
      return sendJson(res, 200, { settings });
    }

    if (req.method === 'POST') {
      const body = await readJson(req);
      const sql = getSql();
      const result = await answerAssistantQuestion(sql, body, req);
      return sendJson(res, 200, result);
    }

    return methodNotAllowed(res, 'GET, POST');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Assistant is unavailable.';
    return sendJson(res, 400, { error: message });
  }
}
