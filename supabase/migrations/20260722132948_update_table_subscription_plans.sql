ALTER TABLE public.subscription_plans
ADD COLUMN product_id uuid;

ALTER TABLE public.subscription_plans
ALTER COLUMN product_id SET NOT NULL;

ALTER TABLE public.subscription_plans
ADD CONSTRAINT subscription_plans_product_fk
FOREIGN KEY (product_id)
REFERENCES public.stripe_products(id)
ON DELETE CASCADE;

ALTER TABLE public.subscription_plans
ADD CONSTRAINT subscription_plans_product_interval_unique
UNIQUE (product_id, interval);

ALTER TABLE public.subscription_plans
DROP COLUMN name,
DROP COLUMN stripe_product_id,
DROP COLUMN stripe_product_created_at;

DROP POLICY IF EXISTS "authenticated read active subscription plans"
ON public.subscription_plans;

CREATE POLICY "public read active subscription plans"
ON public.subscription_plans
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        active
        AND EXISTS (
            SELECT 1
            FROM public.stripe_products p
            WHERE p.id = subscription_plans.product_id
              AND p.active = true
        )
    )
);