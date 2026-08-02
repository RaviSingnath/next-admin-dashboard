"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type ButtonGroupProps = {
  payInterval: string;
  onChange: (interval: "monthly" | "yearly") => void;
};

export default function ButtonGroup({
  payInterval,
  onChange,
}: ButtonGroupProps) {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-md items-center gap-2">
      <div className="flex w-full max-w-xs rounded-3xl bg-black-200 p-1 shadow-md">
        {(["monthly", "yearly"] as const).map((interval) => {
          const active = payInterval === interval;

          return (
            <motion.button
              key={interval}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(interval)}
              className="relative flex flex-1 items-center justify-center py-2"
            >
              {active && (
                <motion.div
                  layoutId="pricing-toggle-pill"
                  className="absolute inset-0 rounded-3xl bg-brand-400 shadow-inner"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 28,
                  }}
                />
              )}

              <motion.span
                className={cn(
                  "relative z-10 text-xs font-semibold transition-colors",
                  active ? "text-white" : "text-black-300",
                )}
                animate={{
                  scale: active ? 1.02 : 1,
                }}
                transition={{
                  duration: 0.15,
                }}
              >
                {interval === "monthly" ? "Month" : "Year"}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {payInterval === "yearly" && (
        <motion.span
          className="rounded-3xl max-md:mt-2 bg-yellow-200 px-2 py-1 text-xs/tight"
          animate={{
            scale: payInterval === "yearly" ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          ~17% Discount
        </motion.span>
      )}
    </div>
  );
}
