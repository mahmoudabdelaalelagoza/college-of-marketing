create extension if not exists pgcrypto;

create table if not exists dashboard_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text unique,
  name text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table if not exists lead_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  interest text,
  message text,
  source text not null default 'website',
  status text not null default 'new',
  is_read boolean not null default false,
  assigned_to uuid references dashboard_profiles(id) on delete set null,
  internal_notes text,
  follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists lead_submissions
  add column if not exists status text not null default 'new';

alter table if exists lead_submissions
  add column if not exists is_read boolean not null default false;

alter table if exists lead_submissions
  add column if not exists assigned_to uuid references dashboard_profiles(id) on delete set null;

alter table if exists lead_submissions
  add column if not exists internal_notes text;

alter table if exists lead_submissions
  add column if not exists follow_up_at timestamptz;

alter table if exists lead_submissions
  add column if not exists updated_at timestamptz not null default now();

create index if not exists lead_submissions_created_at_idx
  on lead_submissions (created_at desc);

create index if not exists lead_submissions_status_created_at_idx
  on lead_submissions (status, created_at desc);

create index if not exists lead_submissions_is_read_created_at_idx
  on lead_submissions (is_read, created_at desc);

create table if not exists newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'events-newsletter',
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscriptions_created_at_idx
  on newsletter_subscriptions (created_at desc);
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  alt_text text,
  source_url text,
  uploaded_by uuid references dashboard_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_assets_created_at_idx on media_assets (created_at desc);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  category text,
  author text,
  image_url text,
  image_alt text,
  read_minutes integer not null default 3,
  is_published boolean not null default false,
  published_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_public_idx on articles (is_published, published_at desc, display_order);

create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  sector text,
  client_name text,
  headline text,
  summary text,
  challenge text,
  approach text,
  outcome text,
  metrics jsonb not null default '[]'::jsonb,
  image_url text,
  image_alt text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists case_studies_public_idx on case_studies (is_published, is_featured, display_order);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  programme text,
  reviewer_type text,
  photo_url text,
  review_text text not null,
  consent boolean not null default false,
  status text not null default 'pending',
  is_featured boolean not null default false,
  display_order integer not null default 0,
  moderation_notes text,
  reviewed_by uuid references dashboard_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_public_idx on testimonials (status, is_featured, display_order);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  image_url text,
  image_alt text,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  location text,
  organiser text,
  category text,
  classifications jsonb not null default '[]'::jsonb,
  format text,
  sales_status text,
  price_label text,
  cta_label text,
  cta_url text,
  source_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_public_idx on events (is_active, starts_at, display_order);

create table if not exists short_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,
  duration text,
  format text,
  owner text,
  audience text,
  summary text,
  focus_list jsonb not null default '[]'::jsonb,
  detail jsonb not null default '{}'::jsonb,
  icon text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists short_courses_public_idx on short_courses (is_active, display_order);

create table if not exists people_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  initials text,
  role_title text,
  affiliation text,
  specialties jsonb not null default '[]'::jsonb,
  biography text,
  image_url text,
  link_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists people_profiles_public_idx on people_profiles (is_active, display_order);

create table if not exists partner_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  kind text,
  description text,
  icon text,
  image_url text,
  link_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partner_logos_public_idx on partner_logos (is_active, kind, display_order);

create table if not exists page_content_sections (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  section_key text not null,
  field_key text not null,
  field_type text not null default 'text',
  draft_value text,
  published_value text,
  is_visible boolean not null default true,
  version integer not null default 1,
  updated_by uuid references dashboard_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_path, section_key, field_key)
);

create table if not exists page_content_versions (
  id uuid primary key default gen_random_uuid(),
  page_content_section_id uuid not null references page_content_sections(id) on delete cascade,
  version integer not null,
  published_value text,
  published_by uuid references dashboard_profiles(id) on delete set null,
  published_at timestamptz not null default now()
);

create table if not exists knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default 'FAQ',
  reference_path text,
  content text,
  import_key text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_sources_active_idx on knowledge_sources (is_active, kind);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text,
  setting_type text not null default 'text',
  is_public boolean not null default false,
  updated_by uuid references dashboard_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists events
  add column if not exists source text not null default 'dashboard';

alter table if exists events
  add column if not exists eventbrite_id text;

