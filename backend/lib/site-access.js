import crypto from 'node:crypto';
import { clean, createPasswordHash, verifyPassword } from './dashboard-auth.js';

const PREVIEW_COOKIE = 'com_preview_access';
const PREVIEW_MAX_AGE = 60 * 60 * 24 * 7;

export async function ensureSiteAccessSettings(sql) {
  await sql`
    insert into site_access_settings (id)
    values (1)
    on conflict (id) do nothing
  `;
}

export async function getSiteAccessSettings(sql) {
  await ensureSiteAccessSettings(sql);
  const rows = await sql`select * from site_access_settings where id = 1 limit 1`;
  return rows[0];
}

export function publicSiteAccessPayload(settings, req) {
  const unlocked = !settings?.maintenance_enabled || hasValidPreviewCookie(req);
  return {
    maintenance_enabled: Boolean(settings?.maintenance_enabled),
    unlocked,
    title: settings?.title || 'Website under construction',
    message: settings?.message || 'Enter the 6-digit preview code to view the work in progress.',
  };
}

export function dashboardSiteAccessPayload(settings) {
  return {
    maintenance_enabled: Boolean(settings?.maintenance_enabled),
    has_preview_pin: Boolean(settings?.preview_pin_hash),
    title: settings?.title || 'Website under construction',
    message: settings?.message || 'Enter the 6-digit preview code to view the work in progress.',
    updated_at: settings?.updated_at || null,
  };
}

export async function updateSiteAccessSettings(sql, input, userId) {
  await ensureSiteAccessSettings(sql);
  const currentRows = await sql`select preview_pin_hash from site_access_settings where id = 1 limit 1`;
  const currentHash = currentRows[0]?.preview_pin_hash || null;
  const pin = clean(input.preview_pin, 12);
  const clearPin = Boolean(input.clear_preview_pin);
  const nextHash = pin ? createPreviewPinHash(pin) : clearPin ? null : currentHash;
  const maintenanceEnabled = Boolean(input.maintenance_enabled);

  if (pin && !/^\d{6}$/.test(pin)) {
    throw new Error('Preview PIN must be exactly 6 digits.');
  }

  if (maintenanceEnabled && !nextHash) {
    throw new Error('Set a 6-digit preview PIN before enabling maintenance mode.');
  }

  const rows = await sql`
    update site_access_settings
       set maintenance_enabled = ${maintenanceEnabled},
           preview_pin_hash = ${nextHash},
           title = ${clean(input.title, 180) || 'Website under construction'},
           message = ${clean(input.message, 800) || 'We are preparing the College of Marketing website. Enter the 6-digit preview code to view the work in progress.'},
           updated_by = ${userId},
           updated_at = now()
     where id = 1
     returning *
  `;

  return dashboardSiteAccessPayload(rows[0]);
}

export function createPreviewPinHash(pin) {
  return createPasswordHash(pin);
}

export function verifyPreviewPin(pin, storedHash) {
  return /^\d{6}$/.test(String(pin || '')) && verifyPassword(String(pin), storedHash);
}

export function setPreviewCookie(res) {
  const token = createPreviewToken();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${PREVIEW_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${PREVIEW_MAX_AGE}${secure}`);
}

export function clearPreviewCookie(res) {
  res.setHeader('Set-Cookie', `${PREVIEW_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

export function hasValidPreviewCookie(req) {
  const token = parseCookies(req.headers?.cookie || '')[PREVIEW_COOKIE];
  if (!token || !token.includes('.')) return false;
  const [encoded, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  if (!safeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload.scope === 'preview' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function createPreviewToken() {
  const payload = {
    scope: 'preview',
    exp: Math.floor(Date.now() / 1000) + PREVIEW_MAX_AGE,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
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

/**
 * Signing key for preview cookies.
 *
 * The previous fallback was a hard-coded string, so in any deployment missing
 * DASHBOARD_SECRET and DATABASE_URL the cookie signature was publicly known
 * and the maintenance gate could be bypassed by anyone. Outside development we
 * now refuse to sign at all rather than fall back to a guessable secret.
 */
function secret() {
  const configured = process.env.DASHBOARD_SECRET || process.env.DATABASE_URL;
  if (configured) return configured;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DASHBOARD_SECRET or DATABASE_URL must be set in production.');
  }

  return 'local-preview-secret';
}
