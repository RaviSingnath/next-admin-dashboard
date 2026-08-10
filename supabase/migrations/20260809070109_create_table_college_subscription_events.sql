-- ── Optional: reusable claim-extraction helpers ─────────────────────────────
-- Skip this block if you already have equivalents elsewhere — the point is
-- to have exactly one place that knows the JWT claim shape, so a future
-- rename (like the role → user_role migration you already did once) only
-- needs one edit instead of a find-and-replace across every policy file.
--
-- These live in `public`, not `auth` — Supabase's `auth` schema is owned by
-- supabase_auth_admin, and your migration role only has read access to it
-- (which is why auth.jwt() itself works but CREATE FUNCTION auth.* doesn't).
-- Named with a prefix to avoid any future collision with a real Supabase
-- auth.* function if one is ever exposed under a matching name.

create or replace function public.current_user_role()
returns text
language sql stable
as $$
  select nullif(auth.jwt() ->> 'user_role', '')
$$;

create or replace function public.current_college_id()
returns uuid
language sql stable
as $$
  select nullif(auth.jwt() ->> 'college_id', '')::uuid
$$;

-- Included for completeness / consistency with your other policies, even
-- though this specific table doesn't need department-level scoping.
create or replace function public.current_department_id()
returns uuid
language sql stable
as $$
  select nullif(auth.jwt() ->> 'department_id', '')::uuid
$$;

-- ── college_subscription_events ─────────────────────────────────────────────

create table public.college_subscription_events (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  event_type text not null,       -- 'plan_upgraded', 'trial_started', etc.
  from_plan_id uuid references public.subscription_plans(id),
  to_plan_id uuid references public.subscription_plans(id),
  amount_minor integer,
  currency text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

alter table public.college_subscription_events enable row level security;

create index if not exists college_subscription_events_college_id_idx
  on public.college_subscription_events (college_id);

-- Super Admin: full visibility across all colleges
create policy "super_admin_select_all_subscription_events"
  on public.college_subscription_events
  for select
  to authenticated
  using (
    public.current_user_role() = 'super_admin'
  );

-- College Admin: only their own college's events.
-- department_id is intentionally not checked — subscription/billing events
-- are a college-level concern, not a per-department one.
create policy "college_admin_select_own_subscription_events"
  on public.college_subscription_events
  for select
  to authenticated
  using (
    public.current_user_role() = 'college_admin'
    and public.current_college_id() = college_id
  );

-- No insert/update/delete policies for `authenticated`. This table is
-- written only by webhook handlers via createAdminClient() (service role,
-- bypasses RLS). Leaving write operations un-policied denies them by
-- default for every authenticated role — including college_admin — which
-- is what keeps this table trustworthy as an audit log. A manual
-- correction, if ever needed, should go through a service-role script,
-- not a policy grant.