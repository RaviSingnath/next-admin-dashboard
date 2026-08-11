"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { CollegeAddress } from "@/features/colleges/college.service";
import { cn } from "@/lib/utils";

type CollegeCardProps = {
  college: CollegeAddress;
  onShowOnMap: (college: CollegeAddress) => void;
  isActive?: boolean;
  /**
   * Layout/sizing only — no animation, no interaction.
   * Used for the invisible height-sizer.
   */
  static?: boolean;
};

export default function CollegeCard({
  college,
  onShowOnMap,
  isActive = false,
  static: isStatic = false,
}: CollegeCardProps) {
  const location = [college?.addresses?.city, college?.addresses?.country]
    .filter(Boolean)
    .join(", ");

  const animateWhenLive = isActive && !isStatic;

  return (
    <motion.div
      tabIndex={-1}
      className="group/card xs:w-52 relative flex w-62 flex-col overflow-hidden rounded-4xl bg-[#071426] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_80px_-20px_rgba(7,20,38,0.55)] ring-1 ring-white/10 outline-none sm:w-70"
      whileHover={{
        y: isActive ? -4 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
    >
      {/* =========================================================
          TOP HAIRLINE
      ========================================================= */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-linear-to-r from-transparent via-[#C9A66B]/70 to-transparent"
      />

      {/* =========================================================
          LOGO / CREST AREA
      ========================================================= */}
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-[#F1F3F7]">
        {/* Paper warmth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,166,107,0.10),transparent_60%)]"
        />

        {/* =======================================================
            OUTER ENGRAVED RING
        ======================================================= */}
        <div
          aria-hidden
          className={cn(
            `pointer-events-none absolute top-[46%] left-1/2 aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0F2540]/8`,
            animateWhenLive && "motion-safe:animate-[spin_50s_linear_infinite]",
          )}
        />

        {/* =======================================================
            INNER ENGRAVED RING
        ======================================================= */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[46%] left-1/2 aspect-square h-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0F2540]/6"
        />

        {/* =======================================================
            LOGO
        ======================================================= */}
        <motion.div
          className="absolute inset-x-[14%] top-[12%] bottom-[18%] flex items-center justify-center"
          animate={{
            scale: isActive ? 1 : 0.94,
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          {college.logo_url ? (
            <Image
              src={college.logo_url}
              alt={`${college.college_name} logo`}
              width={400}
              height={220}
              loading="lazy"
              fetchPriority="low"
              className="h-auto max-h-full w-auto max-w-full object-contain drop-shadow-[0_8px_18px_rgba(15,23,42,0.14)]"
              draggable={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-b from-[#0F2540] to-[#071426] text-xl font-semibold text-[#C9A66B] ring-1 ring-[#0F2540]/10 sm:h-20 sm:w-20 sm:text-2xl">
                {college.college_name.charAt(0)}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* =========================================================
          CONTENT PANEL
      ========================================================= */}
      <div className="relative z-20 -mt-6 flex flex-col rounded-t-[28px] border-t border-[#C9A66B]/65 bg-[#071426] px-4 pt-5 pb-4 text-white sm:px-6 sm:pt-6 sm:pb-5">
        {/* =======================================================
            GOLD SEPARATOR GLOW
        ======================================================= */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -top-px h-px bg-linear-to-r from-transparent via-[#C9A66B]/80 to-transparent"
        />

        {/* Very subtle highlight directly underneath separator */}
        <div
          aria-hidden
          className="bg-[radial-gradient( ellipse_at_top, rgba(201,166,107,0.08), transparent_70% )] pointer-events-none absolute inset-x-10 top-0 h-8"
        />

        {/* =======================================================
            COLLEGE NAME
        ======================================================= */}
        <h3 className="relative z-10 line-clamp-2 font-serif text-[1.05rem] leading-tight font-medium tracking-tight text-white/95 sm:text-[1.3rem]">
          {college.college_name}
        </h3>

        {/* =======================================================
            LOCATION
        ======================================================= */}
        {location && (
          <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[0.75rem] text-slate-400 sm:text-[0.8rem]">
            <MapPin className="h-3.5 w-3.5 flex-none text-[#C9A66B]" />

            <span className="truncate">{location}</span>
          </div>
        )}

        {/* =======================================================
            DIVIDER
        ======================================================= */}
        <div aria-hidden className="my-3.5 h-px bg-white/8" />

        {/* =======================================================
            FOOTER
        ======================================================= */}
        <div className="flex items-center justify-between gap-3">
          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <span className="relative flex h-1.5 w-1.5 flex-none">
              {animateWhenLive && (
                <span className="absolute inset-0 rounded-full bg-emerald-400/50 motion-safe:animate-ping" />
              )}

              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            On College Diary
          </div>

          {/* View on map */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShowOnMap(college);
            }}
            className="group/btn text-brand-400 hover:text-brand-300 focus-visible:ring-brand-400/60 hidden items-center gap-1 rounded-full text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071426] md:inline-flex"
          >
            View on map
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
