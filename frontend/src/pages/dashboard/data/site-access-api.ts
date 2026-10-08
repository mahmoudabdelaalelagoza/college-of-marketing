import { requireSupabase, supabaseError } from '@/lib/supabase';

export interface SiteAccessSettings {
  maintenance_enabled: boolean;
  has_preview_pin: boolean;
  title: string;
  message: string;
  updated_at: string | null;
}

const defaults: SiteAccessSettings = {
  maintenance_enabled: false,
  has_preview_pin: false,
  title: 'Website under construction',
  message: 'Enter the 6-digit preview code to view the work in progress.',
  updated_at: null,
};

export async function getSiteAccessSettings() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('site_access_settings')
    .select('maintenance_enabled,preview_pin_hash,title,message,updated_at')
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
      title: String(settings.title || defaults.title).trim() || defaults.title,
      message: String(settings.message || defaults.message).trim() || defaults.message,
      updated_at: new Date().toISOString(),
    })
    .select('maintenance_enabled,preview_pin_hash,title,message,updated_at')
    .single();

  if (error) throw new Error(supabaseError(error, 'Could not save site access settings.'));
  return { settings: toSettings(data) };
}

function toSettings(row: { maintenance_enabled?: boolean; preview_pin_hash?: string | null; title?: string | null; message?: string | null; updated_at?: string | null } | null): SiteAccessSettings {
  return {
    maintenance_enabled: Boolean(row?.maintenance_enabled),
    has_preview_pin: Boolean(row?.preview_pin_hash),
    title: row?.title || defaults.title,
    message: row?.message || defaults.message,
    updated_at: row?.updated_at || null,
  };
}
