"use client";

import { CollegeProfile } from "@/features/colleges/college.service";
import { createContext, useContext } from "react";

const CollegeProfileContext = createContext<CollegeProfile | null>(null);

export function CollegeProfileProvider({
  data,
  children,
}: {
  data: CollegeProfile;
  children: React.ReactNode;
}) {
  return (
    <CollegeProfileContext.Provider value={data}>
      {children}
    </CollegeProfileContext.Provider>
  );
}

export function useCollegeProfile() {
  const ctx = useContext(CollegeProfileContext);
  if (!ctx)
    throw new Error(
      "useCollegeProfile must be used within CollegeProfileProvider",
    );
  return ctx;
}
