import fs from 'node:fs';
import { neon } from '@neondatabase/serverless';
import { createPasswordHash } from '../backend/lib/dashboard-auth.js';

loadEnv();

const email = clean(process.env.ADMIN_EMAIL || process.env.DASHBOARD_ADMIN_EMAIL, 320).toLowerCase();
const username = clean(process.env.ADMIN_USERNAME || process.env.DASHBOARD_ADMIN_USERNAME, 80).toLowerCase() || null;
const name = clean(process.env.ADMIN_NAME || process.env.DASHBOARD_ADMIN_NAME || 'Dashboard Admin', 160);
const password = process.env.ADMIN_PASSWORD || process.env.DASHBOARD_ADMIN_PASSWORD || '';

if (!process.env.DATABASE_URL) {
  fail('DATABASE_URL is missing. Add it to .env first.');
}

if (!email || !email.includes('@')) {
  fail('ADMIN_EMAIL is required. Example: $env:ADMIN_EMAIL="admin@example.com"');
}

if (!password || password.length < 12) {
  fail('ADMIN_PASSWORD is required and must be at least 12 characters.');
}

const sql = neon(process.env.DATABASE_URL);
const passwordHash = createPasswordHash(password);
const rows = await sql`
  insert into dashboard_users (email, username, name, password_hash, role, is_active)
  values (${email}, ${username}, ${name}, ${passwordHash}, 'admin', true)
  on conflict (email) do update
    set username = excluded.username,
        name = excluded.name,
        password_hash = excluded.password_hash,
        is_active = true,
        updated_at = now()
  returning id, email, username, name, role, is_active
`;

console.log(JSON.stringify({ ok: true, user: rows[0] }, null, 2));

function loadEnv() {
  if (!fs.existsSync('.env')) return;
  const env = fs.readFileSync('.env', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (process.env[key]) continue;
    process.env[key] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
