"use client";

import OurAppFeatures from "./pricing-plan/our-app-features";
import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function WhyOurApp() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      id="why-our-app"
      className="from-brand-200 relative min-h-screen w-full bg-white bg-linear-180 from-0% via-white to-white py-24 sm:py-32 dark:bg-slate-950 dark:bg-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(218,166,93,0.15)_0%,transparent_70%)]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mx-auto lg:mx-0">
          <h2 className="text-brand-600 dark:text-brand-400 text-base/7 font-semibold">
            Why College Diary?
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Everything your college needs, managed in one place
          </p>
          <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
            From student enrollment to tuition payments, College Diary gives
            every role — admin, supervisor, and student — exactly the tools they
            need, with enterprise-grade security built in from day one.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="bg-brand-600 hover:bg-brand-500 focus-visible:outline-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus-visible:outline-brand-500 inline-flex rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Request a demo
            </a>
          </div>
        </motion.div>
      </div>
      <OurAppFeatures />
    </motion.div>
  );
}
