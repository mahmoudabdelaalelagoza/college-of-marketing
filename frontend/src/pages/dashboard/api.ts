export interface DashboardUser {
  id: string;
  email: string;
  username: string | null;
  name: string;
  role: string;
}

export interface DashboardLead {
  id: string;
  name: string;
  email: string;
  organisation: string | null;
  interest: string | null;
  message: string | null;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  is_read: boolean;
  internal_notes: string | null;
  follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadStats {
  total: number;
  new_count: number;
  unread_count: number;
  due_followups: number;
}

export interface OverviewPayload {
  leads: LeadStats;
  newsletters: { total: number };
  recentLeads: DashboardLead[];
}

interface DashboardRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export async function dashboardRequest<T>(path: string, options: DashboardRequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.error || 'Dashboard request failed.';
    throw new Error(message);
  }

  return payload as T;
}

export function login(identifier: string, password: string) {
  return dashboardRequest<{ user: DashboardUser }>('/api/dashboard/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export function getCurrentUser() {
  return dashboardRequest<{ user: DashboardUser }>('/api/dashboard/auth/me');
}

export function logout() {
  return dashboardRequest<{ ok: boolean }>('/api/dashboard/auth/logout', { method: 'POST' });
}

export function getOverview() {
  return dashboardRequest<OverviewPayload>('/api/dashboard/overview');
}

export function getLeads(params: { status?: string; q?: string; unread?: boolean } = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  if (params.q) search.set('q', params.q);
  if (params.unread) search.set('unread', '1');
  const query = search.toString();
  return dashboardRequest<{ leads: DashboardLead[]; stats: LeadStats }>(`/api/dashboard/leads${query ? `?${query}` : ''}`);
}

export function updateLead(payload: Partial<DashboardLead> & { id: string }) {
  return dashboardRequest<{ lead: DashboardLead }>('/api/dashboard/leads', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
