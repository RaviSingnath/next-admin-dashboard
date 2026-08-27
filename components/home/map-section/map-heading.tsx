import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
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

export default function MapHeading() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.h2 variants={fadeUp} className="text-5xl font-bold text-white">
        GLOBAL NETWORK
      </motion.h2>

      <motion.p variants={fadeUp} className="mt-4 text-gray-400">
        Trusted by colleges around the world. Join universities already using
        College Diary.
      </motion.p>
    </motion.div>
  );
}
