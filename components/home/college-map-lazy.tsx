"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type {
  MapAddress,
  CollegeAddress,
} from "@/features/colleges/college.service";

const CollegeMap = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[500px] w-full animate-pulse bg-[#0b1c30]" />
  ),
});

type CollegeMapLazyProps = {
  colleges: MapAddress;
  selectedCollege: CollegeAddress | null;
};

export default function CollegeMapLazy({
  colleges,
  selectedCollege,
}: CollegeMapLazyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "500px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      {shouldLoad ? (
        <CollegeMap colleges={colleges} selectedCollege={selectedCollege} />
      ) : (
        <div className="h-full min-h-[500px] w-full bg-[#0b1c30]" />
      )}
    </div>
  );
}
