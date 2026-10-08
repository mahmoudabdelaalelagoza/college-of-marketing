create extension if not exists pgcrypto;

create table if not exists dashboard_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  username text unique,
  name text not null,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dashboard_users_email_idx
  on dashboard_users (lower(email));

create table if not exists dashboard_login_attempts (
  id uuid primary key default gen_random_uuid(),
  request_key text not null,
  identifier text not null,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_login_attempts_request_key_created_at_idx
  on dashboard_login_attempts (request_key, created_at desc);

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
  assigned_to uuid references dashboard_users(id) on delete set null,
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
  add column if not exists assigned_to uuid references dashboard_users(id) on delete set null;

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
  uploaded_by uuid references dashboard_users(id) on delete set null,
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
  reviewed_by uuid references dashboard_users(id) on delete set null,
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
  updated_by uuid references dashboard_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_path, section_key, field_key)
);

create table if not exists page_content_versions (
  id uuid primary key default gen_random_uuid(),
  page_content_section_id uuid not null references page_content_sections(id) on delete cascade,
  version integer not null,
  published_value text,
  published_by uuid references dashboard_users(id) on delete set null,
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
  updated_by uuid references dashboard_users(id) on delete set null,
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
  updated_by uuid references dashboard_users(id) on delete set null,
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
  updated_by uuid references dashboard_users(id) on delete set null,
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
  preview_pin_hash text,
  title text not null default 'Website under construction',
  message text not null default 'We are preparing the College of Marketing website. Enter the 6-digit preview code to view the work in progress.',
  updated_by uuid references dashboard_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into site_access_settings (id)
values (1)
on conflict (id) do nothing;
