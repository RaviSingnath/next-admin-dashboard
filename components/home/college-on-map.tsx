import { MapAddress } from "@/features/colleges/college.service";
import Marquee from "../common/marquee";
import Map from "./map";

type CollegeOnMapProps = {
  colleges: MapAddress;
};

export default function CollegeOnMap({ colleges }: CollegeOnMapProps) {
  return (
    <>
      <Marquee>
        {colleges.map((college) => (
          <div
            key={college.id}
            className="px-8 py-3 mx-2 rounded-xl text-lg font-medium whitespace-nowrap shadow-sm"
          >
            {college.college_name}
          </div>
        ))}
      </Marquee>
      <Map colleges={colleges} />
    </>
  );
}
