create table public.plan_features (
  id uuid primary key default gen_random_uuid(),

  plan_id uuid not null
    references public.subscription_plans(id)
    on delete cascade,

  feature text not null,

  display_order smallint not null,

  created_at timestamptz not null default now(),

  constraint plan_features_feature_not_empty
    check (length(trim(feature)) > 0)
);

-- ── Constraints ───────────────────────────────────────────────────────────────

-- One display position per plan.
-- Deferrable so multiple rows can be reordered within a single transaction
-- without hitting intermediate unique violations.
alter table public.plan_features
  add constraint plan_features_plan_display_order_key
    unique (plan_id, display_order)
    deferrable initially deferred;

-- Prevent duplicate features within the same plan (case-insensitive).
create unique index plan_features_plan_feature_key
  on public.plan_features (plan_id, lower(feature));

-- ── RLS ───────────────────────────────────────────────────────────────────────

alter table public.plan_features enable row level security;

create policy "authenticated read active plan features"
on public.plan_features
for select
using (
  public.is_super_admin()
  or exists (
    select 1
    from public.subscription_plans sp
    where sp.id = plan_id
      and sp.active = true
  )
);

create policy "super admin manage plan features"
on public.plan_features
for all
using (public.is_super_admin())
with check (public.is_super_admin());