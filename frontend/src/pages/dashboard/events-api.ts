import { dashboardRequest } from './api';

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

export function getDashboardEvents(q = '') {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  const query = params.toString();
  return dashboardRequest<DashboardEventsPayload>(`/api/dashboard/events${query ? `?${query}` : ''}`);
}

export function saveEventbriteSettings(settings: Record<string, unknown>) {
  return dashboardRequest<{ settings: DashboardEventbriteSettings }>('/api/dashboard/events', {
    method: 'POST',
    body: JSON.stringify({ action: 'save-settings', settings }),
  });
}

export function testEventbriteConnection() {
  return dashboardRequest<{ result: { ok: boolean; count: number }; settings: DashboardEventbriteSettings }>('/api/dashboard/events', {
    method: 'POST',
    body: JSON.stringify({ action: 'test-connection' }),
  });
}

export function syncEventbrite() {
  return dashboardRequest<DashboardEventsPayload & { job: EventbriteSyncJob }>('/api/dashboard/events', {
    method: 'POST',
    body: JSON.stringify({ action: 'sync' }),
  });
}

export function addEventClassification(classification: { name: string; slug: string; type: string }) {
  return dashboardRequest<{ classification: EventClassification }>('/api/dashboard/events', {
    method: 'POST',
    body: JSON.stringify({ action: 'add-classification', classification }),
  });
}

export function updateEventClassification(id: string, classification: { is_visible: boolean }) {
  return dashboardRequest<{ classification: EventClassification }>('/api/dashboard/events', {
    method: 'PATCH',
    body: JSON.stringify({ action: 'classification', id, classification }),
  });
}

export function updateEventVisibility(id: string, event: { is_hidden: boolean; is_active?: boolean }) {
  return dashboardRequest<{ event: DashboardManagedEvent }>('/api/dashboard/events', {
    method: 'PATCH',
    body: JSON.stringify({ action: 'event-visibility', id, event }),
  });
}
