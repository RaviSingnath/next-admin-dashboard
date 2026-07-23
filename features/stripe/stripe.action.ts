"use server";

import { stripe } from "@/lib/stripe/client";
import { ensureStripeCustomer } from "./service/stripe.services";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRequestContext } from "@/lib/auth/request-context";
import { TPlan } from "./stripe.schema";
import { Errors } from "@/lib/errors/error-factory";
import { getCollegeById } from "../colleges/college.queries";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession({
  planId,
}: TPlan): Promise<{ url: string }> {
  const supabase = createAdminClient();
  const ctx = await createRequestContext();

  const collegeId = ctx.user.college_id;

  if (!collegeId) {
    throw Errors.collegeNotAssigned();
  }

  // Fetch the plan's Stripe price ID
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("stripe_price_id, active")
    .eq("id", planId)
    .single();

  if (!plan || !plan.active) throw new Error("Plan not found or inactive");

  const customerId = await ensureStripeCustomer(collegeId);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],

    // Stripe redirects here after successful payment
    // The session_id param lets you confirm which session completed
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing/plans`,

    // Passes context into every webhook event this session generates
    // Used by the webhook handler to map events back to your college
    metadata: {
      college_id: collegeId,
      plan_id: planId,
    },

    subscription_data: {
      metadata: {
        college_id: collegeId,
        plan_id: planId,
      },
    },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");

  return { url: session.url };
}

export async function createPortalSession(): Promise<{ url: string }> {
  const ctx = await createRequestContext();

  const collegeId = ctx.user.college_id;

  if (!collegeId) {
    throw Errors.collegeNotAssigned();
  }

  const { data: college, error } = await getCollegeById(collegeId);

  if (error) throw new Error(error.message);

  if (!college.stripe_customer_id) {
    throw Errors.notFound(
      "No Stripe customer found for this college. " +
        "Complete a subscription checkout first.",
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: college.stripe_customer_id,
    // Where Stripe sends the user after they leave the portal
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payments`,
  });

  return { url: session.url };
}

export async function syncPlansFromStripe(): Promise<{
  synced: number;
  deactivated: number;
}> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // ────────────────────────────────────────────────────────────────
  // 1. Fetch Stripe Products & Prices
  // ────────────────────────────────────────────────────────────────

  const products = await stripe.products
    .list({
      active: true,
      limit: 100,
    })
    .autoPagingToArray({ limit: 100 });

  const prices = await stripe.prices
    .list({
      active: true,
      type: "recurring",
      limit: 100,
      expand: ["data.product"],
    })
    .autoPagingToArray({ limit: 100 });

  const stripeProductMap = new Map(products.map((p) => [p.id, p]));

  // ────────────────────────────────────────────────────────────────
  // 2. Sync Products
  // ────────────────────────────────────────────────────────────────

  const productsToUpsert = products.map((product) => ({
    stripe_product_id: product.id,
    name: product.name,
    description: product.description,
    active: product.active,
    metadata: product.metadata,
  }));

  if (productsToUpsert.length > 0) {
    const { error } = await supabase
      .from("stripe_products")
      .upsert(productsToUpsert, {
        onConflict: "stripe_product_id",
      });

    if (error) {
      throw new Error(`Product sync failed: ${error.message}`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 3. Load DB Product IDs
  // ────────────────────────────────────────────────────────────────

  const { data: dbProducts, error: productError } = await supabase
    .from("stripe_products")
    .select("id, stripe_product_id");

  if (productError) {
    throw new Error(productError.message);
  }

  const productIdMap = new Map(
    (dbProducts ?? []).map((p) => [p.stripe_product_id, p.id]),
  );

  // ────────────────────────────────────────────────────────────────
  // 4. Sync Prices
  // ────────────────────────────────────────────────────────────────

  const plansToUpsert = prices.flatMap((price) => {
    const stripeProductId =
      typeof price.product === "string" ? price.product : price.product.id;

    const product = stripeProductMap.get(stripeProductId);

    if (!product) {
      return [];
    }

    const productId = productIdMap.get(stripeProductId);

    if (!productId) {
      throw new Error(
        `Missing database product for Stripe product ${stripeProductId}`,
      );
    }

    const amountMinor = price.unit_amount ?? 0;

    return {
      product_id: productId,

      stripe_price_id: price.id,

      amount: amountMinor / 100,
      amount_minor: amountMinor,

      currency: price.currency,

      interval: price.recurring?.interval ?? "month",

      active: true,

      stripe_price_created_at: new Date(price.created * 1000).toISOString(),

      synced_at: now,
    };
  });

  if (plansToUpsert.length > 0) {
    const { error } = await supabase
      .from("subscription_plans")
      .upsert(plansToUpsert, {
        onConflict: "stripe_price_id",
      });

    if (error) {
      throw new Error(`Price sync failed: ${error.message}`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 5. Deactivate Removed Prices
  // ────────────────────────────────────────────────────────────────

  const activePriceIds = prices.map((p) => p.id);

  const { data: localPlans, error: localPlanError } = await supabase
    .from("subscription_plans")
    .select("id, stripe_price_id")
    .eq("active", true);

  if (localPlanError) {
    throw new Error(localPlanError.message);
  }

  const plansToDeactivate = (localPlans ?? []).filter(
    (plan) => !activePriceIds.includes(plan.stripe_price_id),
  );

  if (plansToDeactivate.length > 0) {
    const { error } = await supabase
      .from("subscription_plans")
      .update({
        active: false,
        synced_at: now,
      })
      .in(
        "id",
        plansToDeactivate.map((p) => p.id),
      );

    if (error) {
      throw new Error(`Price deactivation failed: ${error.message}`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 6. Deactivate Removed Products
  // ────────────────────────────────────────────────────────────────

  const activeStripeProductIds = products.map((p) => p.id);

  const { data: localProducts, error: localProductError } = await supabase
    .from("stripe_products")
    .select("id, stripe_product_id")
    .eq("active", true);

  if (localProductError) {
    throw new Error(localProductError.message);
  }

  const productsToDeactivate = (localProducts ?? []).filter(
    (product) => !activeStripeProductIds.includes(product.stripe_product_id),
  );

  if (productsToDeactivate.length > 0) {
    const { error } = await supabase
      .from("stripe_products")
      .update({
        active: false,
      })
      .in(
        "id",
        productsToDeactivate.map((p) => p.id),
      );

    if (error) {
      throw new Error(`Product deactivation failed: ${error.message}`);
    }
  }

  revalidatePath("/admin/plans", "page");

  return {
    synced: plansToUpsert.length,
    deactivated: plansToDeactivate.length + productsToDeactivate.length,
  };
}
