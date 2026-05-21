-- Drop old foreign key
alter table public.profiles
drop constraint profiles_created_by_fkey;

-- Recreate foreign key to profiles
alter table public.profiles
add constraint invitations_created_by_fkey
foreign key (created_by)
references public.profiles(id)
on delete set null;