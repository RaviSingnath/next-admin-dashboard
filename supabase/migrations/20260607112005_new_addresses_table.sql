create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id),

  label text,

  address_line_1 text not null,
  address_line_2 text,

  city text not null,
  state_province text not null,
  postal_code text not null,

  country text not null,
  country_code varchar(3) not null,

  formatted_address text,

  place_id text,

  latitude double precision,
  longitude double precision,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Polycies
alter table public.addresses enable row level security;

create policy "Users manage own addresses"
on public.addresses
for all
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

-- Add address_id to profiles
alter table public.profiles
add column address_id uuid;

alter table public.profiles
add constraint profiles_address_id_fkey
foreign key (address_id)
references public.addresses(id)
on delete set null;

create index idx_profiles_address_id
on public.profiles(address_id);

-- Add address_id to colleges
alter table public.colleges
add column address_id uuid;

alter table public.colleges
add constraint colleges_address_id_fkey
foreign key (address_id)
references public.addresses(id)
on delete set null;

create index idx_colleges_address_id
on public.colleges(address_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger addresses_updated_at
before update on public.addresses
for each row
execute function public.handle_updated_at();