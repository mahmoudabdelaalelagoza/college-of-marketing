import { neon } from '@neondatabase/serverless';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value);
}

export function clean(value, max = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Parse a request body that may already be an object (Vercel, local Vite
 * middleware) or a raw JSON string. Returns an empty object for anything
 * unparseable instead of throwing, so a malformed request produces a 400
 * rather than an unhandled 500.
 */
export function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return null;
    }
  }
  return {};
}

export function isHoneypotTripped(body) {
  return ['website_alt', 'phone_alt'].some(
    (field) => clean(body[field], 200).length > 0,
  );
}

/**
 * Minimal in-memory throttle, adequate for a single serverless instance.
 * Protects the public write endpoints from trivial form spam.
 */
const attempts = new Map();

export function isRateLimited(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const hits = (attempts.get(key) || []).filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    attempts.set(key, hits);
    return true;
  }

  hits.push(now);
  attempts.set(key, hits);
  return false;
}

export function clientKey(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '';
  return ip || req.socket?.remoteAddress || 'unknown';
}

export function getRequestIp(req) {
  return clientKey(req);
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
