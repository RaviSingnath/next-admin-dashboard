-- Guards against out-of-order / retried webhook delivery: a handler only
-- writes if the incoming event is newer than the last event that touched
-- this row. Stripe's event.created is a unix timestamp (seconds).
alter table public.college_subscriptions
  add column stripe_event_created_at bigint;
