-- Prevent multiple active invitations for the same email.
create unique index unique_active_invitation on public.invitations(email) where status in ('pending', 'onboarding');

-- Enforce role rules constraints at database level.
alter table public.invitations add constraint invitation_role_rules check ( ( role = 'super_admin' and college_id is null and department_id is null ) or ( role = 'college_admin' and college_id is not null and department_id is null ) or ( role in ('supervisor', 'student') and college_id is not null and department_id is not null ) );
alter table public.profiles add constraint invitation_role_rules check ( ( role = 'super_admin' and college_id is null and department_id is null ) or ( role = 'college_admin' and college_id is not null and department_id is null ) or ( role in ('supervisor', 'student') and college_id is not null and department_id is not null ) );

-- Remove trigger on accept invite
DROP FUNCTION IF EXISTS handle_email_verified() CASCADE;   


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation_record public.invitations;
  resolved_full_name text;
begin

  
  -- Find latest valid invitation
  select *
  into invitation_record
  from public.invitations
  where
    email = new.email
    and status = 'pending'
    and expires_at > pg_catalog.now()
  order by created_at desc
  limit 1;

  -- Reject account creation without invitation
  if invitation_record.id is null then
    raise exception
      'No valid invitation found for email: %',
      new.email;
  end if;

  -- Resolve full name
  resolved_full_name := coalesce(
    nullif(trim(invitation_record.full_name), ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    ''
  );

  -- Create or update profile
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
    resolved_full_name,
    invitation_record.role,
    invitation_record.college_id,
    invitation_record.department_id,
    invitation_record.invited_by,
    'inactive',
    pg_catalog.now(),
    pg_catalog.now()
  )
  on conflict (id)
  do update
  set
    email = excluded.email,
    full_name = coalesce(
      nullif(trim(public.profiles.full_name), ''),
      excluded.full_name
    ),
    role = excluded.role,
    college_id = excluded.college_id,
    department_id = excluded.department_id,
    updated_at = pg_catalog.now();

  -- Move invitation -> onboarding
  update public.invitations
  set
    status = 'onboarding',
    created_user_id = new.id,
    updated_at = pg_catalog.now()
  where id = invitation_record.id;

  return new;

exception
  when others then
    raise log 'handle_new_user failed for %: %',
      new.email,
      sqlerrm;

    raise;
end;
$$;

-- Invitation ownership constraints
ALTER TABLE public.invitations
ADD COLUMN IF NOT EXISTS created_user_id uuid unique
REFERENCES auth.users(id)
ON DELETE SET NULL;