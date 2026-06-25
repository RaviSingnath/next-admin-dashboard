alter table public.colleges
  add column stripe_customer_id text,
  add column billing_email text check (billing_email like '%@%.%'),
  add column billing_name text;

create unique index colleges_stripe_customer_id_key
  on public.colleges (stripe_customer_id)
  where stripe_customer_id is not null;