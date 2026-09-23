import crypto from 'node:crypto';
import { clean, hashRequestKey } from './dashboard-auth.js';

export async function getAssistantDashboard(sql) {
  await ensureAssistantSettings(sql);
  const settingsRows = await sql`select * from assistant_settings where id = 1 limit 1`;
  const sources = await sql`select * from knowledge_sources order by is_active desc, created_at desc limit 200`;
  const dailyRows = await sql`select count(*)::int as count from assistant_chat_logs where created_at >= now() - interval '24 hours'`;
  return {
    settings: maskSettings(settingsRows[0]),
    sources,
    stats: {
      active_sources: sources.filter((source) => source.is_active).length,
      requests_24h: dailyRows[0]?.count || 0,
    },
  };
}

export async function saveAssistantSettings(sql, input, userId) {
  await ensureAssistantSettings(sql);
  const existingRows = await sql`select api_key_encrypted from assistant_settings where id = 1 limit 1`;
  const existingKey = existingRows[0]?.api_key_encrypted || null;
  const removeKey = Boolean(input.remove_api_key);
  const nextKey = typeof input.api_key === 'string' && input.api_key.trim()
    ? encryptSecret(input.api_key.trim())
    : removeKey
      ? null
      : existingKey;

  const rows = await sql`
    update assistant_settings
       set api_endpoint = ${nullable(input.api_endpoint)},
           api_key_encrypted = ${nextKey},
           model = ${clean(input.model, 120) || 'gpt-4.1-mini'},
           daily_request_limit = ${clampNumber(input.daily_request_limit, 1, 10000, 500)},
           assistant_name = ${clean(input.assistant_name, 120) || 'College assistant'},
           welcome_message = ${clean(input.welcome_message, 600) || 'Hi, I can help with College of Marketing programmes, courses, funding and events.'},
           fallback_message = ${clean(input.fallback_message, 600) || 'I could not find a confident answer. Please book a consultation and our team will help you.'},
           is_enabled = ${Boolean(input.is_enabled)},
           updated_by = ${userId},
           updated_at = now()
     where id = 1
     returning *
  `;

  return maskSettings(rows[0]);
}

export async function createAssistantSource(sql, input) {
  const title = clean(input.title, 240);
  const content = clean(input.content, 20000);
  if (!title || !content) throw new Error('Title and answer/content are required.');

  const rows = await sql`
    insert into knowledge_sources (title, kind, reference_path, content, import_key, is_active)
    values (${title}, ${clean(input.kind, 80) || 'Q&A'}, ${nullable(input.reference_path)}, ${content}, ${nullable(input.import_key)}, ${'is_active' in input ? Boolean(input.is_active) : true})
    returning *
  `;
  return rows[0];
}

export async function updateAssistantSource(sql, id, input) {
  const rows = await sql`
    update knowledge_sources
       set title = ${clean(input.title, 240)},
           kind = ${clean(input.kind, 80) || 'Q&A'},
           reference_path = ${nullable(input.reference_path)},
           content = ${clean(input.content, 20000)},
           is_active = ${Boolean(input.is_active)},
           updated_at = now()
     where id = ${id}
     returning *
  `;
  return rows[0] || null;
}

export async function deleteAssistantSource(sql, id) {
  await sql`delete from knowledge_sources where id = ${id}`;
  return { ok: true };
}

export async function getPublicAssistantSettings(sql) {
  await ensureAssistantSettings(sql);
  const rows = await sql`select assistant_name, welcome_message, is_enabled from assistant_settings where id = 1 limit 1`;
  return rows[0] || null;
}

export async function answerAssistantQuestion(sql, input, req) {
  await ensureAssistantSettings(sql);
  const question = clean(input.question, 1200);
  if (!question) throw new Error('Question is required.');

  const settingsRows = await sql`select * from assistant_settings where id = 1 limit 1`;
  const settings = settingsRows[0];
  if (!settings?.is_enabled) return { answer: settings?.fallback_message || 'Assistant is not enabled yet.', disabled: true };

  const requestKey = hashRequestKey(getRequestKey(req));
  const countRows = await sql`
    select count(*)::int as count
    from assistant_chat_logs
    where request_key = ${requestKey}
      and created_at >= now() - interval '24 hours'
  `;
  if ((countRows[0]?.count || 0) >= settings.daily_request_limit) {
    return { answer: 'Daily assistant limit reached. Please try again tomorrow.', limited: true };
  }

  const sources = await findRelevantSources(sql, question);
  let answer = '';
  let success = false;

  try {
    if (settings.api_endpoint) {
      answer = await callProvider(settings, question, sources);
      success = true;
    }
  } catch (error) {
    answer = error instanceof Error ? `Assistant provider error: ${error.message}` : settings.fallback_message;
  }

  if (!answer) {
    answer = localKnowledgeAnswer(question, sources) || settings.fallback_message;
    success = Boolean(sources.length);
  }

  await sql`
    insert into assistant_chat_logs (request_key, question, answer, success)
    values (${requestKey}, ${question}, ${answer.slice(0, 4000)}, ${success})
  `;

  return { answer, sources: sources.map((source) => ({ title: source.title, reference_path: source.reference_path })) };
}

