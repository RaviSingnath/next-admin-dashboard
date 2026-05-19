-- Drop old foreign key
alter table public.invitations
drop constraint invitations_invited_by_fkey;

-- Recreate foreign key to profiles
alter table public.invitations
add constraint invitations_invited_by_fkey
foreign key (invited_by)
references public.profiles(id)
on delete set null;