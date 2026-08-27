"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SUB_HEADINGS = [
  "The admin platform built for institutions that want more time for education. College Diary brings your entire institution under one roof.",
  "College Diary brings your entire institution under one roof.",
  "Manage students, staff, and billing — without the chaos.",
  "The modern admin platform for forward-thinking institutions.",
  "Trusted administration tools for institutions that take operations seriously.",
];

export default function HeroSubHeading() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SUB_HEADINGS.length);
    }, 7000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-8 min-h-32 overflow-hidden sm:min-h-16">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.p
          key={index}
          className="absolute inset-0 text-lg font-medium text-gray-500 sm:text-xl/8 dark:text-gray-400"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: "easeOut",
          }}
        >
          {SUB_HEADINGS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
