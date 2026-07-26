"use client";

import { motion, type Variants } from "motion/react";
import Counter from "./Counter";

const stats = [
  { label: "Colleges on the platform", value: 8000, suffix: "+", prefix: "" },
  { label: "Flat platform fee", value: 3, suffix: "%", prefix: "" },
  { label: "Uptime guarantee", value: 99, suffix: "%", prefix: "" },
  { label: "Processed for institutions", value: 7, suffix: "M", prefix: "$" },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Stats() {
  return (
    <div className="bg-white py-24 sm:py-32 w-full dark:bg-gray-900 bg-linear-180 from-[#fff6e9] from-0% via-white to-white rounded-t-[50px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
              Trusted by institutions worldwide
            </h2>
            <p className="mt-4 text-lg/8 text-gray-600 dark:text-gray-300">
              From small colleges to large universities — College Diary handles
              the complexity so you don&apos;t have to.
            </p>
          </div>

          <motion.dl
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5"
              >
                <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                  {stat.label}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {stat.prefix}
                  <Counter
                    value={stat.value}
                    duration={stat.value > 100 ? 1.4 : 0.8}
                  />
                  {stat.suffix}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </div>
  );
}
