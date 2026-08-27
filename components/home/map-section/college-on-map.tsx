"use client";

import {
  MapAddress,
  CollegeAddress,
} from "@/features/colleges/college.service";

import CollegeCards from "../college-cards";
import { useState } from "react";
import CollegeMapLazy from "./college-map-lazy";
import MapHeading from "./map-heading";

type CollegeOnMapProps = {
  colleges: MapAddress;
};

export default function CollegeOnMap({ colleges }: CollegeOnMapProps) {
  const [selectedCollege, setSelectedCollege] = useState<CollegeAddress | null>(
    null,
  );

  const handleShowOnMap = (college: CollegeAddress) => {
    setSelectedCollege(college);
  };

  return (
    <div className="relative w-full gap-8 bg-[#071426] pr-0 lg:flex lg:px-8">
      <div className="mt-5 px-6 py-20 lg:w-1/2 lg:pl-20">
        <MapHeading />

        <div className="flex flex-col gap-5 pt-8 lg:pt-16 lg:pr-10">
          <CollegeCards colleges={colleges} onShowOnMap={handleShowOnMap} />
        </div>
      </div>

      <div className="hidden md:block lg:w-1/2">
        <CollegeMapLazy colleges={colleges} selectedCollege={selectedCollege} />
      </div>
    </div>
  );
}
