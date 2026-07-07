import { stripe } from "@/lib/stripe/client";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BillingSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  // const session_id = searchParams.get("session_id");
  if (!session_id) redirect("/billing/plans");

  // Retrieve the session to confirm payment status
  // The subscription itself is handled by the webhook — don't write to DB here.
  // Webhooks are guaranteed; this page may be skipped if the user closes the tab.
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    redirect("/billing/plans?error=payment_incomplete");
  }

  return (
    <div>
      <h1>Subscription activated</h1>
      <p>Your plan is now active. It may take a few seconds to reflect.</p>
    </div>
  );
}
