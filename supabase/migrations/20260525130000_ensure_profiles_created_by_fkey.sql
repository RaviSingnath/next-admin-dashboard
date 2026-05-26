-- Ensure profiles.created_by FK exists with the name PostgREST expects.
alter table public.profiles
drop constraint if exists invitations_created_by_fkey;

alter table public.profiles
drop constraint if exists profiles_created_by_fkey;

alter table public.profiles
add constraint profiles_created_by_fkey
foreign key (created_by)
references public.profiles (id)
on delete set null;
