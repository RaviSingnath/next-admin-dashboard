import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import { type RecentSubscriptions } from "@/features/stripe/service/stripe.services";

const invoices = [
  {
    id: "INV-000124",
    date: "Aug 06, 2026",
    amount: "$29",
    status: "Paid",
    pdf: "pdf",
  },
  {
    id: "INV-000125",
    date: "Aug 06, 2026",
    amount: "$29",
    status: "Paid",
    pdf: "pdf",
  },
];

export default function BillingHistory() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Recent Subscriptions
      </h3>

      <div className="max-w-full min-w-0 overflow-x-auto">
        <Table className="min-w-[700px]!">
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
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} className="">
                <TableCell className="py-3">
                  <div>
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {invoice.id}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {invoice.date}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {invoice.amount}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      invoice.status === "Delivered"
                        ? "success"
                        : invoice.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {invoice.pdf}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
