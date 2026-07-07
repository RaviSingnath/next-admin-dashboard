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

  // ── Step 1: Fetch all active products from Stripe ─────────────────────────
  // autoPagingToArray handles pagination — safe for up to a few hundred products.
  const products = await stripe.products
    .list({ active: true, limit: 100 })
    .autoPagingToArray({ limit: 100 });

  // ── Step 2: Fetch all active recurring prices from Stripe ─────────────────
  const prices = await stripe.prices
    .list({
      active: true,
      type: "recurring",
      limit: 100,
      expand: ["data.product"], // avoids a separate product lookup per price
    })
    .autoPagingToArray({ limit: 100 });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // ── Step 3: Upsert each active price as a plan row ────────────────────────
  const plansToUpsert = prices
    .filter((price) => {
      // Skip prices whose product is inactive or archived
      const productId =
        typeof price.product === "string" ? price.product : price.product?.id;
      return productId && productMap.has(productId);
    })
    .map((price) => {
      const product =
        typeof price.product === "object" && price.product !== null
          ? price.product
          : productMap.get(price.product as string);

      const amountMinor = price.unit_amount ?? 0;

      return {
        name: (product as { name: string }).name,
        stripe_product_id:
          typeof price.product === "string"
            ? price.product
            : (price.product as { id: string }).id,
        stripe_price_id: price.id,
        amount: amountMinor / 100,
        amount_minor: amountMinor,
        currency: price.currency,
        interval: price.recurring?.interval ?? "month",
        active: true,
        stripe_product_created_at: product
          ? new Date(
              (product as { created: number }).created * 1000,
            ).toISOString()
          : null,
        stripe_price_created_at: new Date(price.created * 1000).toISOString(),
        synced_at: now,
      };
    });

  if (plansToUpsert.length > 0) {
    const { error } = await supabase
      .from("subscription_plans")
      .upsert(plansToUpsert, { onConflict: "stripe_price_id" });

    if (error) throw new Error(`Sync failed: ${error.message}`);
  }

  // ── Step 4: Deactivate plans whose Stripe price is no longer active ────────
  // Fetch all price IDs currently active in Stripe
  const activePriceIds = prices.map((p) => p.id);

  // Find local plans not in the active Stripe set
  const { data: localPlans } = await supabase
    .from("subscription_plans")
    .select("id, stripe_price_id")
    .eq("active", true);

  const toDeactivate = (localPlans ?? []).filter(
    (p) => !activePriceIds.includes(p.stripe_price_id),
  );

  if (toDeactivate.length > 0) {
    const { error } = await supabase
      .from("subscription_plans")
      .update({ active: false, synced_at: now })
      .in(
        "id",
        toDeactivate.map((p) => p.id),
      );

    if (error) throw new Error(`Deactivation failed: ${error.message}`);
  }

  revalidatePath("/admin/plans", "page");

  return {
    synced: plansToUpsert.length,
    deactivated: toDeactivate.length,
  };
}
