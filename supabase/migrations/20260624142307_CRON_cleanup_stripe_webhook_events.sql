-- CRON: cleanup strategy for expired webhook events
select cron.schedule('cleanup-expired-webhooks', '0 3 * * 0',
  $$delete from public.stripe_webhook_events
    where processed = true
      and (
        expires_at < now()
        or (expires_at is null and created_at < now() - interval '90 days')
      )$$
);