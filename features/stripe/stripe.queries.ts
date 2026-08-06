import createClient from "@/lib/supabase/server";

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
    .from("stripe_products")
    .select(
      `
      id,
      name,
      description,
      display_order,

      prices:subscription_plans(
        id,
        stripe_price_id,
        amount,
        amount_minor,
        currency,
        interval
      ),

      features:plan_features(
        id,
        feature,
        display_order
      )
    `,
    )
    .eq("active", true)
    .order("display_order");
}

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

export async function getRecentSubscriptionsQuery() {
  const supabase = await createClient();

  return supabase
    .from("college_subscriptions")
    .select(
      `
    id,
    stripe_subscription_id,
    status,
    created_at,
    created_at,
    plan:subscription_plans (
      id,
      amount,
      currency,
      interval,
      product:stripe_products (
        name,
        description
      )
    ),
    colleges!college_subscriptions_college_id_fkey (
      id,
      college_name,
      logo_url,
      country
    )
  `,
    )
    .order("created_at", { ascending: false })
    .limit(10);
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
      current_period_start,
      cancel_at_period_end,
      canceled_at,
      trial_end,
      plan:subscription_plans (
        id,
        amount,
        currency,
        interval,
        product:stripe_products (
          name,
          description
        )
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
