alter table public.departments
drop constraint if exists departments_created_by_fkey;

alter table public.departments
add constraint departments_created_by_fkey
foreign key (created_by)
references public.profiles (id)
on delete set null;