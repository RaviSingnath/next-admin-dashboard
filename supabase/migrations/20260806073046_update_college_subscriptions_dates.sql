alter table public.college_subscriptions
  add column currency text not null default 'inr',
  add column collection_method text not null default 'charge_automatically'
    check (collection_method in ('charge_automatically', 'send_invoice')),
  add column latest_invoice_id text,
  add column latest_invoice_url text,
  add column ended_at timestamptz;
