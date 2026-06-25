-- =====================================================
-- Stripe webhook events table
-- =====================================================

create table public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),

  stripe_event_id text unique not null,

  event_type text not null,

  livemode boolean not null default false,

  api_version text,

  payload jsonb not null,

  processed boolean not null default false,

  processing_started_at timestamptz,

  processing_completed_at timestamptz,

  locked_by text,

  processed_at timestamptz,

  processing_error text,

  attempt_count integer not null default 0,

  expires_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint stripe_webhook_events_processing_check
    check (
      (processed = false)
      or
      (processed = true and processed_at is not null)
    )
);

alter table public.stripe_webhook_events enable row level security;

create policy "super admin read stripe webhook events"
on public.stripe_webhook_events
for select
using (public.is_super_admin());

create policy "deny webhook event mutations"
on public.stripe_webhook_events
for all
using (false)
with check (false);

create index stripe_webhook_events_event_type_idx
on public.stripe_webhook_events (event_type);

create index stripe_webhook_events_processed_idx
on public.stripe_webhook_events (processed);

create index stripe_webhook_events_pending_idx
on public.stripe_webhook_events(created_at)
where processed = false;

create index stripe_webhook_events_lock_acquisition_idx
on public.stripe_webhook_events (created_at)
where processed = false
  and locked_by is null
  and processing_started_at is null;

create trigger set_stripe_webhook_events_updated_at
  before update on public.stripe_webhook_events
  for each row
  execute function public.set_updated_at();