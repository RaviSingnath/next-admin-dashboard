import { stripe } from "@/lib/stripe/client";
import {
  getCollegeStripeCustomerId,
  getPlansQuery,
  getSubscriptionByCollegeId,
} from "../stripe.queries";
import { updateCollegeStripeCustomerId } from "../stripe.mutations";
import { createRequestContext } from "@/lib/auth/request-context";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

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

  return data;
}

export async function getCollegeSubscription() {
  const ctx = await createRequestContext();
  if (!ctx.user.college_id) {
    throw Errors.collegeNotAssigned();
  }
  const { data, error } = await getSubscriptionByCollegeId(ctx.user.college_id);

  if (error) throw mapSupabaseError(error);

  return data;
}
