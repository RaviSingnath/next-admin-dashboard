import {
  CollegeSubscription,
  type RecentSubscriptions,
} from "@/features/stripe/service/stripe.services";
import SubscriptionCard from "./subscription-card";
import UsageCard from "./usage-card";
import { SubscriptionListCard } from "./subscription-list-card";
import SubscriptionTimeline from "./subscription-timeline";

type ActiveSubscriptionProps = {
  subscription: CollegeSubscription;
  subscriptions: RecentSubscriptions[];
};

export function ActiveSubscription({
  subscription,
  subscriptions,
}: ActiveSubscriptionProps) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-6">
        <SubscriptionCard subscription={subscription} />
      </div>
      <div className="col-span-12 xl:col-span-6">
        <UsageCard
          resetsOn="Sep 05"
          metrics={[
            { label: "Supervisors", used: 4, limit: 10 },
            { label: "Departments", used: 12, limit: 20 },
            { label: "Students", used: 842, limit: 1000 },
            { label: "Storage", used: 2.3, limit: 10, unit: "GB" },
          ]}
        />
      </div>
      <div className="col-span-12">
        <SubscriptionTimeline />
      </div>
      <div className="col-span-12">
        <SubscriptionListCard subscriptions={subscriptions} />
      </div>
    </div>
  );
}
