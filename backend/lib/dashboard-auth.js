import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const SESSION_COOKIE = 'kbc_dashboard_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 180000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_DIGEST = 'sha256';

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }
  return neon(process.env.DATABASE_URL);
}

export { clean } from './http.js';

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('base64url');

  return `pbkdf2_${PASSWORD_DIGEST}$${PASSWORD_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  const [algorithm, iterationsRaw, salt, expected] = storedHash.split('$');
  if (algorithm !== `pbkdf2_${PASSWORD_DIGEST}` || !iterationsRaw || !salt || !expected) {
    return false;
  }

  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations < 100000) return false;

  const actual = crypto
    .pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString('base64url');

  return safeEqual(actual, expected);
}

export function hashRequestKey(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export { getRequestIp } from './http.js';

export function createSessionToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', getDashboardSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export async function requireDashboardUser(req, res) {
  const token = parseCookies(req.headers?.cookie || '')[SESSION_COOKIE];
  const session = verifySessionToken(token);
  if (!session) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return null;
  }

  const sql = getSql();
  const rows = await sql`
    select id, email, username, name, role, is_active
    from dashboard_users
    where id = ${session.sub}
    limit 1
  `;

  const user = rows[0];
  if (!user || !user.is_active) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return null;
  }

  return user;
}

export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}${secure}`,
  );
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

export { sendJson } from './http.js';

export function methodNotAllowed(res, allowed = 'GET') {
  res.setHeader('Allow', allowed);
  sendJson(res, 405, { error: 'Method not allowed' });
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', getDashboardSecret()).update(encoded).digest('base64url');
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [rawKey, ...rest] = pair.trim().split('=');
    if (!rawKey) return cookies;
    cookies[rawKey] = decodeURIComponent(rest.join('='));
    return cookies;
  }, {});
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getDashboardSecret() {
  const secret = process.env.DASHBOARD_SECRET || process.env.DATABASE_URL;
  if (!secret) throw new Error('DASHBOARD_SECRET or DATABASE_URL is required.');
  return secret;
}