alter table if exists events
  add column if not exists eventbrite_url text;

alter table if exists events
  add column if not exists eventbrite_status text;

alter table if exists events
  add column if not exists eventbrite_published_at timestamptz;

alter table if exists events
  add column if not exists is_hidden boolean not null default false;

alter table if exists events
  add column if not exists raw_eventbrite jsonb;

alter table if exists events
  add column if not exists last_synced_at timestamptz;

do $$
begin
  alter table events add constraint events_eventbrite_id_key unique (eventbrite_id);
exception
  when duplicate_object or duplicate_table then null;
end $$;

create index if not exists events_source_starts_at_idx on events (source, starts_at desc);
create index if not exists events_visibility_idx on events (is_active, is_hidden, starts_at);

create table if not exists eventbrite_settings (
  id integer primary key default 1 check (id = 1),
  private_token_encrypted text,
  organization_id text,
  public_backend_url text,
  sync_interval_minutes integer not null default 15,
  auto_sync_enabled boolean not null default true,
  show_uncategorized boolean not null default true,
  connection_status text not null default 'unverified',
  last_test_at timestamptz,
  last_full_sync_at timestamptz,
  last_sync_status text,
  updated_by uuid references dashboard_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists event_classifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  classification_type text not null default 'local',
  source text not null default 'local',
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_classifications_visible_idx on event_classifications (is_visible, classification_type, name);

create table if not exists eventbrite_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  sync_type text not null default 'full',
  status text not null default 'queued',
  trigger_source text not null default 'dashboard',
  attempt integer not null default 1,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  hidden_count integer not null default 0,
  skipped_count integer not null default 0,
  message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists eventbrite_sync_jobs_created_at_idx on eventbrite_sync_jobs (created_at desc);

insert into eventbrite_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists assistant_settings (
  id integer primary key default 1 check (id = 1),
  api_endpoint text,
  api_key_encrypted text,
  model text not null default 'gpt-4.1-mini',
  daily_request_limit integer not null default 500,
  assistant_name text not null default 'College assistant',
  welcome_message text not null default 'Hi, I can help with College of Marketing programmes, courses, funding and events.',
  fallback_message text not null default 'I could not find a confident answer. Please book a consultation and our team will help you.',
  is_enabled boolean not null default false,
  updated_by uuid references dashboard_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into assistant_settings (id, api_endpoint)
values (1, 'https://api.openai.com/v1/responses')
on conflict (id) do nothing;

create table if not exists assistant_chat_logs (
  id uuid primary key default gen_random_uuid(),
  request_key text not null,
  question text not null,
  answer text,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists assistant_chat_logs_request_created_at_idx
  on assistant_chat_logs (request_key, created_at desc);

create index if not exists assistant_chat_logs_created_at_idx
  on assistant_chat_logs (created_at desc);


create table if not exists site_access_settings (
  id integer primary key default 1 check (id = 1),
  maintenance_enabled boolean not null default false,
  protected_paths jsonb not null default '[]'::jsonb,
  preview_pin_hash text,
  title text not null default 'Website under construction',
  message text not null default 'We are preparing the College of Marketing website. Enter the 6-digit preview code to view the work in progress.',
  updated_by uuid references dashboard_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists site_access_settings
  add column if not exists protected_paths jsonb not null default '[]'::jsonb;

insert into site_access_settings (id)
values (1)
on conflict (id) do nothing;


-- Supabase public access, dashboard auth, and RLS policies.
-- Run this whole file in Supabase SQL Editor after creating the project.


create or replace function is_dashboard_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from dashboard_profiles
    where id = auth.uid()
      and is_active = true
      and role in ('admin', 'editor')
  );
$$;

create or replace view public_site_access_settings as
select id, maintenance_enabled, title, message, updated_at, protected_paths
from site_access_settings
where id = 1;

create or replace function verify_site_preview_pin(pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored_hash text;
begin
  select preview_pin_hash into stored_hash
  from site_access_settings
  where id = 1;

  if stored_hash is null or pin !~ '^\d{6}$' then
    return false;
  end if;

  return crypt(pin, stored_hash) = stored_hash;
end;
$$;

create or replace function set_site_preview_pin(pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not is_dashboard_admin() then
    raise exception 'Dashboard access required';
  end if;

  if pin !~ '^\d{6}$' then
    raise exception 'Preview PIN must be exactly 6 digits';
  end if;

  insert into site_access_settings (id, preview_pin_hash, updated_at)
  values (1, crypt(pin, gen_salt('bf')), now())
  on conflict (id) do update
    set preview_pin_hash = excluded.preview_pin_hash,
        updated_at = now();
end;
$$;

create or replace function clear_site_preview_pin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_dashboard_admin() then
    raise exception 'Dashboard access required';
  end if;

  update site_access_settings
     set preview_pin_hash = null,
         updated_at = now()
   where id = 1;
end;
$$;

grant select on public_site_access_settings to anon, authenticated;
grant execute on function is_dashboard_admin() to anon, authenticated;
grant execute on function verify_site_preview_pin(text) to anon, authenticated;
grant execute on function set_site_preview_pin(text) to authenticated;
grant execute on function clear_site_preview_pin() to authenticated;

alter table dashboard_profiles enable row level security;
alter table lead_submissions enable row level security;
alter table newsletter_subscriptions enable row level security;
alter table media_assets enable row level security;
alter table articles enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table events enable row level security;
alter table short_courses enable row level security;
alter table people_profiles enable row level security;
alter table partner_logos enable row level security;
alter table page_content_sections enable row level security;
alter table knowledge_sources enable row level security;
alter table site_settings enable row level security;
alter table eventbrite_settings enable row level security;
alter table event_classifications enable row level security;
alter table eventbrite_sync_jobs enable row level security;
alter table assistant_settings enable row level security;
alter table assistant_chat_logs enable row level security;
alter table site_access_settings enable row level security;

create policy "dashboard profiles read own" on dashboard_profiles
  for select to authenticated using (id = auth.uid() and is_active = true);
create policy "dashboard profiles admin manage" on dashboard_profiles
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public lead insert" on lead_submissions
  for insert to anon, authenticated with check (true);
create policy "dashboard lead manage" on lead_submissions
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public newsletter insert" on newsletter_subscriptions
  for insert to anon, authenticated with check (true);
create policy "dashboard newsletter read" on newsletter_subscriptions
  for select to authenticated using (is_dashboard_admin());

create policy "public articles read" on articles
  for select to anon, authenticated using (is_published = true);
create policy "dashboard articles manage" on articles
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public case studies read" on case_studies
  for select to anon, authenticated using (is_published = true);
create policy "dashboard case studies manage" on case_studies
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public testimonials read" on testimonials
  for select to anon, authenticated using (status = 'approved' and is_featured = true);
create policy "dashboard testimonials manage" on testimonials
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public events read" on events
  for select to anon, authenticated using (is_active = true and is_hidden = false);
create policy "dashboard events manage" on events
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public short courses read" on short_courses
  for select to anon, authenticated using (is_active = true);
create policy "dashboard short courses manage" on short_courses
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public people read" on people_profiles
  for select to anon, authenticated using (is_active = true);
create policy "dashboard people manage" on people_profiles
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public partners read" on partner_logos
  for select to anon, authenticated using (is_active = true);
create policy "dashboard partners manage" on partner_logos
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public media read" on media_assets
  for select to anon, authenticated using (true);
create policy "dashboard media manage" on media_assets
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public page sections read" on page_content_sections
  for select to anon, authenticated using (is_visible = true and published_value is not null);
create policy "dashboard page sections manage" on page_content_sections
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "dashboard knowledge manage" on knowledge_sources
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public settings read" on site_settings
  for select to anon, authenticated using (is_public = true);
create policy "dashboard settings manage" on site_settings
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "dashboard eventbrite settings manage" on eventbrite_settings
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());
create policy "dashboard event classifications manage" on event_classifications
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());
create policy "dashboard eventbrite jobs manage" on eventbrite_sync_jobs
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "public assistant settings read" on assistant_settings
  for select to anon, authenticated using (is_enabled = true);
create policy "dashboard assistant settings manage" on assistant_settings
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());
create policy "dashboard assistant logs manage" on assistant_chat_logs
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());

create policy "dashboard site access manage" on site_access_settings
  for all to authenticated using (is_dashboard_admin()) with check (is_dashboard_admin());
