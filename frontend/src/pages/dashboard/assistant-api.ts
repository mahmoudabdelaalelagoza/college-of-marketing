import { dashboardRequest } from './api';

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

export function getAssistantDashboard() {
  return dashboardRequest<AssistantDashboardPayload>('/api/dashboard/assistant');
}

export function saveAssistantSettings(settings: Record<string, unknown>) {
  return dashboardRequest<{ settings: AssistantSettings }>('/api/dashboard/assistant', {
    method: 'POST',
    body: JSON.stringify({ action: 'save-settings', settings }),
  });
}

export function createAssistantSource(source: Partial<AssistantSource>) {
  return dashboardRequest<{ source: AssistantSource }>('/api/dashboard/assistant', {
    method: 'POST',
    body: JSON.stringify({ action: 'create-source', source }),
  });
}

export function updateAssistantSource(id: string, source: Partial<AssistantSource>) {
  return dashboardRequest<{ source: AssistantSource }>('/api/dashboard/assistant', {
    method: 'PATCH',
    body: JSON.stringify({ id, source }),
  });
}

export function deleteAssistantSource(id: string) {
  const params = new URLSearchParams({ id });
  return dashboardRequest<{ ok: boolean }>(`/api/dashboard/assistant?${params.toString()}`, { method: 'DELETE' });
}
