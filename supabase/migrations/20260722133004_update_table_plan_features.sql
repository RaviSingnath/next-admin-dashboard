ALTER TABLE public.plan_features
ADD COLUMN product_id uuid;

ALTER TABLE public.plan_features
ALTER COLUMN product_id SET NOT NULL;

ALTER TABLE public.plan_features
ADD CONSTRAINT plan_features_product_fk
FOREIGN KEY (product_id)
REFERENCES public.stripe_products(id)
ON DELETE CASCADE;

ALTER TABLE public.plan_features
ADD CONSTRAINT plan_features_unique
UNIQUE (product_id, feature);

DROP POLICY IF EXISTS "authenticated read active plan features"
ON public.plan_features;

CREATE POLICY "public read active plan features"
ON public.plan_features
FOR SELECT
USING (
    public.is_super_admin()
    OR EXISTS (
        SELECT 1
        FROM public.stripe_products p
        WHERE p.id = plan_features.product_id
          AND p.active = true
    )
);

ALTER TABLE public.plan_features
DROP COLUMN plan_id;