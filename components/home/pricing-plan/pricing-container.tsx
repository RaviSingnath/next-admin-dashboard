"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function PricingContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-white py-24 sm:py-32 dark:bg-gray-900">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-4xl sm:text-center"
        >
          <h2 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance dark:text-white">
            Simple, Transparent Pricing for Every Institution
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Choose a plan that fits your college&apos;s size and needs — manage
            students, supervisors, departments, and payments all in one place.
          </p>
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
}
