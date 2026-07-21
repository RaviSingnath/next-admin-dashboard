"use client";

import { MapAddress } from "@/features/colleges/college.service";
import CollegeMap from "./map";
import GlobalNetworkLogo from "./global-network-logo";

type CollegeOnMapProps = {
  colleges: MapAddress;
};

export default function CollegeOnMap({ colleges }: CollegeOnMapProps) {
  return (
    <>
      <div className="relative w-full bg-[#02050B] lg:flex gap-8 px-8 pr-0 ">
        <div className="lg:w-1/2 py-32 pl-20 mt-5">
          <div className="px-6 py-32 sm:py-40 lg:pl-8 lg:pb-10 lg:pt-0 lg:pr-0">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-display font-bold tracking-tight text-pretty text-white sm:text-5xl dark:text-gray-900">
                GLOBAL NETWORK
              </h2>
              <div className="mt-8 text-gray-300 max-w-sm font-normal text-base dark:text-gray-700">
                Trusted by colleges around the world Join universities already
                using College Diary
              </div>
            </div>

            <div className="flex flex-col gap-5 py-10 pr-10 mt-5">
              <GlobalNetworkLogo colleges={colleges} />
              <GlobalNetworkLogo colleges={colleges} />
            </div>
          </div>
        </div>

        <div className="shadow-2xl lg:w-1/2 ">
          <CollegeMap colleges={colleges} />
        </div>
      </div>
    </>
  );
}
