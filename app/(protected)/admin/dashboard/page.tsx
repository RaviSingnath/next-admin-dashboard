import type { Metadata } from "next";
import EcommerceMetrics from "./_components/ecommerce-metrics";
import MonthlyTarget from "./_components/monthly-target";
import MonthlySalesChart from "./_components/monthly-sales-chart";
import StatisticsChart from "./_components/statistics-chart";
import RecentSubscriptions from "./_components/recent-subscriptions";
import DemographicCard from "./_components/demographic-card";
import { getRecentSubscriptions } from "@/features/stripe/service/stripe.services";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Ecommerce() {
  const subscriptions = await getRecentSubscriptions();
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
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
    </div>
  );
}
