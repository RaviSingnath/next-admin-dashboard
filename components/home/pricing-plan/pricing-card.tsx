"use client";

import { cn } from "@/lib/utils";
import { Plans } from "@/features/stripe/service/stripe.services";
import Button from "@/components/ui/button/Button";
import { Check } from "lucide-react";
import ButtonGroup from "@/components/common/button-group";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type PricingCardProps = {
  plans: Plans;
};

export default function PricingCard({ plans }: PricingCardProps) {
  const [payInterval, setPayInterval] = useState("monthly");

  const handleToggle = (interval: string) => {
    setPayInterval(interval);
  };

  return (
    <div className="mt-16 flex items-center flex-col mx-auto max-w-md sm:mt-20 lg:mx-0 lg:max-w-none">
      <ButtonGroup onChange={handleToggle} payInterval={payInterval} />

      <div className="isolate  mt-10 grid grid-cols-1 gap-y-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={cn(
              `flex flex-col justify-between rounded-3xl bg-white p-8 inset-ring inset-ring-gray-200 xl:p-10 dark:bg-gray-800/50 dark:inset-ring-gray-700`,
              index === 1 ? "lg:rounded-b-none" : "-ml-px -mr-px  lg:mt-8",
              index === 0 ? "lg:rounded-r-none" : "",
              index === 2 ? "lg:rounded-l-none" : "",
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id="tier-freelancer"
                  className="text-lg/8 font-semibold text-gray-900 dark:text-white"
                >
                  {plan.name}
                </h3>
                {index === 1 && (
                  <p className="rounded-full bg-brand-600/10 px-2.5 py-1 text-xs/5 font-semibold text-brand-600 dark:bg-brand-400/10 dark:text-brand-400">
                    Most popular
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1 overflow-hidden">
                <span className="relative h-12 overflow-hidden flex items-baseline text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  $
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`${plan.id}-${payInterval}-price`}
                      initial={{
                        y: 18,
                        opacity: 0,
                        filter: "blur(4px)",
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: [0.98, 1.02, 1],
                      }}
                      exit={{
                        y: -18,
                        opacity: 0,
                        filter: "blur(4px)",
                      }}
                      transition={{
                        duration: 0.22,
                        ease: "easeOut",
                      }}
                      className="inline-block"
                    >
                      {payInterval === "monthly"
                        ? plan.monthly.amount
                        : plan.yearly.amount}
                    </motion.span>
                  </AnimatePresence>
                </span>

                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  /
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={`${plan.id}-${payInterval}-interval`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.15,
                        delay: 0.08,
                      }}
                      className="inline-block ml-1"
                    >
                      {payInterval === "monthly"
                        ? plan.monthly.interval
                        : plan.yearly.interval}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm/6 text-gray-600 dark:text-gray-300"
              >
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
                    {feature.feature}
                  </li>
                ))}
              </ul>
            </div>
            {index !== 1 ? (
              <Button variant="outline" size="sm" className="mt-8 block">
                Buy plan
              </Button>
            ) : (
              <Button size="sm" className="mt-8 block">
                Buy plan
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
