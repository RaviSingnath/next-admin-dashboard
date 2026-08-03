create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
    claims jsonb;
    p record;
begin
    select role, college_id, department_id
    into p
    from public.profiles
    where id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if found then
        claims := jsonb_set(claims, '{user_role}', to_jsonb(p.role), true);
        claims := jsonb_set(claims, '{college_id}', to_jsonb(p.college_id), true);
        claims := jsonb_set(claims, '{department_id}', to_jsonb(p.department_id), true);
    end if;

    return jsonb_set(event, '{claims}', claims, true);
end;
$$;

-- Schema + execute grants
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

-- Column-scoped grant: only what the hook actually reads
grant select (id, role, college_id, department_id) on public.profiles to supabase_auth_admin;

-- RLS policy allowing the auth admin to read profiles
create policy "Allow auth admin to read profiles"
on public.profiles
as permissive
for select
to supabase_auth_admin
using (true);