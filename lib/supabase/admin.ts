import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS, never expose to browser.
 * Only use in Server Actions / Route Handlers.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← secret key, no NEXT_PUBLIC_ prefix
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}