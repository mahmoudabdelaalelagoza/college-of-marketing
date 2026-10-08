-- Adds page-level maintenance mode support to an existing Supabase project.
-- Run this once in Supabase SQL Editor before using protected page paths in the dashboard.

alter table if exists site_access_settings
  add column if not exists protected_paths jsonb not null default '[]'::jsonb;

create or replace view public_site_access_settings as
select id, maintenance_enabled, protected_paths, title, message, updated_at
from site_access_settings
where id = 1;

grant select on public_site_access_settings to anon, authenticated;
