-- Restrict user administration to admins and content work to active staff.
begin;

-- Older installations may still contain password hashes in these unused tables.
do $$
begin
  if to_regclass('public.dashboard_users') is not null then
    execute 'alter table public.dashboard_users enable row level security';
    execute 'revoke all on table public.dashboard_users from anon, authenticated';
  end if;
  if to_regclass('public.dashboard_login_attempts') is not null then
    execute 'alter table public.dashboard_login_attempts enable row level security';
    execute 'revoke all on table public.dashboard_login_attempts from anon, authenticated';
  end if;
end;
$$;

create or replace function public.is_dashboard_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.dashboard_profiles
    where id = auth.uid() and is_active and role = 'admin'
  );
$$;

create or replace function public.is_dashboard_staff()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.dashboard_profiles
    where id = auth.uid() and is_active and role in ('admin', 'editor')
  );
$$;

revoke execute on function public.is_dashboard_admin() from public, anon;
revoke execute on function public.is_dashboard_staff() from public, anon;
grant execute on function public.is_dashboard_admin() to authenticated;
grant execute on function public.is_dashboard_staff() to authenticated;

drop policy if exists "dashboard profiles admin manage" on public.dashboard_profiles;
drop policy if exists "dashboard profiles admin read" on public.dashboard_profiles;
create policy "dashboard profiles admin read" on public.dashboard_profiles
  for select to authenticated using (public.is_dashboard_admin());

drop policy if exists "dashboard lead manage" on public.lead_submissions;
create policy "dashboard lead manage" on public.lead_submissions
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard newsletter read" on public.newsletter_subscriptions;
create policy "dashboard newsletter read" on public.newsletter_subscriptions
  for select to authenticated using (public.is_dashboard_staff());

drop policy if exists "dashboard articles manage" on public.articles;
create policy "dashboard articles manage" on public.articles
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard case studies manage" on public.case_studies;
create policy "dashboard case studies manage" on public.case_studies
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard testimonials manage" on public.testimonials;
create policy "dashboard testimonials manage" on public.testimonials
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard events manage" on public.events;
create policy "dashboard events manage" on public.events
  for all to authenticated using (public.is_dashboard_admin()) with check (public.is_dashboard_admin());

drop policy if exists "dashboard short courses manage" on public.short_courses;
create policy "dashboard short courses manage" on public.short_courses
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard people manage" on public.people_profiles;
create policy "dashboard people manage" on public.people_profiles
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard partners manage" on public.partner_logos;
create policy "dashboard partners manage" on public.partner_logos
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard media manage" on public.media_assets;
create policy "dashboard media manage" on public.media_assets
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard page sections manage" on public.page_content_sections;
create policy "dashboard page sections manage" on public.page_content_sections
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

alter table public.page_content_versions enable row level security;
drop policy if exists "dashboard page versions manage" on public.page_content_versions;
create policy "dashboard page versions manage" on public.page_content_versions
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

drop policy if exists "dashboard knowledge manage" on public.knowledge_sources;
create policy "dashboard knowledge manage" on public.knowledge_sources
  for all to authenticated using (public.is_dashboard_staff()) with check (public.is_dashboard_staff());

-- Public assistant UI only needs these non-secret fields.
create or replace view public.public_assistant_settings as
select id, assistant_name, welcome_message, fallback_message, is_enabled
from public.assistant_settings
where is_enabled = true;
grant select on public.public_assistant_settings to anon, authenticated;
drop policy if exists "public assistant settings read" on public.assistant_settings;
commit;