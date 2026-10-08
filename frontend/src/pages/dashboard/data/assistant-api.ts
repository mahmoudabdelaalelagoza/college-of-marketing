import { requireSupabase, supabaseError } from '@/lib/supabase';

export interface AssistantSettings {
  id: number;
  api_endpoint: string;
  model: string;
  daily_request_limit: number;
  assistant_name: string;
  welcome_message: string;
  fallback_message: string;
  is_enabled: boolean;
  has_api_key: boolean;
  updated_at: string | null;
}

export interface AssistantSource {
  id: string;
  title: string;
  kind: string;
  reference_path: string | null;
  content: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssistantDashboardPayload {
  settings: AssistantSettings;
  sources: AssistantSource[];
  stats: {
    active_sources: number;
    requests_24h: number;
  };
}

const defaultSettings: AssistantSettings = {
  id: 1,
  api_endpoint: '',
  model: 'static-fallback',
  daily_request_limit: 0,
  assistant_name: 'College assistant',
  welcome_message: 'Hi, I can help with College of Marketing programmes, courses, funding and events.',
  fallback_message: 'Please book a consultation and our team will help you.',
  is_enabled: false,
  has_api_key: false,
  updated_at: null,
};

export async function getAssistantDashboard(): Promise<AssistantDashboardPayload> {
  const client = requireSupabase();
  const [settingsResult, sourcesResult, logsResult] = await Promise.all([
    client.from('assistant_settings').select('*').eq('id', 1).maybeSingle(),
    client.from('knowledge_sources').select('*').order('created_at', { ascending: false }),
    client.from('assistant_chat_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ]);

  if (settingsResult.error) throw new Error(supabaseError(settingsResult.error, 'Could not load assistant settings.'));
  if (sourcesResult.error) throw new Error(supabaseError(sourcesResult.error, 'Could not load assistant sources.'));

  const sources = (sourcesResult.data || []) as AssistantSource[];
  return {
    settings: toSettings(settingsResult.data as Partial<AssistantSettings> | null),
    sources,
    stats: {
      active_sources: sources.filter((source) => source.is_active).length,
      requests_24h: logsResult.count || 0,
    },
  };
}

export async function saveAssistantSettings(settings: Record<string, unknown>) {
  const client = requireSupabase();
  const { data, error } = await client.from('assistant_settings').upsert({
    id: 1,
    api_endpoint: String(settings.api_endpoint || '').trim() || null,
    model: String(settings.model || 'static-fallback').trim(),
    daily_request_limit: Number(settings.daily_request_limit || 0),
    assistant_name: String(settings.assistant_name || defaultSettings.assistant_name).trim(),
    welcome_message: String(settings.welcome_message || defaultSettings.welcome_message).trim(),
    fallback_message: String(settings.fallback_message || defaultSettings.fallback_message).trim(),
    is_enabled: Boolean(settings.is_enabled),
    updated_at: new Date().toISOString(),
  }).select('*').single();

  if (error) throw new Error(supabaseError(error, 'Could not save assistant settings.'));
  return { settings: toSettings(data as Partial<AssistantSettings>) };
}

export async function createAssistantSource(source: Partial<AssistantSource>) {
  const client = requireSupabase();
  const { data, error } = await client.from('knowledge_sources').insert({
    title: source.title || 'Untitled source',
    kind: source.kind || 'FAQ',
    reference_path: source.reference_path || null,
    content: source.content || null,
    is_active: source.is_active ?? true,
  }).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not create source.'));
  return { source: data as AssistantSource };
}

export async function updateAssistantSource(id: string, source: Partial<AssistantSource>) {
  const client = requireSupabase();
  const { data, error } = await client.from('knowledge_sources').update({
    ...source,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not update source.'));
  return { source: data as AssistantSource };
}

export async function deleteAssistantSource(id: string) {
  const client = requireSupabase();
  const { error } = await client.from('knowledge_sources').delete().eq('id', id);
  if (error) throw new Error(supabaseError(error, 'Could not delete source.'));
  return { ok: true };
}

function toSettings(settings: Partial<AssistantSettings> | null): AssistantSettings {
  return { ...defaultSettings, ...(settings || {}), has_api_key: false };
}
