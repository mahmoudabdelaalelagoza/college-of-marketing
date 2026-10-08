import { requireSupabase, supabaseError } from '@/lib/supabase';

export interface SiteAccessSettings {
  maintenance_enabled: boolean;
  protected_paths: string[];
  has_preview_pin: boolean;
  title: string;
  message: string;
  updated_at: string | null;
}

const defaults: SiteAccessSettings = {
  maintenance_enabled: false,
  protected_paths: [],
  has_preview_pin: false,
  title: 'Website under construction',
  message: 'Enter the 6-digit preview code to view the work in progress.',
  updated_at: null,
};

export async function getSiteAccessSettings() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('site_access_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw new Error(supabaseError(error, 'Could not load site access settings.'));
  return { settings: toSettings(data) };
}

export async function saveSiteAccessSettings(settings: Record<string, unknown>) {
  const client = requireSupabase();
  const previewPin = String(settings.preview_pin || '').trim();

  if (previewPin) {
    const { error } = await client.rpc('set_site_preview_pin', { pin: previewPin });
    if (error) throw new Error(supabaseError(error, 'Could not save preview PIN.'));
  }

  if (settings.clear_preview_pin) {
    const { error } = await client.rpc('clear_site_preview_pin');
    if (error) throw new Error(supabaseError(error, 'Could not clear preview PIN.'));
  }

  const { data, error } = await client
    .from('site_access_settings')
    .upsert({
      id: 1,
      maintenance_enabled: Boolean(settings.maintenance_enabled),
      protected_paths: normalizePaths(String(settings.protected_paths || '')),
      title: String(settings.title || defaults.title).trim() || defaults.title,
      message: String(settings.message || defaults.message).trim() || defaults.message,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw new Error(supabaseError(error, 'Could not save site access settings.'));
  return { settings: toSettings(data) };
}

function normalizePaths(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((path) => path.trim())
        .filter(Boolean)
        .map((path) => {
          const normalized = path.startsWith('/') ? path : `/${path}`;
          return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
        }),
    ),
  );
}

function toSettings(row: { maintenance_enabled?: boolean; protected_paths?: unknown; preview_pin_hash?: string | null; title?: string | null; message?: string | null; updated_at?: string | null } | null): SiteAccessSettings {
  const protectedPaths = Array.isArray(row?.protected_paths)
    ? row.protected_paths.filter((path): path is string => typeof path === 'string')
    : [];

  return {
    maintenance_enabled: Boolean(row?.maintenance_enabled),
    protected_paths: protectedPaths,
    has_preview_pin: Boolean(row?.preview_pin_hash),
    title: row?.title || defaults.title,
    message: row?.message || defaults.message,
    updated_at: row?.updated_at || null,
  };
}