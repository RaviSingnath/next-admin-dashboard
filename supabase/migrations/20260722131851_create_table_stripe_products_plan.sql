CREATE TABLE public.stripe_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    stripe_product_id text NOT NULL UNIQUE,

    name text NOT NULL,

    description text,

    active boolean NOT NULL DEFAULT true,

    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_products
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active stripe products"
ON public.stripe_products
FOR SELECT
USING (
    public.is_super_admin()
    OR active
);

CREATE POLICY "super admin manage stripe products"
ON public.stripe_products
FOR ALL
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());