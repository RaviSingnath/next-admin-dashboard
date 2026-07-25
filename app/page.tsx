import HeroSection from "@/components/home/hero-section";
import { showCollegeOnMap } from "@/features/colleges/college.service";
import { getPlansService } from "@/features/stripe/service/stripe.services";
import CollegeOnMap from "@/components/home/college-on-map";
import Stats from "@/components/home/stats";
import Pricing from "@/components/home/pricing-plan/pricing";
import WhyOurApp from "@/components/home/why-our-app";
import CTA from "@/components/home/cta";

export default async function Home() {
  const colleges = await showCollegeOnMap();
  const plans = await getPlansService();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full h-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <HeroSection />
        <Stats />
        <CollegeOnMap colleges={colleges} />
        <Pricing plans={plans} />
        <WhyOurApp />
        <CTA />
      </main>
    </div>
  );
}
