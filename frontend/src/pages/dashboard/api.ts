import { requireSupabase, supabaseError } from '@/lib/supabase';

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

export async function login(identifier: string, password: string) {
  const client = requireSupabase();
  const email = identifier.trim();
  if (!email.includes('@')) throw new Error('Use your dashboard email address to sign in.');

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(supabaseError(error, 'Could not sign in.'));
  if (!data.user) throw new Error('Could not sign in.');

  return getCurrentUser();
}

export async function getCurrentUser() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('Not signed in.');

  const { data: profile, error: profileError } = await client
    .from('dashboard_profiles')
    .select('id,email,username,name,role,is_active')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) throw new Error(supabaseError(profileError, 'Could not load dashboard user.'));
  if (profile && profile.is_active === false) throw new Error('Dashboard user is inactive.');

  const metadata = data.user.user_metadata || {};
  const user: DashboardUser = {
    id: data.user.id,
    email: profile?.email || data.user.email || '',
    username: profile?.username || null,
    name: profile?.name || String(metadata.name || data.user.email || 'Dashboard user'),
    role: profile?.role || 'admin',
  };

  return { user };
}

export async function logout() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw new Error(supabaseError(error, 'Could not sign out.'));
  return { ok: true };
}

export async function getOverview(): Promise<OverviewPayload> {
  const [leadsPayload, newslettersTotal] = await Promise.all([
    getLeads(),
    countRows('newsletter_subscriptions'),
  ]);

  return {
    leads: leadsPayload.stats,
    newsletters: { total: newslettersTotal },
    recentLeads: leadsPayload.leads.slice(0, 6),
  };
}

export async function getLeads(params: { status?: string; q?: string; unread?: boolean } = {}) {
  const client = requireSupabase();
  let query = client
    .from('lead_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (params.status) query = query.eq('status', params.status);
  if (params.unread) query = query.eq('is_read', false);
  if (params.q?.trim()) {
    const q = params.q.trim().replaceAll(',', ' ');
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,organisation.ilike.%${q}%,message.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(supabaseError(error, 'Could not load leads.'));

  const leads = (data || []) as DashboardLead[];
  return { leads, stats: getLeadStats(leads) };
}

export async function updateLead(payload: Partial<DashboardLead> & { id: string }) {
  const client = requireSupabase();
  const { id, ...changes } = payload;
  const { data, error } = await client
    .from('lead_submissions')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(supabaseError(error, 'Could not update lead.'));
  return { lead: data as DashboardLead };
}

async function countRows(table: string) {
  const client = requireSupabase();
  const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(supabaseError(error, `Could not count ${table}.`));
  return count || 0;
}

function getLeadStats(leads: DashboardLead[]): LeadStats {
  const now = Date.now();
  return {
    total: leads.length,
    new_count: leads.filter((lead) => lead.status === 'new').length,
    unread_count: leads.filter((lead) => !lead.is_read).length,
    due_followups: leads.filter((lead) => lead.follow_up_at && new Date(lead.follow_up_at).getTime() <= now).length,
  };
}
