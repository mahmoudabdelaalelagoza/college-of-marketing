import { requireSupabase, supabaseError } from '@/lib/supabase';

export interface CmsResourceOption {
  id: string;
  label: string;
  icon: string;
}

export const cmsResourceOptions: CmsResourceOption[] = [
  { id: 'articles', label: 'Articles', icon: 'ri-article-line' },
  { id: 'case-studies', label: 'Case Studies', icon: 'ri-briefcase-4-line' },
  { id: 'testimonials', label: 'Testimonials', icon: 'ri-chat-quote-line' },
  { id: 'events', label: 'Events', icon: 'ri-calendar-event-line' },
  { id: 'short-courses', label: 'Short Courses', icon: 'ri-graduation-cap-line' },
  { id: 'people', label: 'People', icon: 'ri-team-line' },
  { id: 'partners', label: 'Partners', icon: 'ri-handshake-line' },
  { id: 'media', label: 'Media', icon: 'ri-image-line' },
  { id: 'page-sections', label: 'Pages & Sections', icon: 'ri-layout-3-line' },
  { id: 'knowledge-sources', label: 'Knowledge Sources', icon: 'ri-book-open-line' },
  { id: 'settings', label: 'Site Settings', icon: 'ri-settings-3-line' },
];

export interface CmsItem {
  id?: string;
  [key: string]: unknown;
}

interface CmsResourceConfig {
  table: string;
  fields: string[];
  search: string[];
  json?: string[];
  booleans?: string[];
  numbers?: string[];
}

const resources: Record<string, CmsResourceConfig> = {
  articles: { table: 'articles', fields: ['title', 'slug', 'excerpt', 'content', 'category', 'author', 'image_url', 'image_alt', 'read_minutes', 'is_published', 'published_at', 'display_order'], search: ['title', 'slug', 'excerpt', 'category', 'author'], numbers: ['read_minutes', 'display_order'], booleans: ['is_published'] },
  'case-studies': { table: 'case_studies', fields: ['title', 'slug', 'sector', 'client_name', 'headline', 'summary', 'challenge', 'approach', 'outcome', 'metrics', 'image_url', 'image_alt', 'is_featured', 'is_published', 'published_at', 'display_order'], search: ['title', 'slug', 'sector', 'client_name', 'headline', 'summary'], json: ['metrics'], numbers: ['display_order'], booleans: ['is_featured', 'is_published'] },
  testimonials: { table: 'testimonials', fields: ['name', 'programme', 'reviewer_type', 'photo_url', 'review_text', 'consent', 'status', 'is_featured', 'display_order', 'moderation_notes'], search: ['name', 'programme', 'reviewer_type', 'review_text'], numbers: ['display_order'], booleans: ['consent', 'is_featured'] },
  events: { table: 'events', fields: ['title', 'slug', 'summary', 'description', 'image_url', 'image_alt', 'starts_at', 'ends_at', 'timezone', 'location', 'organiser', 'category', 'classifications', 'format', 'sales_status', 'price_label', 'cta_label', 'cta_url', 'source_url', 'display_order', 'is_active', 'is_featured'], search: ['title', 'slug', 'summary', 'location', 'organiser', 'category', 'format'], json: ['classifications'], numbers: ['display_order'], booleans: ['is_active', 'is_featured'] },
  'short-courses': { table: 'short_courses', fields: ['slug', 'title', 'category', 'duration', 'format', 'owner', 'audience', 'summary', 'focus_list', 'detail', 'icon', 'image_url', 'display_order', 'is_active'], search: ['slug', 'title', 'category', 'owner', 'audience', 'summary'], json: ['focus_list', 'detail'], numbers: ['display_order'], booleans: ['is_active'] },
  people: { table: 'people_profiles', fields: ['name', 'initials', 'role_title', 'affiliation', 'specialties', 'biography', 'image_url', 'link_url', 'display_order', 'is_active'], search: ['name', 'role_title', 'affiliation', 'biography'], json: ['specialties'], numbers: ['display_order'], booleans: ['is_active'] },
  partners: { table: 'partner_logos', fields: ['name', 'slug', 'kind', 'description', 'icon', 'image_url', 'link_url', 'display_order', 'is_active'], search: ['name', 'slug', 'kind', 'description'], numbers: ['display_order'], booleans: ['is_active'] },
  media: { table: 'media_assets', fields: ['title', 'url', 'alt_text', 'source_url'], search: ['title', 'url', 'alt_text', 'source_url'] },
  'page-sections': { table: 'page_content_sections', fields: ['page_path', 'section_key', 'field_key', 'field_type', 'draft_value', 'published_value', 'is_visible'], search: ['page_path', 'section_key', 'field_key', 'draft_value', 'published_value'], booleans: ['is_visible'] },
  'knowledge-sources': { table: 'knowledge_sources', fields: ['title', 'kind', 'reference_path', 'content', 'import_key', 'is_active'], search: ['title', 'kind', 'reference_path', 'content', 'import_key'], booleans: ['is_active'] },
  settings: { table: 'site_settings', fields: ['setting_key', 'setting_value', 'setting_type', 'is_public'], search: ['setting_key', 'setting_value'], booleans: ['is_public'] },
};

