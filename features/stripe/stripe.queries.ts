import createClient from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export const getCollegeStripeCustomerId = async (collegeId: string) => {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select("stripe_customer_id, billing_email, billing_name, college_name")
    .eq("id", collegeId)
    .single();
};

export async function getPlansQuery() {
  const supabase = await createClient();

  return supabase
    .from("subscription_plans")
    .select("id, name, amount, currency, interval")
    .eq("active", true);
}

export type SubscriptionPlans = QueryData<ReturnType<typeof getPlansQuery>>;

export type SubscriptionPlan = SubscriptionPlans[number];

export async function getTransactionsByInvoiceId(invoiceId: string) {
  const supabase = await createClient();

  return supabase
    .from("billing_transactions")
    .select("id")
    .eq("stripe_invoice_id", invoiceId)
    .maybeSingle();
}

export async function getSubscriptionBySubscriptionId(subscriptionId: string) {
  const supabase = await createClient();

  return supabase
    .from("college_subscriptions")
    .select("college_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
}

export async function getCollegeByCustomerId(customerId: string) {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
}

export async function getSubscriptionByCollegeId(collegeId: string) {
  const supabase = await createClient();

  return (
    supabase
      .from("college_subscriptions")
      .select(
        `
      id,
      stripe_subscription_id,
      status,
      current_period_end,
      cancel_at_period_end,
      canceled_at,
      trial_end,
      plan:subscription_plans (
        id,
        name,
        amount,
        currency,
        interval
      )
    `,
      )
      .eq("college_id", collegeId)
      // Exclude terminal statuses — only fetch the live subscription
      .not("status", "in", '("canceled","incomplete_expired")')
      .order("created_at", { ascending: false })
      .maybeSingle()
  );
}
