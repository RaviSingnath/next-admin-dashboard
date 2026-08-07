import ComponentCard from "@/components/common/cmponent-card";
import { SubscriptionList } from "./subscription-list";
import { RecentSubscriptions } from "@/features/stripe/service/stripe.services";

type SubscriptionListCardProps = {
  subscriptions: RecentSubscriptions[];
};

export function SubscriptionListCard({
  subscriptions,
}: SubscriptionListCardProps) {
  return (
    <ComponentCard title="Subscriptions List">
      <SubscriptionList subscriptions={subscriptions} />
    </ComponentCard>
  );
}
