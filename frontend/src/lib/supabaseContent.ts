import { requireSupabase, supabaseError } from './supabase';

export interface PublicResourceConfig {
  table: string;
  fields: string;
  order?: string;
  filters?: Array<{ column: string; value: unknown }>;
  jsonArrays?: string[];
}

export const publicResourceConfig: Record<string, PublicResourceConfig> = {
  articles: {
    table: 'articles',
    fields: 'title,slug,excerpt,content,category,author,image_url,image_alt,read_minutes,published_at,display_order',
    filters: [{ column: 'is_published', value: true }],
    order: 'display_order',
  },
  'case-studies': {
    table: 'case_studies',
    fields: 'title,slug,sector,client_name,headline,summary,challenge,approach,outcome,metrics,image_url,image_alt,display_order',
    filters: [{ column: 'is_published', value: true }],
    order: 'display_order',
  },
  testimonials: {
    table: 'testimonials',
    fields: 'name,programme,reviewer_type,photo_url,review_text,display_order',
    filters: [{ column: 'status', value: 'approved' }, { column: 'is_featured', value: true }],
    order: 'display_order',
  },
  events: {
    table: 'events',
    fields: 'title,slug,summary,description,image_url,image_alt,starts_at,ends_at,timezone,location,organiser,category,classifications,format,sales_status,price_label,cta_label,cta_url,source_url,display_order',
    filters: [{ column: 'is_active', value: true }, { column: 'is_hidden', value: false }],
    order: 'starts_at',
    jsonArrays: ['classifications'],
  },
  'short-courses': {
    table: 'short_courses',
    fields: 'slug,title,category,duration,format,owner,audience,summary,focus_list,detail,icon,image_url,display_order',
    filters: [{ column: 'is_active', value: true }],
    order: 'display_order',
    jsonArrays: ['focus_list'],
  },
  people: {
    table: 'people_profiles',
    fields: 'name,initials,role_title,affiliation,specialties,biography,image_url,link_url,display_order',
    filters: [{ column: 'is_active', value: true }],
    order: 'display_order',
    jsonArrays: ['specialties'],
  },
  partners: {
    table: 'partner_logos',
    fields: 'name,slug,kind,description,icon,image_url,link_url,display_order',
    filters: [{ column: 'is_active', value: true }],
    order: 'display_order',
  },
  media: {
    table: 'media_assets',
    fields: 'title,url,alt_text',
    order: 'title',
  },
  'knowledge-sources': {
    table: 'knowledge_sources',
    fields: 'title,kind,reference_path,content',
    filters: [{ column: 'is_active', value: true }],
    order: 'title',
  },
  settings: {
    table: 'site_settings',
    fields: 'setting_key,setting_value,setting_type',
    filters: [{ column: 'is_public', value: true }],
    order: 'setting_key',
  },
};

export async function getPublicItems<T>(resource: string): Promise<T[]> {
  const config = publicResourceConfig[resource];
  if (!config) return [];

  const client = requireSupabase();
  let query = client.from(config.table).select(config.fields);

  for (const filter of config.filters || []) {
    query = query.eq(filter.column, filter.value as never);
  }

  if (config.order) {
    query = query.order(config.order, { ascending: true, nullsFirst: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(supabaseError(error, 'Content unavailable.'));

  return (data || []).map((row) => coerceJsonArrays(row as unknown as Record<string, unknown>, config.jsonArrays || [])) as T[];
}

export async function getPageSectionCopy(pagePath: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('page_content_sections')
    .select('section_key,field_key,published_value')
    .eq('page_path', pagePath)
    .eq('is_visible', true);

  if (error) throw new Error(supabaseError(error, 'Page copy unavailable.'));
  return data || [];
}

function coerceJsonArrays(row: Record<string, unknown>, fields: string[]) {
  const next = { ...row };
  for (const field of fields) {
    if (!Array.isArray(next[field])) next[field] = [];
  }
  return next;
}

