import type {
  ActiveSubscription,
  AllSubscription,
} from "@/features/colleges/college.service";
import SubscriptionCard from "./subscription-card";
import UsageCard from "./usage-card";
import SubscriptionTimeline from "./subscription-timeline";
import BillingHistory from "../billing-history";

type ActiveSubscriptionProps = {
  subscription: ActiveSubscription;
  subscriptions: AllSubscription;
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
      <div className="col-span-12 xl:col-span-4">
        <SubscriptionTimeline />
      </div>
      <div className="col-span-12 xl:col-span-8">
        <BillingHistory subscriptions={subscriptions} />
      </div>
    </div>
  );
}
