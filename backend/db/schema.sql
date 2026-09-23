create extension if not exists pgcrypto;

create table if not exists lead_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  interest text,
  message text,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists lead_submissions_created_at_idx
  on lead_submissions (created_at desc);

create table if not exists newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'events-newsletter',
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscriptions_created_at_idx
  on newsletter_subscriptions (created_at desc);
