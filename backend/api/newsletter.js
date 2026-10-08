import { neon } from '@neondatabase/serverless';
import {
  clean,
  clientKey,
  isHoneypotTripped,
  isRateLimited,
  isValidEmail,
  parseBody,
  sendJson,
} from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const body = parseBody(req);
  if (!body) {
    return sendJson(res, 400, { error: 'Malformed request.' });
  }

  if (isHoneypotTripped(body)) {
    return sendJson(res, 201, { ok: true });
  }

  if (isRateLimited(`newsletter:${clientKey(req)}`, 8)) {
    return sendJson(res, 429, { error: 'Too many requests. Please try again shortly.' });
  }

  const email = clean(body.email, 320);
  if (!isValidEmail(email)) {
    return sendJson(res, 400, { error: 'Please provide a valid email address.' });
  }

  if (!process.env.DATABASE_URL) {
    return sendJson(res, 503, { error: 'Subscriptions are not available at the moment.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      insert into newsletter_subscriptions (email)
      values (${email})
      on conflict (email) do nothing
    `;
  } catch (error) {
    console.error('newsletter_subscriptions insert failed', error);
    return sendJson(res, 500, { error: 'We could not save your subscription. Please try again.' });
  }

  return sendJson(res, 201, { ok: true });
}
