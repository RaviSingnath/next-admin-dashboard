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
      imageDark: "",
    },
    {
      eyebrow: "Full institutional control",
      title: "Organize your college the way it actually works",
      description:
        "Create departments, assign supervisors, enroll students, and reassign them across departments — all scoped to your college. Supervisors own the students they create, and College Admins have full visibility across every department under their institution.",
      imageLight: "/images/dashboard-screenshot/colleges.png",
      imageDark: "",
    },
    {
      eyebrow: "Payments, simplified",
      title: "Collect tuition fees and track every payment in real time",
      description:
        "Students pay tuition securely via Stripe, directly to your college's account. Admins and supervisors can monitor payment status, send reminders, and download invoices and receipts — all from one dashboard. No spreadsheets, no chasing.",
      imageLight: "/images/dashboard-screenshot/supervisors.png",
      imageDark: "",
    },
    {
      eyebrow: "Full accountability",
      title: "Every action recorded. Nothing ever lost",
      description:
        "Every sensitive operation — role changes, fee edits, student deletions, supervisor reassignments — is logged immutably. College Admins get a full audit trail for their institution, and Super Admins have platform-wide visibility. Built for institutions where accountability isn't optional.",
      imageLight: "/images/dashboard-screenshot/colleges.png",
      imageDark: "",
    },
  ];

  const { active, progress, pause, resume, setActive } = useAutoRotate({
    count: features.length,
    duration: 5000,
  });

  const feature = features[active];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
        <>
          <div className="">
            <div
              className="space-y-3 h-full"
              onMouseEnter={pause}
              onMouseLeave={resume}
            >
              {features.map((item, index) => {
                const isActive = index === active;

                return (
                  <div key={item.title}>
                    <button
                      onClick={() => {
                        if (index !== active) {
                          setActive(index);
                        }
                      }}
                      className={cn(
                        "relative w-full rounded-xl p-5 text-left transition-all duration-300",
                        isActive
                          ? "bg-brand-50 dark:bg-brand-500/10"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="feature-indicator"
                          className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-brand-500"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}

                      <div className="pl-5">
                        <p className="text-sm font-semibold text-brand-600">
                          {item.eyebrow}
                        </p>

                        <h3
                          className={`mt-1 text-lg font-semibold transition-colors ${
                            isActive
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden"
                        >
                          <motion.blockquote
                            initial={{ y: -6 }}
                            animate={{ y: 0 }}
                            exit={{ y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="mt-4 border-l border-gray-200 ml-4 pl-6 text-base leading-8 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                          >
                            {item.description}
                          </motion.blockquote>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="mt-3 h-0.5 origin-left rounded-full bg-brand-500"
                        style={{
                          scaleX: progress,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={feature.imageLight}
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
                }}
              >
                <Image
                  src={feature.imageLight}
                  alt={feature.title}
                  width={2432}
                  height={1442}
                  className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:ml-0 dark:ring-white/10"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      </div>
    </div>
  );
}
