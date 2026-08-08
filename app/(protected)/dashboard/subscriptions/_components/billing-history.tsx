import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AllSubscription } from "@/features/colleges/college.service";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import { Database } from "@/supabase/database.types";

export type SubscriptionStatus =
  Database["public"]["Enums"]["subscription_status"];

type SubscriptionStatusStyle = {
  label: string;
  className: string;
};

type BillingHistoryProps = {
  subscriptions: AllSubscription;
};

const subscriptionStatusStyles: Record<
  SubscriptionStatus,
  SubscriptionStatusStyle
> = {
  active: {
    label: "Active",
    className: "bg-green-50 text-green-700 ring-green-600/20",
  },

  trialing: {
    label: "Trialing",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },

  incomplete: {
    label: "Incomplete",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },

  incomplete_expired: {
    label: "Incomplete Expired",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },

  past_due: {
    label: "Past Due",
    className: "bg-orange-50 text-orange-700 ring-orange-600/20",
  },

  unpaid: {
    label: "Unpaid",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },

  canceled: {
    label: "Canceled",
    className: "bg-gray-100 text-gray-700 ring-gray-500/20",
  },

  paused: {
    label: "Paused",
    className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  },
} as const;

export default function BillingHistory({ subscriptions }: BillingHistoryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Recent Subscriptions
      </h3>

      <div className="max-w-full min-w-0 overflow-x-auto">
        <Table className="w-full min-w-[700px]!">
          {/* Table Header */}
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Invoice
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Date
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
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                PDF
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id} className="">
                <TableCell className="py-3">
                  <div>
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {subscription.stripe_latest_invoice_number}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {formatDate(subscription.created_at)}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {subscription.plan.product.name}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  ${subscription.plan.amount}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                      subscriptionStatusStyles[subscription.status].className,
                    )}
                  >
                    {subscriptionStatusStyles[subscription.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {subscription.latest_invoice_url && (
                    <Link
                      href={subscription.latest_invoice_url}
                      target="_blank"
                    >
                      Download
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