export async function getCmsResources() {
  return { resources: cmsResourceOptions };
}

export async function getCmsItems(resource: string, q = '') {
  const config = getConfig(resource);
  const client = requireSupabase();
  let query = client.from(config.table).select('*').limit(200);
  if (q.trim()) {
    const safe = q.trim().replaceAll(',', ' ');
    query = query.or(config.search.map((field) => `${field}.ilike.%${safe}%`).join(','));
  }
  query = query.order('created_at', { ascending: false, nullsFirst: false });
  const { data, error } = await query;
  if (error) throw new Error(supabaseError(error, 'Could not load CMS resource.'));
  return { resource, items: (data || []) as CmsItem[] };
}

export async function createCmsItem(resource: string, item: CmsItem) {
  const config = getConfig(resource);
  const client = requireSupabase();
  const { data, error } = await client.from(config.table).insert(cleanItem(config, item)).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not create item.'));
  return { item: data as CmsItem };
}

export async function updateCmsItem(resource: string, id: string, item: CmsItem, action?: string) {
  const config = getConfig(resource);
  const client = requireSupabase();
  const payload = action === 'publish'
    ? { published_value: String(item.draft_value ?? ''), updated_at: new Date().toISOString() }
    : { ...cleanItem(config, item), updated_at: new Date().toISOString() };

  if (action === 'publish') {
    const current = await client.from(config.table).select('draft_value').eq('id', id).single();
    if (current.error) throw new Error(supabaseError(current.error, 'Could not publish item.'));
    payload.published_value = String((current.data as { draft_value?: string | null }).draft_value || '');
  }

  const { data, error } = await client.from(config.table).update(payload).eq('id', id).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not update item.'));
  return { item: data as CmsItem };
}

export async function deleteCmsItem(resource: string, id: string) {
  const config = getConfig(resource);
  const client = requireSupabase();
  const { error } = await client.from(config.table).delete().eq('id', id);
  if (error) throw new Error(supabaseError(error, 'Could not delete item.'));
  return { ok: true };
}

function getConfig(resource: string) {
  const config = resources[resource];
  if (!config) throw new Error(`Unknown CMS resource: ${resource}`);
  return config;
}

function cleanItem(config: CmsResourceConfig, item: CmsItem) {
  const next: Record<string, unknown> = {};
  for (const field of config.fields) {
    const raw = item[field];
    if (config.booleans?.includes(field)) next[field] = Boolean(raw);
    else if (config.numbers?.includes(field)) next[field] = Number(raw || 0);
    else if (config.json?.includes(field)) next[field] = parseJsonValue(raw, field === 'detail' ? {} : []);
    else next[field] = raw === '' ? null : raw;
  }
  return next;
}

function parseJsonValue(value: unknown, fallback: unknown) {
  if (typeof value !== 'string') return value ?? fallback;
  try {
    return value.trim() ? JSON.parse(value) : fallback;
  } catch {
    throw new Error('Invalid JSON field. Please check the value and try again.');
  }
}
