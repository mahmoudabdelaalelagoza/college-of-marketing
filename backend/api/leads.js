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

  // The browser strips the honeypot before posting, so it is only ever filled
  // in by a bot. Report success so the sender gets no useful signal.
  if (isHoneypotTripped(body)) {
    return sendJson(res, 201, { ok: true });
  }

  if (isRateLimited(`leads:${clientKey(req)}`)) {
    return sendJson(res, 429, { error: 'Too many submissions. Please try again shortly.' });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const organisation = clean(body.organisation, 200);
  const interest = clean(body.interest, 200);
  const message = clean(body.message, 2000);
  const source = clean(body.source, 80) || 'website';

  if (!name || !isValidEmail(email)) {
    return sendJson(res, 400, { error: 'Please provide a valid name and email address.' });
  }

  if (!process.env.DATABASE_URL) {
    return sendJson(res, 503, { error: 'Enquiries are not available at the moment.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      insert into lead_submissions (name, email, organisation, interest, message, source)
      values (${name}, ${email}, ${organisation || null}, ${interest || null}, ${message || null}, ${source})
    `;
  } catch (error) {
    console.error('lead_submissions insert failed', error);
    return sendJson(res, 500, { error: 'We could not save your enquiry. Please try again.' });
  }

  return sendJson(res, 201, { ok: true });
}
