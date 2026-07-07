import { Database } from "@/supabase/database.types";

export type BillingTransactions =
  Database["public"]["Tables"]["billing_transactions"]["Row"];

export type BillingTransactionInsert =
  Database["public"]["Tables"]["billing_transactions"]["Insert"];
