-- Atomically claims an event for processing.
--
-- First delivery of an event: inserts a new row, locked immediately.
-- Retried/duplicate delivery: the ON CONFLICT branch only fires if the
-- existing row is NOT already processed AND NOT currently held by a live
-- lease (locked_by is null, or its lease has expired). If neither is true,
-- the UPDATE's WHERE clause matches nothing, no row is returned, and the
-- caller treats a null result as "don't process this."
--
-- Returns the row id if claimed, null otherwise.
create or replace function public.claim_stripe_event(
  p_stripe_event_id text,
  p_event_type text,
  p_livemode boolean,
  p_api_version text,
  p_payload jsonb,
  p_locked_by text,
  p_lease_seconds integer default 60
)
returns uuid
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into public.stripe_webhook_events (
    stripe_event_id,
    event_type,
    livemode,
    api_version,
    payload,
    locked_by,
    processing_started_at,
    attempt_count,
    expires_at
  )
  values (
    p_stripe_event_id,
    p_event_type,
    p_livemode,
    p_api_version,
    p_payload,
    p_locked_by,
    now(),
    1,
    now() + make_interval(secs => p_lease_seconds)
  )
  on conflict (stripe_event_id) do update
  set
    locked_by = p_locked_by,
    processing_started_at = now(),
    attempt_count = stripe_webhook_events.attempt_count + 1,
    expires_at = now() + make_interval(secs => p_lease_seconds),
    updated_at = now()
  where
    stripe_webhook_events.processed = false
    and (
      stripe_webhook_events.locked_by is null
      or stripe_webhook_events.expires_at < now()
    )
  returning id into v_id;

  return v_id; -- null => already processed, or another worker holds a live lease
end;
$$;

-- Marks an event as successfully processed. Only the invocation holding the
-- current lease (matching locked_by) can complete it — protects against a
-- slow/zombie invocation completing an event after its lease expired and a
-- different invocation already reclaimed and finished it.
create or replace function public.complete_stripe_event(
  p_stripe_event_id text,
  p_locked_by text
)
returns boolean
language plpgsql
as $$
declare
  v_updated boolean := false;
begin
  update public.stripe_webhook_events
  set
    processed = true,
    processed_at = now(),
    processing_completed_at = now(),
    locked_by = null,
    processing_error = null,
    updated_at = now()
  where stripe_event_id = p_stripe_event_id
    and locked_by = p_locked_by;

  get diagnostics v_updated = row_count;
  return v_updated;
end;
$$;

-- Releases the lease and records the error without marking processed, so
-- the event is eligible to be claimed and retried (by Stripe's automatic
-- retry, or your own replay tooling) on the next delivery.
create or replace function public.fail_stripe_event(
  p_stripe_event_id text,
  p_locked_by text,
  p_error text
)
returns void
language plpgsql
as $$
begin
  update public.stripe_webhook_events
  set
    processing_error = p_error,
    locked_by = null,
    updated_at = now()
  where stripe_event_id = p_stripe_event_id
    and locked_by = p_locked_by;
end;
$$;