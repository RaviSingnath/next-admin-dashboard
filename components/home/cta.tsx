"use client";

import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function CTA() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-brand-700 relative isolate w-full overflow-hidden dark:bg-gray-900"
    >
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />

        <div className="bg-brand-400/20 absolute -top-16 -left-20 h-72 w-72 rounded-full blur-[120px]" />

        <div className="bg-brand-300/15 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-[140px]" />
      </div>

      {/* Smooth transition into footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white/10"
      />

      <motion.div
        variants={fadeUp}
        className="relative px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            One platform to run your entire college, end to end.
          </h2>

          <p className="text-brand-200 mx-auto mt-6 max-w-xl text-lg/8 text-pretty">
            No more scattered spreadsheets, manual fee tracking, or uncontrolled
            access. College Diary brings every role, department, and payment
            under one secure roof — so you can focus on education, not
            administration.
          </p>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-black/10 dark:bg-gray-900">
            <span className="col-span-3 md:col-span-2">
              <Input
                className="border-0 bg-transparent focus:border-0 focus:ring-transparent"
                placeholder="Your college email address"
              />
            </span>

            <Button className="bg-brand-700 hover:bg-brand-600 col-span-3 rounded-xl text-white md:col-span-1">
              Book a Demo
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
