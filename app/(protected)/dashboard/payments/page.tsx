import { createPortalSession } from "@/features/stripe/stripe.action";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  async function handlePortalRedirect() {
    "use server";
    const { url } = await createPortalSession();
    redirect(url);
  }

  return (
    <form action={handlePortalRedirect}>
      <button type="submit">Manage billing</button>
    </form>
  );
}
