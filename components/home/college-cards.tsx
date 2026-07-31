"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  CollegeAddress,
  MapAddress,
} from "@/features/colleges/college.service";
import CollegeCard from "./college-card";
import { cn } from "@/lib/utils";

type CollegeCardsProps = {
  colleges: MapAddress;
  onShowOnMap: (college: CollegeAddress) => void;
};

const AUTO_SLIDE_DURATION = 5000;
const WHEEL_THRESHOLD = 35;
const WHEEL_COOLDOWN = 700;
const SWIPE_THRESHOLD = 30;
const MAX_VISIBLE_OFFSET = 1; // was 2 — only the active card + one neighbor on each side render now

export default function CollegeCards({
  colleges,
  onShowOnMap,
}: CollegeCardsProps) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const wheelDelta = useRef(0);
  const lastWheelTime = useRef(0);

  const safeActive =
    colleges.length > 0
      ? ((active % colleges.length) + colleges.length) % colleges.length
      : 0;

  const next = useCallback(() => {
    if (colleges.length <= 1) return;
    setActive((current) => (current + 1) % colleges.length);
  }, [colleges.length]);

  const previous = useCallback(() => {
    if (colleges.length <= 1) return;
    setActive((current) => (current - 1 + colleges.length) % colleges.length);
  }, [colleges.length]);

  useEffect(() => {
    if (isHovered || colleges.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      next();
    }, AUTO_SLIDE_DURATION);

    return () => {
      window.clearInterval(timer);
    };
  }, [isHovered, next, colleges.length]);

  useEffect(() => {
    const element = sliderRef.current;

    if (!element || colleges.length <= 1) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();

      if (now - lastWheelTime.current < WHEEL_COOLDOWN) {
        return;
      }

      wheelDelta.current += event.deltaY;

      if (Math.abs(wheelDelta.current) < WHEEL_THRESHOLD) {
        return;
      }

      const direction = wheelDelta.current > 0 ? 1 : -1;

      wheelDelta.current = 0;
      lastWheelTime.current = now;

      if (direction > 0) {
        next();
      } else {
        previous();
      }
    };

    element.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [next, previous, colleges.length]);

  const getOffset = useCallback(
    (index: number) => {
      let offset = index - safeActive;
      if (offset > colleges.length / 2) offset -= colleges.length;
      if (offset < -colleges.length / 2) offset += colleges.length;
      return offset;
    },
    [safeActive, colleges.length],
  );

  if (!colleges.length) {
    return null;
  }

  return (
    <div
      ref={sliderRef}
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] pt-4">
        <div aria-hidden className="invisible w-56 sm:w-70">
          <CollegeCard
            college={colleges[safeActive]}
            isActive
            static
            onShowOnMap={() => {}}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {colleges.map((college, index) => {
            const offset = getOffset(index);

            // Only active + immediate left/right neighbor now render at all
            if (Math.abs(offset) > MAX_VISIBLE_OFFSET) {
              return null;
            }

            const isActive = offset === 0;

            return (
              <motion.div
                key={college.id}
                className="absolute w-[210px] overflow-visible rounded-3xl sm:w-[270px]"
                initial={false}
                animate={{
                  x: `${offset * 58}%`,
                  scale: isActive ? 1 : 0.86,
                  opacity: isActive ? 1 : 0.55,
                  // rotateY and filter:blur removed — both are expensive to
                  // composite (blur especially, doubly so alongside a 3D
                  // transform), and scale + opacity + offset alone already
                  // read clearly as "receding" without the extra GPU cost
                  zIndex: isActive ? 10 : 5,
                }}
                drag={isActive ? "x" : false}
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) {
                    next();
                  }

                  if (info.offset.x > SWIPE_THRESHOLD) {
                    previous();
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                  mass: 0.8,
                }}
              >
                <CollegeCard
                  college={college}
                  isActive={isActive}
                  onShowOnMap={onShowOnMap}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress dots — unchanged */}
      {colleges.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {colleges.map((college, index) => {
            const isActive = index === safeActive;

            return (
              <button
                key={college.id}
                type="button"
                aria-label={`Show ${college.college_name}`}
                onClick={() => setActive(index)}
                className="flex h-4 items-center"
              >
                <motion.span
                  animate={{
                    width: isActive ? 18 : 6,
                    opacity: isActive ? 1 : 0.7,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={cn(
                    "h-1.5 rounded-full",
                    isActive ? "bg-brand-400" : "bg-white/40",
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
