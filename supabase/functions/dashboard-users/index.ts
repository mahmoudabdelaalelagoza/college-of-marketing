import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type StaffRole = 'admin' | 'editor';
type StaffProfile = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

class RequestError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405);

  try {
    const url = requireEnv('SUPABASE_URL');
    const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const adminId = await requireAdmin(client, request.headers.get('authorization') || '');
    const body = await request.json();
    const action = String(body?.action || '');

    if (action === 'list') {
      const { data, error } = await client.from('dashboard_profiles')
        .select('id,email,name,role,is_active,created_at,updated_at')
        .order('name');
      if (error) throw error;
      return respond({ users: data as StaffProfile[] });
    }

    if (action === 'invite') {
      const email = String(body.email || '').trim().toLowerCase();
      const name = requiredName(body.name);
      const role = requiredRole(body.role);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        throw new RequestError('Enter a valid email address.');
      }

      const { data: existing, error: lookupError } = await client.from('dashboard_profiles')
        .select('id').eq('email', email).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) throw new RequestError('This email already has a dashboard account.');

      const redirectTo = Deno.env.get('DASHBOARD_INVITE_REDIRECT_URL') ||
        'https://marketing.kentbusinesscollege.com/dashboard/set-password';
      const { data: invitation, error: inviteError } = await client.auth.admin.inviteUserByEmail(email, {
        redirectTo,
        data: { name },
      });
      if (inviteError) throw inviteError;
      if (!invitation.user) throw new Error('The invitation did not create an Auth user.');

      const { data: profile, error: profileError } = await client.from('dashboard_profiles')
        .insert({ id: invitation.user.id, email, name, role, is_active: true })
        .select('id,email,name,role,is_active,created_at,updated_at').single();
      if (profileError) {
        throw new Error(`Invitation sent, but profile setup failed for Auth user ${invitation.user.id}. Add its dashboard profile manually. ${profileError.message}`);
      }
      return respond({ user: profile as StaffProfile });
    }

    if (action === 'update') {
      const id = String(body.id || '');
      const name = requiredName(body.name);
      const role = requiredRole(body.role);
      const isActive = body.is_active;
      if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id) || typeof isActive !== 'boolean') {
        throw new RequestError('Invalid user details.');
      }
      const { data: current, error: currentError } = await client.from('dashboard_profiles')
        .select('id,role,is_active').eq('id', id).maybeSingle();
      if (currentError) throw currentError;
      if (!current) throw new RequestError('Dashboard user not found.', 404);
      if (id === adminId && (role !== 'admin' || !isActive)) {
        throw new RequestError('You cannot remove your own admin access.');
      }
      if (current.role === 'admin' && current.is_active && (role !== 'admin' || !isActive)) {
        const { count, error: countError } = await client.from('dashboard_profiles')
          .select('id', { count: 'exact', head: true }).eq('role', 'admin').eq('is_active', true);
        if (countError) throw countError;
        if ((count || 0) <= 1) throw new RequestError('Keep at least one active admin account.');
      }
      const { data: profile, error: updateError } = await client.from('dashboard_profiles')
        .update({ name, role, is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id).select('id,email,name,role,is_active,created_at,updated_at').single();
      if (updateError) throw updateError;
      return respond({ user: profile as StaffProfile });
    }

    throw new RequestError('Unknown action.');
  } catch (error) {
    const status = error instanceof RequestError ? error.status : 400;
    return respond({ error: error instanceof Error ? error.message : 'Request failed.' }, status);
  }
});

function respond(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

async function requireAdmin(client: ReturnType<typeof createClient>, authorization: string) {
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new RequestError('Dashboard sign-in required.', 401);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw new RequestError('Dashboard sign-in required.', 401);
  const { data: profile, error: profileError } = await client.from('dashboard_profiles')
    .select('id').eq('id', data.user.id).eq('role', 'admin').eq('is_active', true).maybeSingle();
  if (profileError) throw profileError;
  if (!profile) throw new RequestError('Admin access required.', 403);
  return data.user.id;
}

function requiredName(value: unknown) {
  const name = String(value || '').trim();
  if (name.length < 2 || name.length > 100) throw new RequestError('Name must be 2 to 100 characters.');
  return name;
}

function requiredRole(value: unknown): StaffRole {
  if (value !== 'admin' && value !== 'editor') throw new RequestError('Choose a valid role.');
  return value;
}