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

const emptySettings: DashboardEventbriteSettings = {
  organization_id: null,
  public_backend_url: null,
  sync_interval_minutes: 15,
  auto_sync_enabled: false,
  show_uncategorized: true,
  connection_status: 'static-hosting',
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
    settings: normaliseSettings(settingsResult.data as Partial<DashboardEventbriteSettings> | null),
    worker: { status: 'static-hosting' },
  };
}

export async function saveEventbriteSettings(settings: Record<string, unknown>) {
  const client = requireSupabase();
  const payload = {
    id: 1,
    organization_id: text(settings.organization_id),
    public_backend_url: text(settings.public_backend_url),
    sync_interval_minutes: Number(settings.sync_interval_minutes || 15),
    auto_sync_enabled: Boolean(settings.auto_sync_enabled),
    show_uncategorized: Boolean(settings.show_uncategorized),
    connection_status: 'static-hosting',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client.from('eventbrite_settings').upsert(payload).select('*').single();
  if (error) throw new Error(supabaseError(error, 'Could not save Eventbrite settings.'));
  return { settings: normaliseSettings(data as Partial<DashboardEventbriteSettings>) };
}

export function testEventbriteConnection(): Promise<{ result: { ok: boolean; count: number }; settings: DashboardEventbriteSettings }> {
  throw new Error('Eventbrite testing needs a server-side worker. Static Hostinger hosting cannot safely call Eventbrite with a private token.');
}

export function syncEventbrite(): Promise<DashboardEventsPayload & { job: EventbriteSyncJob }> {
  throw new Error('Eventbrite sync needs a server-side worker. Manage events manually in the CMS or add a Supabase Edge Function later.');
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

function getStats(events: DashboardManagedEvent[]) {
  const now = Date.now();
  return {
    total: events.length,
    public_upcoming: events.filter((event) => event.is_active && !event.is_hidden && event.starts_at && new Date(event.starts_at).getTime() >= now).length,
    public_past: events.filter((event) => event.is_active && !event.is_hidden && event.starts_at && new Date(event.starts_at).getTime() < now).length,
    hidden_draft: events.filter((event) => event.is_hidden || !event.is_active).length,
  };
}

function normaliseSettings(settings: Partial<DashboardEventbriteSettings> | null): DashboardEventbriteSettings {
  return { ...emptySettings, ...(settings || {}), has_token: false };
}

function text(value: unknown) {
  const next = String(value || '').trim();
  return next || null;
}
