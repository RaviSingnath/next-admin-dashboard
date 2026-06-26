CREATE EXTENSION IF NOT EXISTS pg_cron;

-- CRON: cleanup strategy for expired webhook events
SELECT cron.schedule('cleanup-expired-webhooks', '0 3 * * 0',
  $$
  DELETE FROM public.stripe_webhook_events
  WHERE id IN (
    SELECT id
    FROM public.stripe_webhook_events
    WHERE processed = true
      AND (
        expires_at < now()
        OR (expires_at IS NULL AND created_at < now() - INTERVAL '90 days')
      )
    LIMIT 5000
  )
  $$
);