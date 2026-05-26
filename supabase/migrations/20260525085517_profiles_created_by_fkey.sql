alter table public.profiles
add constraint profiles_created_by_fkey
foreign key (created_by)
references public.profiles(id);