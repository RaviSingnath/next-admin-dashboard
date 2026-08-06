"use client";

import { CollegeSubscription } from "@/features/stripe/service/stripe.services";
import { motion } from "motion/react";
import { formatDate } from "@/utils/date";

// interface SubscriptionCardProps {
//   planName: string;
//   planDescription: string;
//   price: number;
//   billingCycle: "Monthly" | "Yearly";
//   startedAt: string;
//   renewsAt: string;
//   nextInvoiceAmount: number;
//   status?: "active" | "past_due" | "canceled";
//   onManageBilling?: () => void;
//   onChangePlan?: () => void;
// }

type SubscriptionCardProps = {
  subscription: CollegeSubscription;
};

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  past_due: "bg-amber-50 text-amber-700",
  canceled: "bg-rose-50 text-rose-700",
} as const;

const statusDot = {
  active: "bg-emerald-500",
  past_due: "bg-amber-500",
  canceled: "bg-rose-500",
} as const;

const statusLabel = {
  active: "Active",
  past_due: "Past due",
  canceled: "Canceled",
} as const;

function onManageBilling() {}
function onChangePlan() {}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
        {icon}
        {label}
      </div>
      <div className="text-[15px] font-semibold text-gray-500 dark:text-gray-400">
        {value}
      </div>
    </div>
  );
}

export default function SubscriptionCard({
  subscription,
}: SubscriptionCardProps) {
  const planName = subscription?.plan.product.name;
  const planDescription = subscription?.plan.product.description;
  const price = subscription?.plan.amount;
  const billingCycle = subscription?.plan.interval;
  const startedAt =
    subscription?.current_period_start &&
    formatDate(subscription?.current_period_start);
  const renewsAt =
    subscription?.current_period_end &&
    formatDate(subscription?.current_period_end);
  const nextInvoiceAmount = subscription?.plan.amount;
  const status = "active";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -1 }}
      className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-20px_rgba(16,24,40,0.18)] transition-shadow duration-300 hover:shadow-[0_1px_1px_rgba(16,24,40,0.05),0_20px_44px_-20px_rgba(16,24,40,0.24)] dark:border-gray-800 dark:bg-white/[0.03]"
    >
      {/* signature top accent */}
      <span className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-[#2E5C8A] to-[#C6960C]" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11.5px] font-bold tracking-[0.14em] text-gray-500 uppercase">
          Current Plan
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-2.5 text-xs font-semibold ${statusStyles[status]}`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {status === "active" && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusDot[status]}`}
              />
            )}
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${statusDot[status]}`}
            />
          </span>
          {statusLabel[status]}
        </span>
      </div>

      <h3 className="mb-1.5 font-[Space_Grotesk,sans-serif] text-[30px] font-bold tracking-tight text-gray-700 dark:text-white">
        {planName}
      </h3>
      <p className="mb-6 text-[14.5px] text-gray-500">{planDescription}</p>

      <div className="mb-2 flex items-baseline gap-2.5">
        <span className="font-[Space_Grotesk,sans-serif] text-[44px] font-bold text-gray-700 dark:text-white">
          <span className="rounded bg-[linear-gradient(180deg,transparent_62%,#F5E6BC_62%)] px-0.5 dark:bg-[linear-gradient(180deg,transparent_62%,#C6960C_62%)]">
            ${price}
          </span>
        </span>
        <span className="text-[15px] font-medium text-gray-500">
          / {billingCycle === "month" ? "Monthly" : "Yearly"}
        </span>
      </div>

      <div className="my-6 h-px bg-slate-200" />

      <div className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <MetaItem
          label="Billing"
          value={billingCycle === "month" ? "Monthly" : "Yearly"}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 stroke-slate-400"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <rect x="3" y="6" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
            </svg>
          }
        />
        <MetaItem
          label="Started"
          value={startedAt}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 stroke-slate-400"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" />
            </svg>
          }
        />
        <MetaItem
          label="Renews"
          value={renewsAt}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 stroke-slate-400"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" />
            </svg>
          }
        />
        <MetaItem
          label="Next invoice"
          value={`$${nextInvoiceAmount} ${renewsAt}`}
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 stroke-slate-400"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onManageBilling}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300"
        >
          Manage billing
        </motion.button>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onChangePlan}
          className="rounded-xl bg-gradient-to-br from-[#2E5C8A] to-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(30,58,95,0.55)] transition-shadow hover:shadow-[0_10px_22px_-6px_rgba(30,58,95,0.6)]"
        >
          Change plan
        </motion.button>
      </div>
    </motion.div>
  );
}