async function ensureAssistantSettings(sql) {
  await sql`
    insert into assistant_settings (id, api_endpoint)
    values (1, 'https://api.openai.com/v1/responses')
    on conflict (id) do nothing
  `;
}

async function findRelevantSources(sql, question) {
  const words = question.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2).slice(0, 8);
  if (words.length === 0) {
    return sql`select * from knowledge_sources where is_active = true order by updated_at desc limit 6`;
  }

  const like = `%${words.join('%')}%`;
  const broad = `%${question.slice(0, 120)}%`;
  return sql.query(
    `select * from knowledge_sources
      where is_active = true
        and (lower(coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(reference_path, '')) like $1
          or coalesce(title, '') ilike $2
          or coalesce(content, '') ilike $2)
      order by updated_at desc
      limit 8`,
    [like, broad],
  );
}

async function callProvider(settings, question, sources) {
  const apiKey = process.env.ASSISTANT_API_KEY || decryptSecret(settings.api_key_encrypted || '');
  const context = sources.map((source, index) => `Source ${index + 1}: ${source.title}\n${source.content}`).join('\n\n');
  const prompt = [
    'You are the College of Marketing website assistant.',
    'Answer visitors in clear English. Use only the supplied website context. If the answer is not in the context, say that the team can help via consultation.',
    context ? `Website context:\n${context}` : 'Website context: No approved sources are active yet.',
    `Visitor question: ${question}`,
  ].join('\n\n');

  const endpoint = settings.api_endpoint;
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const body = endpoint.includes('/chat/completions')
    ? { model: settings.model, messages: [{ role: 'user', content: prompt }], temperature: 0.2 }
    : endpoint.includes('/responses')
      ? { model: settings.model, input: prompt }
      : { model: settings.model, question, prompt, context: sources };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || payload.error || response.statusText);
  return extractAnswer(payload);
}

function extractAnswer(payload) {
  if (typeof payload.answer === 'string') return payload.answer;
  if (typeof payload.message === 'string') return payload.message;
  if (typeof payload.output_text === 'string') return payload.output_text;
  const chatText = payload.choices?.[0]?.message?.content;
  if (typeof chatText === 'string') return chatText;
  const responseText = payload.output?.flatMap((item) => item.content || []).find((item) => item.type === 'output_text')?.text;
  if (typeof responseText === 'string') return responseText;
  return '';
}

function localKnowledgeAnswer(question, sources) {
  if (!sources.length) return '';
  const best = sources[0];
  return best.content || `I found this source: ${best.title}`;
}

function maskSettings(settings) {
  return {
    id: settings?.id || 1,
    api_endpoint: settings?.api_endpoint || '',
    model: settings?.model || 'gpt-4.1-mini',
    daily_request_limit: settings?.daily_request_limit || 500,
    assistant_name: settings?.assistant_name || 'College assistant',
    welcome_message: settings?.welcome_message || '',
    fallback_message: settings?.fallback_message || '',
    is_enabled: Boolean(settings?.is_enabled),
    has_api_key: Boolean(settings?.api_key_encrypted || process.env.ASSISTANT_API_KEY),
    updated_at: settings?.updated_at || null,
  };
}

function encryptSecret(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', secretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ['v1', iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join(':');
}

function decryptSecret(value) {
  if (!value || !value.startsWith('v1:')) return '';
  const [, ivRaw, tagRaw, encryptedRaw] = value.split(':');
  const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey(), Buffer.from(ivRaw, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedRaw, 'base64url')), decipher.final()]).toString('utf8');
}

function secretKey() {
  const secret = process.env.DASHBOARD_SECRET || process.env.DATABASE_URL || 'local-development-secret';
  return crypto.createHash('sha256').update(secret).digest();
}

function nullable(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || null;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(Math.round(number), min), max);
}

function getRequestKey(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}
