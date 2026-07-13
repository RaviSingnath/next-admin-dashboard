import HeroSection from "@/components/home/hero-section";
import { showCollegeOnMap } from "@/features/colleges/college.service";
import CollegeOnMap from "@/components/home/college-on-map";

export default async function Home() {
  const colleges = await showCollegeOnMap();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full h-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <HeroSection />
        <CollegeOnMap colleges={colleges} />
      </main>
    </div>
  );
}
