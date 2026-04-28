create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invited_role public.user_role;
  invited_college_id uuid;
  invited_department_id uuid;
  invitation_id uuid;
begin

  -- Find latest valid pending invitation
  select
    id,
    role,
    college_id,
    department_id
  into
    invitation_id,
    invited_role,
    invited_college_id,
    invited_department_id
  from public.invitations
  where email = new.email
    and status = 'pending'
    and expires_at > now()
  order by created_at desc
  limit 1;

  -- No invitation found
  if invitation_id is null then
    raise exception 'No valid invitation found for this email';
  end if;

  -- Create profile using invitation data
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    college_id,
    department_id,
    is_active,
    created_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    invited_role,
    invited_college_id,
    invited_department_id,
    true,
    now()
  );

  -- Mark invitation as accepted
  update public.invitations
  set
    status = 'accepted',
    accepted_at = now()
  where id = invitation_id;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();