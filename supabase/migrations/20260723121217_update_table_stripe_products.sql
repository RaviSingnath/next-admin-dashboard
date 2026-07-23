ALTER TABLE stripe_products
ADD COLUMN display_order smallint NOT NULL DEFAULT 0;

ALTER TABLE public.subscription_plans
DROP COLUMN display_order;