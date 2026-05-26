alter table public.invitations
add column if not exists full_name text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  invited_role public.user_role;
  invited_college_id uuid;
  invited_department_id uuid;
  invited_by_id uuid;
  invited_full_name text;
  invitation_id uuid;
begin
  select
    id,
    role,
    college_id,
    department_id,
    invited_by,
    full_name
  into
    invitation_id,
    invited_role,
    invited_college_id,
    invited_department_id,
    invited_by_id,
    invited_full_name
  from public.invitations
  where email = new.email
    and status = 'pending'
    and expires_at > pg_catalog.now()
  order by created_at desc
  limit 1;

  if invitation_id is null then
    raise exception
      'No valid invitation found for email: %',
      new.email;
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    college_id,
    department_id,
    created_by,
    status,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(
      nullif(trim(invited_full_name), ''),
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      ''
    ),
    invited_role,
    invited_college_id,
    invited_department_id,
    invited_by_id,
    'inactive',
    pg_catalog.now(),
    pg_catalog.now()
  );

  update public.invitations
  set
    status = 'onboarding',
    created_user_id = new.id,
    updated_at = pg_catalog.now()
  where id = invitation_id;

  return new;
end;
$$;

create or replace function public.handle_email_verified()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invitation_record public.invitations;
  resolved_full_name text;
begin
  if new.email_confirmed_at is not null
     and old.email_confirmed_at is null then

    select *
    into invitation_record
    from public.invitations
    where email = new.email
      and accepted_at is null
      and expires_at > now()
    order by created_at desc
    limit 1;

    if invitation_record.id is not null then
      resolved_full_name := coalesce(
        nullif(trim(invitation_record.full_name), ''),
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
        ''
      );

      insert into public.profiles (
        id,
        email,
        role,
        college_id,
        full_name,
        created_by
      )
      values (
        new.id,
        new.email,
        invitation_record.role,
        invitation_record.college_id,
        resolved_full_name,
        invitation_record.invited_by
      )
      on conflict (id) do update
      set
        created_by = coalesce(public.profiles.created_by, excluded.created_by),
        role = excluded.role,
        college_id = excluded.college_id,
        full_name = coalesce(
          nullif(trim(public.profiles.full_name), ''),
          excluded.full_name
        );

      update public.invitations
      set
        accepted_at = now(),
        status = 'accepted',
        accepted_by = new.id
      where id = invitation_record.id;
    end if;

  end if;

  return new;
end;
$$;
