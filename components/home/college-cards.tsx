"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
const MAX_VISIBLE_OFFSET = 1; // only the active card + one neighbor on each side render

// Below this width we drop neighbor cards entirely and show just the active card,
// since two 0.86-scaled neighbors offset 58% each start crowding the mask edges.
const COMPACT_BREAKPOINT = "(max-width: 400px)";

function subscribeToCompact(callback: () => void) {
  const mq = window.matchMedia(COMPACT_BREAKPOINT);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCompactSnapshot() {
  return window.matchMedia(COMPACT_BREAKPOINT).matches;
}

function getCompactServerSnapshot() {
  // No viewport on the server — default to the non-compact layout so SSR
  // markup matches the common case and avoids a layout jump on hydration.
  return false;
}

function useIsCompact() {
  return useSyncExternalStore(
    subscribeToCompact,
    getCompactSnapshot,
    getCompactServerSnapshot,
  );
}

export default function CollegeCards({
  colleges,
  onShowOnMap,
}: CollegeCardsProps) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const wheelDelta = useRef(0);
  const lastWheelTime = useRef(0);

  const isCompact = useIsCompact();
  const visibleOffset = isCompact ? 0 : MAX_VISIBLE_OFFSET;
  const offsetSpread = isCompact ? 0 : 58;

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
      <div className="relative overflow-hidden pt-4 lg:mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {/* Sizer width must match the real card width classes exactly at every breakpoint,
            or the reserved height jitters when the viewport crosses a breakpoint. */}
        <div aria-hidden className="xs:w-[210px] invisible sm:w-70">
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

            if (Math.abs(offset) > visibleOffset) {
              return null;
            }

            const isActive = offset === 0;

            return (
              <motion.div
                key={college.id}
                className="xs:w-[210px] absolute overflow-visible rounded-3xl sm:w-70"
                style={{ touchAction: isActive ? "pan-y" : "auto" }}
                initial={false}
                animate={{
                  x: `${offset * offsetSpread}%`,
                  scale: isActive ? 1 : 0.86,
                  opacity: isActive ? 1 : 0.55,
                  zIndex: isActive ? 10 : 5,
                }}
                drag={isActive ? "x" : false}
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.2}
                onDragStart={() => setIsHovered(true)}
                onDragEnd={(_, info) => {
                  setIsHovered(false);

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

      {/* Progress dots — visual dot stays small, tap target grows on touch sizes */}
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
                className="flex h-9 items-center px-1 sm:h-4 sm:px-0"
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
