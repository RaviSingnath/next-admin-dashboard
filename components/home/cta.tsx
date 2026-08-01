"use client";

import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
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

export default function CAT() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-brand-700/80 w-full"
    >
      <motion.div variants={fadeUp} className="px-6 py-24 sm:py-32 lg:px-8">
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
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 items-center justify-center gap-x-6 rounded-sm bg-white p-2">
            <span className="col-span-2">
              <Input
                className="border-0 bg-white focus:border-0 focus:ring-transparent"
                placeholder="Your college email address*"
              />
            </span>
            <Button className="bg-brand-700/80 hover:bg-brand-600/80 col-span-1 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:shadow-none">
              {" "}
              Book a Demo{" "}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
