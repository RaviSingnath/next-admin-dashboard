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

export async function ensureStripeCustomer(collegeId: string): Promise<string> {
  // 1. Return existing customer ID if already created

  const { data: college } = await getCollegeStripeCustomerId(collegeId);

  if (!college) throw new Error(`College not found: ${collegeId}`);

  if (college.stripe_customer_id) {
    return college.stripe_customer_id;
  }

  // 2. Create a new Stripe customer
  const customer = await stripe.customers.create({
    email: college.billing_email ?? undefined,
    name: college.billing_name ?? college.college_name,
    metadata: {
      college_id: collegeId, // critical — used in webhook handlers to reverse-lookup
    },
  });

  // 3. Persist the customer ID before returning
  //    If this write fails, the next call to ensureStripeCustomer will create
  //    a duplicate Stripe customer. Add a Stripe idempotency key if that's a concern.
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
