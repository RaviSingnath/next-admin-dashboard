"use client";

import {
  MapAddress,
  CollegeAddress,
} from "@/features/colleges/college.service";
import CollegeMap from "./map";
import { motion, type Variants } from "motion/react";
import CollegeCards from "./college-cards";
import { useState } from "react";

type CollegeOnMapProps = {
  colleges: MapAddress;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CollegeOnMap({ colleges }: CollegeOnMapProps) {
  const [selectedCollege, setSelectedCollege] = useState<CollegeAddress | null>(
    null,
  );

  const handleShowOnMap = (college: CollegeAddress) => {
    setSelectedCollege(college);
  };

  return (
    <>
      <div className="relative w-full gap-8 bg-[#071426] px-8 pr-0 lg:flex">
        <div className="mt-5 py-20 pl-20 lg:w-1/2">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-5xl font-bold text-white"
            >
              GLOBAL NETWORK
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-gray-400">
              Trusted by colleges around the world. Join universities already
              using College Diary.
            </motion.p>
          </motion.div>

          <div className="flex flex-col gap-5 pt-16 pr-10">
            <CollegeCards colleges={colleges} onShowOnMap={handleShowOnMap} />
          </div>
        </div>

        <div className="lg:w-1/2">
          <CollegeMap colleges={colleges} selectedCollege={selectedCollege} />
        </div>
      </div>
    </>
  );
}
