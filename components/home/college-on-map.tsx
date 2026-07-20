import { MapAddress } from "@/features/colleges/college.service";
import CollegeMap from "./map";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Card } from "../ui/card";

type CollegeOnMapProps = {
  colleges: MapAddress;
};

export default function CollegeOnMap({ colleges }: CollegeOnMapProps) {
  return (
    <>
      <div className="relative w-full bg-white rounded-xl lg:flex gap-8 px-8 py-32 pr-0 bg-linear-180 from-[rgba(59,130,246,0.08)] from-0% via-white to-white">
        <div className="lg:w-3/5">
          <div className="px-6 py-32 sm:py-40 lg:pl-8 lg:pb-10 lg:pt-0 lg:pr-0">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-display font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                GLOBAL NETWORK
              </h2>
              <div className="mt-4 text-gray-700 max-w-sm font-normal text-base dark:text-gray-300">
                Trusted by colleges around the world Join universities already
                using College Diary
              </div>
            </div>

            <div className="py-10 pr-10 mt-2">
              <Marquee
                className="mb-8"
                autoFill
                pauseOnHover
                speed={30}
                gradient
              >
                {colleges.map((college) => (
                  <div key={college.id} className="flex mx-5 p-2">
                    <Card className="size-20 rounded-base border-zinc-100 bg-white/80 backdrop-blur-sm">
                      <Image
                        src={college?.logo_url || ""}
                        alt={college?.college_name || "college"}
                        fill
                        className="p-2"
                      />
                    </Card>
                  </div>
                ))}
              </Marquee>
              <Marquee
                direction="right"
                autoFill
                pauseOnHover
                speed={30}
                gradient
              >
                {colleges.map((college) => (
                  <div key={college.id} className="flex mx-5 p-2">
                    <Card className="size-20 rounded-base border-zinc-100 bg-white/80 backdrop-blur-sm">
                      <Image
                        src={college?.logo_url || ""}
                        alt={college?.college_name || "college"}
                        fill
                        className="p-2"
                      />
                    </Card>
                  </div>
                ))}
              </Marquee>
            </div>

            {/* <div className="py-2 sm:py-3 dark:bg-gray-900">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <div className="text-center">
                    <h2 className="font-semibold text-sm tracking-tight text-balance text-gray-900 sm:text-3xl dark:text-white">
                      Trusted by creators worldwide
                    </h2>
                    <p className="mt-4 text-lg/8 text-gray-600 dark:text-gray-300">
                      Lorem ipsum dolor sit amet consect adipisicing possimus.
                    </p>
                  </div>
                  <dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
                      <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                        Colleges
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        120+
                      </dd>
                    </div>
                    <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
                      <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                        Countries
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        18
                      </dd>
                    </div>
                    <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
                      <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                        Students
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        45K+
                      </dd>
                    </div>
                    <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
                      <dt className="text-sm/6 font-semibold text-gray-600 dark:text-gray-300">
                        Revenue
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        $10M
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="bg-gray-50 overflow-hidden ring-1 ring-zinc-200/50 shadow-2xl h-auto lg:w-2/5 dark:bg-gray-800">
          <CollegeMap colleges={colleges} />
        </div>
      </div>
    </>
  );
}
