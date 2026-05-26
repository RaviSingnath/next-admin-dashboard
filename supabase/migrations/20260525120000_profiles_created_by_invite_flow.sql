-- Set profiles.created_by from invitations.invited_by in triggers and backfill existing rows.

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
  invitation_id uuid;
begin
  select
    id,
    role,
    college_id,
    department_id,
    invited_by
  into
    invitation_id,
    invited_role,
    invited_college_id,
    invited_department_id,
    invited_by_id
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
      new.raw_user_meta_data ->> 'full_name',
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
      insert into public.profiles (
        id,
        email,
        role,
        college_id,
        created_by
      )
      values (
        new.id,
        new.email,
        invitation_record.role,
        invitation_record.college_id,
        invitation_record.invited_by
      )
      on conflict (id) do update
      set
        created_by = coalesce(public.profiles.created_by, excluded.created_by),
        role = excluded.role,
        college_id = excluded.college_id;

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

-- Backfill from invitation links
update public.profiles p
set created_by = i.invited_by
from public.invitations i
where p.created_by is null
  and i.invited_by is not null
  and i.created_user_id = p.id;

update public.profiles p
set created_by = i.invited_by
from public.invitations i
where p.created_by is null
  and i.invited_by is not null
  and i.accepted_by = p.id;

update public.profiles p
set created_by = sub.invited_by
from (
  select distinct on (p2.id)
    p2.id as profile_id,
    i.invited_by
  from public.profiles p2
  inner join public.invitations i on i.email = p2.email
  where p2.created_by is null
    and i.invited_by is not null
  order by p2.id, i.created_at desc
) sub
where p.id = sub.profile_id
  and p.created_by is null;
