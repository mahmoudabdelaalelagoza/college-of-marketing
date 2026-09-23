import { neon } from '@neondatabase/serverless';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  if (!process.env.DATABASE_URL) {
    return res.status(503).send('DATABASE_URL is not configured yet.');
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const name = clean(body.name);
  const email = clean(body.email);
  const organisation = clean(body.organisation);
  const interest = clean(body.interest);
  const message = clean(body.message);

  if (!name || !emailPattern.test(email)) {
    return res.status(400).send('Please provide a valid name and email address.');
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    insert into lead_submissions (name, email, organisation, interest, message)
    values (${name}, ${email}, ${organisation || null}, ${interest || null}, ${message || null})
  `;

  return res.status(201).json({ ok: true });
}

function clean(value) {
  return typeof value === 'string' ? value.trim().slice(0, 1000) : '';
}
