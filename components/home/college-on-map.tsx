import Marquee from "../common/marquee";
import Map from "./map";

type College = {
  id: string;
  college_name: string;
};

type CollegeOnMapProps = {
  colleges: College[];
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
      <Map />
    </>
  );
}
