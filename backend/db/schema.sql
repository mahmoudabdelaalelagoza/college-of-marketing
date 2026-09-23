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
