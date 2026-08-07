import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import {
  getCollegeStripeCustomerId,
  getPlansQuery,
  getSubscriptionByCollegeId,
  getRecentSubscriptionsQuery,
} from "../stripe.queries";
import { updateCollegeStripeCustomerId } from "../stripe.mutations";
import { createRequestContext } from "@/lib/auth/request-context";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { getLogoSignedUrlQuery } from "@/features/colleges/college.queries";

function isResourceMissing(err: unknown): boolean {
  return (
    err instanceof Stripe.errors.StripeError &&
    (err as Stripe.errors.StripeInvalidRequestError).code === "resource_missing"
  );
}

export async function ensureStripeCustomer(collegeId: string): Promise<string> {
  const { data: college } = await getCollegeStripeCustomerId(collegeId);

  if (!college) throw new Error(`College not found: ${collegeId}`);

  if (college.stripe_customer_id) {
    // Don't trust the cached ID blindly — it goes stale whenever the
    // customer no longer exists on Stripe's side (a test-mode "Clear test
    // data" reset, a manual delete in the Dashboard, or a stray ID from a
    // different API key/environment). A stale ID here otherwise surfaces
    // downstream as a hard-to-diagnose resource_missing error from
    // checkout.sessions.create, with no hint that the real fix is here.
    try {
      const existing = await stripe.customers.retrieve(
        college.stripe_customer_id,
      );

      if (!existing.deleted) {
        return existing.id;
      }
      // else: soft-deleted on Stripe's side — fall through and recreate
    } catch (err) {
      if (!isResourceMissing(err)) {
        throw err; // unexpected error (network, auth, etc.) — don't swallow it
      }
      // resource_missing — customer doesn't exist on Stripe anymore, recreate below
      console.warn(
        `[stripe] Cached customer ${college.stripe_customer_id} for college ` +
          `${collegeId} no longer exists on Stripe — recreating`,
      );
    }
  }

  // 2. Create a new Stripe customer.
  //    idempotencyKey scoped to collegeId protects against the scenario the
  //    original comment flagged: if updateCollegeStripeCustomerId below
  //    fails after this succeeds, a retried call reuses the same customer
  //    instead of creating a duplicate on Stripe's side.
  const customer = await stripe.customers.create(
    {
      email: college.billing_email ?? undefined,
      name: college.billing_name ?? college.college_name,
      metadata: {
        college_id: collegeId, // critical — used in webhook handlers to reverse-lookup
      },
    },
    { idempotencyKey: `ensure-customer-${collegeId}` },
  );

  // 3. Persist the customer ID before returning
  await updateCollegeStripeCustomerId(collegeId, customer.id);

  return customer.id;
}

export async function getPlansService() {
  const { data, error } = await getPlansQuery();

  if (error) throw error;

  return (data ?? []).map((plan) => {
    const monthly = plan.prices.find((p) => p.interval === "month");
    const yearly = plan.prices.find((p) => p.interval === "year");

    if (!monthly || !yearly) {
      throw new Error(`Missing monthly or yearly price for "${plan.name}"`);
    }

    return {
      ...plan,
      monthly,
      yearly,
    };
  });
}

export type Plans = Awaited<ReturnType<typeof getPlansService>>;
export type Plan = Plans[number];
export type PlanFeature = Plan["features"][number];
export type MonthlyPrice = NonNullable<Plan["monthly"]>;
export type YearlyPrice = NonNullable<Plan["yearly"]>;

export async function getCollegeSubscription() {
  const ctx = await createRequestContext();
  if (!ctx.user.college_id) {
    throw Errors.collegeNotAssigned();
  }
  const { data, error } = await getSubscriptionByCollegeId(ctx.user.college_id);

  if (error) throw mapSupabaseError(error);

  return data;
}
export type CollegeSubscription = Awaited<
  ReturnType<typeof getCollegeSubscription>
>;

export async function getRecentSubscriptions() {
  const { data, error } = await getRecentSubscriptionsQuery();

  if (error) throw mapSupabaseError(error);

  const subscriptions = await Promise.all(
    data.map(async (subscription) => {
      const college = subscription.colleges;

      if (!college?.logo_url) {
        return subscription;
      }

      const { data: logo, error: logoError } = await getLogoSignedUrlQuery(
        college.logo_url,
      );

      return {
        ...subscription,
        colleges: {
          ...college,
          logo_url: logoError ? null : logo.signedUrl,
        },
      };
    }),
  );

  return subscriptions;
}

type RecentSubscriptionsResponse = Awaited<
  ReturnType<typeof getRecentSubscriptions>
>;
export type RecentSubscriptions = RecentSubscriptionsResponse[number];
