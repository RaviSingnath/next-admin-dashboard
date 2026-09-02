import type { AuthUser } from "@/lib/auth/types";
import DashboardWrapper from "@/components/layout/dashboard-wrapper";
import EcommerceMetrics from "./super-admin/ecommerce-metrics";
import MonthlySalesChart from "./super-admin/monthly-sales-chart";
import MonthlyTarget from "./super-admin/monthly-target";
import StatisticsChart from "./super-admin/statistics-chart";
import DemographicCard from "./super-admin/demographic-card";
import RecentSubscriptions from "./super-admin/recent-subscriptions";
import { getRecentSubscriptions } from "@/features/stripe/service/stripe.services";

type CollegeAdminDashboardProps = {
  user: AuthUser;
};

export default async function SuperAdminDashboard({
  user,
}: CollegeAdminDashboardProps) {
  const subscriptions = await getRecentSubscriptions();

  return (
    <DashboardWrapper user={user}>
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentSubscriptions subscriptions={subscriptions} />
      </div>
    </DashboardWrapper>
  );
}
