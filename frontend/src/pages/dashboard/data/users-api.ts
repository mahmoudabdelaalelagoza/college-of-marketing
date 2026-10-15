import { requireSupabase, supabaseError } from '@/lib/supabase';

export type DashboardRole = 'admin' | 'editor';

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: DashboardRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type WorkerResponse<T> = T & { error?: string };

export function listDashboardUsers() {
  return invoke<{ users: ManagedUser[] }>('list');
}

export function createDashboardUser(payload: { email: string; name: string; role: DashboardRole; password: string }) {
  return invoke<{ user: ManagedUser }>('create', payload);
}

export function updateDashboardUser(payload: { id: string; name: string; role: DashboardRole; is_active: boolean }) {
  return invoke<{ user: ManagedUser }>('update', payload);
}

async function invoke<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const client = requireSupabase();
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw new Error(supabaseError(sessionError, 'Could not read dashboard session.'));
  if (!sessionData.session?.access_token) throw new Error('Dashboard sign-in required.');

  const { data, error } = await client.functions.invoke<WorkerResponse<T>>('dashboard-users', {
    body: { action, ...payload },
    headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
  });
  if (error) {
    const response = error.context;
    if (response instanceof Response) {
      const details = await response.json().catch(() => null) as { error?: string } | null;
      if (details?.error) throw new Error(details.error);
    }
    throw new Error(supabaseError(error, 'Could not reach dashboard user management.'));
  }
  if (data?.error) throw new Error(data.error);
  if (!data) throw new Error('User management returned an empty response.');
  return data;
}