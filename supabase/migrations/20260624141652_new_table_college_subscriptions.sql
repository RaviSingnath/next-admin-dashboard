-- =====================================================
-- College subscriptions table
-- =====================================================

create table public.college_subscriptions (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null
    references public.colleges(id)
    on delete restrict,
  plan_id uuid not null
    references public.subscription_plans(id)
    on delete restrict,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancel_reason text,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint college_subscriptions_status_check
    check (
      status in (
        'incomplete',
        'incomplete_expired',
        'trialing',
        'active',
        'past_due',
        'canceled',
        'unpaid',
        'paused'
      )
    ),
  constraint college_subscriptions_period_check
    check (
      current_period_start is null
      or current_period_end is null
      or current_period_end >= current_period_start
    )
);

alter table public.college_subscriptions enable row level security;

create policy "college scoped subscriptions"
on public.college_subscriptions
for select
using (
  public.is_super_admin()
  or college_id = public.current_college_id()
);

CREATE POLICY "only super admin can insert college subscriptions"
ON public.college_subscriptions
AS RESTRICTIVE
FOR INSERT
WITH CHECK (public.is_super_admin());

-- Super admin UPDATE path (for manual corrections only — normal lifecycle via service_role)
create policy "super admin manage college subscriptions"
on public.college_subscriptions
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create unique index college_subscriptions_stripe_subscription_id_key
on public.college_subscriptions (stripe_subscription_id);

create index college_subscriptions_college_id_idx
on public.college_subscriptions (college_id);

create index college_subscriptions_status_idx
on public.college_subscriptions (status);

create index college_subscriptions_stripe_customer_id_idx
on public.college_subscriptions(stripe_customer_id);

create unique index college_subscriptions_one_active_per_college
on public.college_subscriptions (college_id)
where status = 'active';

create trigger set_college_subscriptions_updated_at
before update on public.college_subscriptions
for each row
execute function public.set_updated_at();