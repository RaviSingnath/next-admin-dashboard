import { BillingTransactionInsert, BillingTransactions } from "./types";
import { createAdminClient } from "@/lib/supabase/admin";

export const updateCollegeStripeCustomerId = async (
  collegeId: string,
  customerId: string,
) => {
  const supabase = createAdminClient();

  return supabase
    .from("colleges")
    .update({ stripe_customer_id: customerId })
    .eq("id", collegeId);
};

export const updateTransactionsByInvoiceId = async (
  invoiceId: string,
  data: Partial<BillingTransactions>,
) => {
  const supabase = createAdminClient();

  return supabase
    .from("billing_transactions")
    .update({
      status: "succeeded",
      paid_at: data.paid_at,
      stripe_charge_id: data.stripe_charge_id,
      invoice_pdf_url: data.invoice_pdf_url,
    })
    .eq("id", invoiceId);
};

export const insertBillingTransactions = async (
  data: BillingTransactionInsert,
) => {
  const supabase = createAdminClient();

  return supabase.from("billing_transactions").insert(data);
};
