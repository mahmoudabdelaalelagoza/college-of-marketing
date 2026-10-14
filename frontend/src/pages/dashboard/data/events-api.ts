import { requireSupabase, supabaseError } from '@/lib/supabase';

export interface DashboardEventbriteSettings {
  organization_id: string | null;
  public_backend_url: string | null;
  sync_interval_minutes: number;
  auto_sync_enabled: boolean;
  show_uncategorized: boolean;
  connection_status: string;
  last_test_at: string | null;
  last_full_sync_at: string | null;
  last_sync_status: string | null;
  has_token: boolean;
}

export interface DashboardManagedEvent {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  category: string | null;
  classifications: string[] | null;
  format: string | null;
  sales_status: string | null;
  cta_url: string | null;
  eventbrite_id: string | null;
  eventbrite_status: string | null;
  is_active: boolean;
  is_hidden: boolean;
  last_synced_at: string | null;
}

export interface EventClassification {
  id: string;
  name: string;
  slug: string;
  classification_type: string;
  source: string;
  is_visible: boolean;
}

export interface EventbriteSyncJob {
  id: string;
  sync_type: string;
  status: string;
  trigger_source: string;
  attempt: number;
  created_count: number;
  updated_count: number;
  hidden_count: number;
  skipped_count: number;
  message: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

export interface DashboardEventsPayload {
  events: DashboardManagedEvent[];
  stats: {
    total: number;
    public_upcoming: number;
    public_past: number;
    hidden_draft: number;
  };
  classifications: EventClassification[];
  jobs: EventbriteSyncJob[];
  settings: DashboardEventbriteSettings;
  worker: { status: string };
}

type EventbriteSettingsRecord = Partial<DashboardEventbriteSettings> & {
  private_token_encrypted?: string | null;
  has_token?: boolean | null;
};

type WorkerErrorResponse = { error?: string };

const emptySettings: DashboardEventbriteSettings = {
  organization_id: null,
  public_backend_url: null,
  sync_interval_minutes: 15,
  auto_sync_enabled: false,
  show_uncategorized: true,
  connection_status: 'unverified',
  last_test_at: null,
  last_full_sync_at: null,
  last_sync_status: null,
  has_token: false,
};

export async function getDashboardEvents(q = ''): Promise<DashboardEventsPayload> {
  const client = requireSupabase();
  let eventsQuery = client
    .from('events')
    .select('id,title,slug,summary,starts_at,ends_at,location,category,classifications,format,sales_status,cta_url,eventbrite_id,eventbrite_status,is_active,is_hidden,last_synced_at')
    .order('starts_at', { ascending: false, nullsFirst: false })
    .limit(200);

  if (q.trim()) {
    const safe = q.trim().replaceAll(',', ' ');
    eventsQuery = eventsQuery.or(`title.ilike.%${safe}%,summary.ilike.%${safe}%,location.ilike.%${safe}%,category.ilike.%${safe}%`);
  }

  const [eventsResult, classificationsResult, jobsResult, settingsResult] = await Promise.all([
    eventsQuery,
    client.from('event_classifications').select('*').order('name'),
    client.from('eventbrite_sync_jobs').select('*').order('created_at', { ascending: false }).limit(50),
    client.from('eventbrite_settings').select('*').eq('id', 1).maybeSingle(),
  ]);

  if (eventsResult.error) throw new Error(supabaseError(eventsResult.error, 'Could not load events.'));
  if (classificationsResult.error) throw new Error(supabaseError(classificationsResult.error, 'Could not load classifications.'));
  if (jobsResult.error) throw new Error(supabaseError(jobsResult.error, 'Could not load sync jobs.'));

  const events = ((eventsResult.data || []) as DashboardManagedEvent[]).map((event) => ({
    ...event,
    classifications: Array.isArray(event.classifications) ? event.classifications : [],
  }));

  return {
    events,
    stats: getStats(events),
    classifications: (classificationsResult.data || []) as EventClassification[],
    jobs: (jobsResult.data || []) as EventbriteSyncJob[],
    settings: normaliseSettings(settingsResult.data as EventbriteSettingsRecord | null),
    worker: { status: 'supabase-edge-function' },
  };
}

export function saveEventbriteSettings(settings: Record<string, unknown>) {
  return invokeEventbriteWorker<{ settings: DashboardEventbriteSettings }>('save-settings', { settings });
}

export function testEventbriteConnection(): Promise<{ result: { ok: boolean; count: number }; settings: DashboardEventbriteSettings }> {
  return invokeEventbriteWorker('test');
}

export async function syncEventbrite(): Promise<DashboardEventsPayload & { job: EventbriteSyncJob }> {
  const result = await invokeEventbriteWorker<{ job: EventbriteSyncJob }>('sync');
  const next = await getDashboardEvents();
  return { ...next, job: result.job };
}

export async function addEventClassification(classification: { name: string; slug: string; type: string }) {
  const client = requireSupabase();
  const { data, error } = await client.from('event_classifications').insert({
    name: classification.name,
    slug: classification.slug,
    classification_type: classification.type || 'local',
    source: 'dashboard',
    is_visible: true,
  }).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not add classification.'));
  return { classification: data as EventClassification };
}

export async function updateEventClassification(id: string, classification: { is_visible: boolean }) {
  const client = requireSupabase();
  const { data, error } = await client.from('event_classifications').update({
    is_visible: classification.is_visible,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not update classification.'));
  return { classification: data as EventClassification };
}

export async function updateEventVisibility(id: string, event: { is_hidden: boolean; is_active?: boolean }) {
  const client = requireSupabase();
  const { data, error } = await client.from('events').update({
    is_hidden: event.is_hidden,
    is_active: event.is_active ?? true,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select('id,title,slug,summary,starts_at,ends_at,location,category,classifications,format,sales_status,cta_url,eventbrite_id,eventbrite_status,is_active,is_hidden,last_synced_at').single();
  if (error) throw new Error(supabaseError(error, 'Could not update event.'));
  return { event: data as DashboardManagedEvent };
}

async function invokeEventbriteWorker<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const client = requireSupabase();
  const { data: sessionData, error: sessionError } = await client.auth.getSession();

  if (sessionError) throw new Error(supabaseError(sessionError, 'Could not read dashboard session.'));
  if (!sessionData.session?.access_token) throw new Error('Dashboard sign-in required before using Eventbrite sync.');

  const { data, error } = await client.functions.invoke<T & WorkerErrorResponse>('eventbrite-sync', {
    body: { action, ...body },
    headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
  });

  if (error) throw new Error(supabaseError(error, 'Eventbrite worker failed. Make sure the eventbrite-sync Supabase function is deployed.'));
  if (data?.error) throw new Error(data.error);
  if (!data) throw new Error('Eventbrite worker returned an empty response.');

  return data;
}

function getStats(events: DashboardManagedEvent[]) {
  const now = Date.now();
  return {
    total: events.length,
    public_upcoming: events.filter((event) => event.is_active && !event.is_hidden && event.starts_at && new Date(event.starts_at).getTime() >= now).length,
    public_past: events.filter((event) => event.is_active && !event.is_hidden && event.starts_at && new Date(event.starts_at).getTime() < now).length,
    hidden_draft: events.filter((event) => event.is_hidden || !event.is_active).length,
  };
}

function normaliseSettings(settings: EventbriteSettingsRecord | null): DashboardEventbriteSettings {
  const { private_token_encrypted: token, has_token: hasToken, ...safeSettings } = settings || {};
  return { ...emptySettings, ...safeSettings, has_token: Boolean(hasToken || token) };
}
