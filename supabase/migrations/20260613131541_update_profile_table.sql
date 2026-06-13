alter table public.profiles
add column phone text;

create unique index profiles_phone_unique
on public.profiles(phone)
where phone is not null;