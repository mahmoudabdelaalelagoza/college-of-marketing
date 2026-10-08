-- Fixes preview PIN hashing when pgcrypto functions live in Supabase's extensions schema.
-- Run this once in Supabase SQL Editor if saving a preview PIN shows:
-- function gen_salt(unknown) does not exist

create extension if not exists pgcrypto;

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

grant execute on function verify_site_preview_pin(text) to anon, authenticated;
grant execute on function set_site_preview_pin(text) to authenticated;