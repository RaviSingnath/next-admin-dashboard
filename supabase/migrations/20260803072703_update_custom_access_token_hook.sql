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
        claims := jsonb_set(claims, '{user_role}', coalesce(to_jsonb(p.role), 'null'::jsonb), true);
        claims := jsonb_set(claims, '{college_id}', coalesce(to_jsonb(p.college_id), 'null'::jsonb), true);
        claims := jsonb_set(claims, '{department_id}', coalesce(to_jsonb(p.department_id), 'null'::jsonb), true);
    end if;

    return jsonb_set(event, '{claims}', claims, true);
end;
$$;