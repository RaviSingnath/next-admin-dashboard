"use client";

import { motion, type Variants } from "motion/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function PlanCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} className="mt-24 sm:text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl sm:text-balance dark:text-white">
        Let&apos;s build the right plan together
      </h2>
      <div className="mx-auto mt-8 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-10 lg:mx-0 lg:flex lg:max-w-none dark:bg-gray-800/50 dark:ring-white/10">
        {children}
      </div>
    </motion.div>
  );
}
