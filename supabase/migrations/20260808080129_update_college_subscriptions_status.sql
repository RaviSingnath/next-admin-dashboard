-- =====================================================
-- 1. Create subscription status enum
-- =====================================================

create type public.subscription_status as enum (
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);


-- =====================================================
-- 2. Drop objects depending on status
-- =====================================================

drop index if exists public.college_subscriptions_status_idx;

drop index if exists public.college_subscriptions_one_active_per_college;

alter table public.college_subscriptions
drop constraint if exists college_subscriptions_status_check;


-- =====================================================
-- 3. Remove default temporarily
-- =====================================================

alter table public.college_subscriptions
alter column status drop default;


-- =====================================================
-- 4. Convert status from text -> enum
-- =====================================================

alter table public.college_subscriptions
alter column status type public.subscription_status
using status::public.subscription_status;


-- =====================================================
-- 5. Restore default
-- =====================================================

alter table public.college_subscriptions
alter column status set default 'active';


-- =====================================================
-- 6. Recreate status index
-- =====================================================

create index college_subscriptions_status_idx
on public.college_subscriptions (status);


-- =====================================================
-- 7. Recreate one-active-subscription constraint
-- =====================================================

create unique index college_subscriptions_one_active_per_college
on public.college_subscriptions (college_id)
where status = 'active';