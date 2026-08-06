"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UsageMetric {
  label: string;
  used: number;
  limit: number;
  /** e.g. "GB" — omit for plain counts */
  unit?: string;
  /** override the auto-computed pct if used/limit isn't 0-1 friendly */
  formattedUsed?: string;
  formattedLimit?: string;
}

interface UsageCardProps {
  resetsOn: string;
  metrics: UsageMetric[];
  /** thresholds as fractions of limit, e.g. { warn: 0.6, danger: 0.8 } */
  thresholds?: { warn: number; danger: number };
}

const tierClasses = {
  ok: {
    bar: "bg-gradient-to-r from-[#3E6FA3] to-[#2E5C8A]",
  },
  warn: {
    bar: "bg-gradient-to-r from-[#DB9A2E] to-[#C2760B]",
    tag: "bg-amber-50 text-amber-700",
  },
  danger: {
    bar: "bg-gradient-to-r from-[#D65B5B] to-[#C23B3B]",
    tag: "bg-rose-50 text-rose-700",
  },
} as const;

function getTier(
  pct: number,
  thresholds: { warn: number; danger: number },
): "ok" | "warn" | "danger" {
  if (pct >= thresholds.danger) return "danger";
  if (pct >= thresholds.warn) return "warn";
  return "ok";
}

export default function UsageCard({
  resetsOn,
  metrics,
  thresholds = { warn: 0.6, danger: 0.8 },
}: UsageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
      whileHover={{ y: -1 }}
      className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-20px_rgba(16,24,40,0.18)] transition-shadow duration-300 hover:shadow-[0_1px_1px_rgba(16,24,40,0.05),0_20px_44px_-20px_rgba(16,24,40,0.24)] dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <span className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-[#2E5C8A] to-[#C6960C]" />

      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-[Space_Grotesk,sans-serif] text-[19px] font-semibold text-gray-700 dark:text-white">
          Usage
        </h3>
        {/* <span className="text-xs font-medium text-slate-400">
          Resets {resetsOn}
        </span> */}
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="Supervisors"
        className="max-w-lg"
      >
        <div className="space-y-4">
          {metrics.map((metric, i) => {
            const pct = Math.min(metric.used / metric.limit, 1);
            const tier = getTier(pct, thresholds);
            const usedLabel =
              metric.formattedUsed ?? metric.used.toLocaleString();
            const limitLabel =
              metric.formattedLimit ?? metric.limit.toLocaleString();

            return (
              <div key={metric.label}>
                <AccordionItem value={metric.label}>
                  <AccordionTrigger className="py-2">
                    <div className="mb-2 flex w-full items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        {metric.label}
                        {tier !== "ok" && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${tierClasses[tier].tag}`}
                          >
                            {tier === "danger"
                              ? "Nearing limit"
                              : "Getting full"}
                          </span>
                        )}
                      </span>
                      <span className="mr-2 text-[13.5px] font-semibold text-slate-500 tabular-nums">
                        {usedLabel} / {limitLabel}
                        {metric.unit ? ` ${metric.unit}` : ""}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <div className="h-[9px] w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={`h-full rounded-full ${tierClasses[tier].bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct * 100}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.15 + i * 0.08,
                      }}
                    />
                  </div>

                  <AccordionContent className="mt-2 max-h-max">
                    <p>
                      <span className="text-gray-500 dark:text-gray-400">
                        Added Today:
                      </span>{" "}
                      2
                    </p>
                    <p>
                      <span className="text-gray-500 dark:text-gray-400">
                        Added This Month:
                      </span>{" "}
                      4
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </div>
            );
          })}
        </div>
      </Accordion>
    </motion.div>
  );
}
