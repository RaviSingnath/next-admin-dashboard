-- =====================================================
-- Payment gateway settings table
-- =====================================================

create table public.payment_gateway_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'stripe',
  stripe_account_id text,
  mode text not null default 'test',
  default_currency text not null default 'inr',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint payment_gateway_settings_provider_check
    check (provider in ('stripe', 'razorpay', 'cashfree')),
  constraint payment_gateway_settings_mode_check
    check (mode in ('test', 'live')),
  constraint payment_gateway_settings_default_currency_check
    check (default_currency = lower(default_currency) and length(default_currency) = 3)
);

-- RLS

alter table public.payment_gateway_settings enable row level security;

create policy "super admin manage payment gateway settings"
on public.payment_gateway_settings
for all
using (public.is_super_admin())
with check (public.is_super_admin());

-- Only one active Stripe configuration

create unique index payment_gateway_settings_active_key
on public.payment_gateway_settings (provider)
where is_active = true;

-- updated_at triggers

create trigger set_payment_gateway_settings_updated_at
before update on public.payment_gateway_settings
for each row
execute function public.set_updated_at();