import { MapAddress } from "@/features/colleges/college.service";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type GlobalNetworkLogoProps = {
  colleges: MapAddress;
};

export default function GlobalNetworkLogo({
  colleges,
}: GlobalNetworkLogoProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (colleges.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        let next = current;

        while (next === current) {
          next = Math.floor(Math.random() * colleges.length);
        }

        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [colleges.length]);

  return (
    <div className="flex gap-5">
      {colleges.map((college, index) => {
        const active = activeIndex === index;

        return (
          <motion.div
            key={college.id}
            animate={{
              scale: active ? [1.06, 1.1, 1.06] : 1,
              y: active ? -6 : 0,
              opacity: active ? 1 : 0.75,
              boxShadow: active
                ? [
                    "0 8px 18px rgba(0,0,0,.10)",
                    "0 14px 36px rgba(255,255,255,.20)",
                    "0 8px 18px rgba(0,0,0,.10)",
                  ]
                : "0 4px 12px rgba(0,0,0,.08)",
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: active ? Infinity : 0,
                ease: "easeInOut",
              },
              y: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
              opacity: {
                duration: 0.3,
              },
              boxShadow: {
                duration: 2,
                repeat: active ? Infinity : 0,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.08,
              y: -8,
              rotate: -2,
            }}
            className="rounded-2xl bg-[#000000] p-4 size-20 border-white/10 border"
          >
            <Image
              src={college.logo_url || ""}
              alt={college.college_name || "College"}
              width={56}
              height={56}
              className="object-contain"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
