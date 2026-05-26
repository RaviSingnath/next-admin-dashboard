create or replace function public.handle_email_verified()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invitation_record public.invitations;
begin
  -- Only run when email becomes verified
  if new.email_confirmed_at is not null
     and old.email_confirmed_at is null then

    -- Find matching pending invitation
    select *
    into invitation_record
    from public.invitations
    where email = new.email
      and accepted_at is null
      and expires_at > now()
    order by created_at desc
    limit 1;

    -- Create profile
    insert into public.profiles (
      id,
      email,
      role,
      college_id
    )
    values (
      new.id,
      new.email,
      invitation_record.role,
      invitation_record.college_id
    )
    on conflict (id) do nothing;

    -- Mark invitation accepted
    update public.invitations
    set
      accepted_at = now(),
      status = 'accepted'
    where id = invitation_record.id;

  end if;

  return new;
end;
$$;

drop trigger if exists on_email_verified on auth.users;

create trigger on_email_verified
after update on auth.users
for each row
execute procedure public.handle_email_verified();