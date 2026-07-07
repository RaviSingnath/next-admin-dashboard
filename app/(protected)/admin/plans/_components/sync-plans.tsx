import Button from "@/components/ui/button/Button";
import { syncPlansFromStripe } from "@/features/stripe/stripe.action";

export default async function SyncPlansButton() {
  async function handleSync() {
    "use server";
    const result = await syncPlansFromStripe();
    console.log(
      `Synced ${result.synced} plans, deactivated ${result.deactivated}`,
    );
  }

  return (
    <form action={handleSync}>
      <Button size="sm" type="submit">
        Sync Plans
      </Button>
    </form>
  );
}
