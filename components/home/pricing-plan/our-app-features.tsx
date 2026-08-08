"use client";

import { useAutoRotate } from "@/hooks/useAutoRotateFeatures";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

export default function OurAppFeatures() {
  const features = [
    {
      eyebrow: "Secure by design",
      title: "The right access for every role, automatically",
      description:
        "College Diary's four-tier role hierarchy — Super Admin, College Admin, Supervisor, and Student — ensures every user sees only what they're supposed to. No accidental data exposure, no manual permission juggling. Access is enforced at the database level, not just the UI.",
      imageLight: "/images/dashboard-screenshot/supervisors.png",
    },
    {
      eyebrow: "Full institutional control",
      title: "Organize your college the way it actually works",
      description:
        "Create departments, assign supervisors, enroll students, and reassign them across departments — all scoped to your college. Supervisors own the students they create, and College Admins have full visibility across every department under their institution.",
      imageLight: "/images/dashboard-screenshot/colleges.png",
    },
    {
      eyebrow: "Payments, simplified",
      title: "Collect tuition fees and track every payment in real time",
      description:
        "Students pay tuition securely via Stripe, directly to your college's account. Admins and supervisors can monitor payment status, send reminders, and download invoices and receipts — all from one dashboard. No spreadsheets, no chasing.",
      imageLight: "/images/dashboard-screenshot/subscription-plan.png",
    },
    {
      eyebrow: "Full accountability",
      title: "Every action recorded. Nothing ever lost",
      description:
        "Every sensitive operation — role changes, fee edits, student deletions, supervisor reassignments — is logged immutably. College Admins get a full audit trail for their institution, and Super Admins have platform-wide visibility. Built for institutions where accountability isn't optional.",
      imageLight: "/images/dashboard-screenshot/colleges.png",
    },
  ];

  const { active, progress, pause, resume, setActive } = useAutoRotate({
    count: features.length,
    duration: 5000,
  });

  const feature = features[active];

  return (
    <section className="mx-auto mt-12 max-w-7xl px-6 sm:mt-16 lg:px-8">
      <div
        className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start lg:gap-12"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* LEFT */}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {features.map((item, index) => {
            const isActive = active === index;

            return (
              <button
                key={item.title}
                onClick={() => setActive(index)}
                className={cn(
                  "relative w-full rounded-xl px-5 py-6 text-left transition-all duration-300",
                  isActive
                    ? "bg-brand-50 dark:bg-brand-500/10 shadow-sm"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="feature-indicator"
                    className="bg-brand-500 absolute top-5 bottom-5 left-0 w-1 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

                <div className="pl-5">
                  <p className="text-brand-600 dark:text-brand-400 text-sm font-semibold">
                    {item.eyebrow}
                  </p>

                  <h3
                    className={cn(
                      "mt-1 text-lg font-semibold tracking-tight transition-colors",
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {item.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT */}
        <div>
          {/* Description */}
          <div className="min-h-41">
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={active}
                initial={{
                  opacity: 0,
                  y: 10,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  filter: "blur(4px)",
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="border-l border-gray-200 pl-6 text-base leading-8 text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                {feature.description}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="mt-1 ml-2 h-0.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="bg-brand-500 h-full origin-left"
              style={{
                scaleX: progress,
              }}
            />
          </div>

          {/* Screenshot */}
          <div className="relative mt-8 min-h-76 overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                {/* <Image
                  src={feature.imageLight}
                  alt={feature.title}
                  width={2432}
                  height={1442}
                  priority
                  className="absolute w-xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-300/10 sm:w-4xl dark:ring-white/10"
                /> */}
                <Image
                  src={feature.imageLight}
                  alt={feature.title}
                  width={2432}
                  height={1442}
                  priority
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="absolute h-auto w-full max-w-5xl rounded-xl shadow-xl ring-1 ring-gray-300/10 dark:ring-white/10"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
