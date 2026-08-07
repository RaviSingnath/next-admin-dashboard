import Image from "next/image";
import { formatDateTime } from "@/utils/date";
import TableWrapper from "@/components/tables/table-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentSubscriptions } from "@/features/stripe/service/stripe.services";
import Badge from "@/components/ui/badge/Badge";

type SubscriptionListProps = {
  subscriptions: RecentSubscriptions[];
};

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  return (
    <TableWrapper>
      <Table>
        {/* Table Header */}
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
            >
              College
            </TableCell>
            <TableCell
              isHeader
              className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
            >
              Plan
            </TableCell>
            <TableCell
              isHeader
              className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
            >
              Price
            </TableCell>
            <TableCell
              isHeader
              className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
            >
              Status
            </TableCell>
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id} className="">
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                    <Image
                      width={50}
                      height={50}
                      src={subscription.colleges.logo_url || ""}
                      className="h-[50px] w-[50px]"
                      alt={subscription.colleges.college_name}
                    />
                  </div>
                  <div>
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {subscription.colleges.college_name}
                    </p>
                    <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {subscription.colleges.country}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                {subscription.plan.product.name}
              </TableCell>
              <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                {subscription.plan.currency}
                {subscription.plan.amount}
              </TableCell>
              <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                <Badge
                  size="sm"
                  color={
                    subscription.status === "Delivered"
                      ? "success"
                      : subscription.status === "Pending"
                        ? "warning"
                        : "error"
                  }
                >
                  {subscription.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
