-- =====================================================
-- Subscription plans table
-- =====================================================

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stripe_product_id text,
  stripe_price_id text not null,
  -- Display only.
  amount numeric(12,2) not null,
  -- amount_minor is source of truth. As Stripe itself works with smallest currency units.
  amount_minor bigint not null,
  currency text not null default 'inr',
  interval text not null default 'month',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  stripe_product_created_at timestamptz,
  stripe_price_created_at timestamptz,
  synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,

  constraint subscription_plans_amount_check
    check (amount >= 0),
  constraint subscription_plans_amount_minor_check
    check (amount_minor >= 0),
  constraint subscription_plans_currency_check
    check (currency = lower(currency) and length(currency) = 3),
  constraint subscription_plans_interval_check
    check (interval in ('month', 'year'))
);

alter table public.subscription_plans enable row level security;

create policy "authenticated read active subscription plans"
on public.subscription_plans
for select
using (
  public.is_super_admin()
  or (auth.uid() is not null and active)
);

create policy "super admin manage subscription plans"
on public.subscription_plans
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create index subscription_plans_stripe_product_id_idx
on public.subscription_plans (stripe_product_id)
where stripe_product_id is not null;

create unique index subscription_plans_stripe_price_id_key
on public.subscription_plans (stripe_price_id);

create trigger set_subscription_plans_updated_at
before update on public.subscription_plans
for each row
execute function public.set_updated_at();