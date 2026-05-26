alter table public.profiles
drop constraint profiles_created_by_fkey;

alter table public.profiles
add constraint profiles_created_by_fkey
foreign key (created_by)
references public.profiles(id);