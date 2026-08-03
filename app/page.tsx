import HeroSection from "@/components/home/hero-section";
import { showCollegeOnMap } from "@/features/colleges/college.service";
import { getPlansService } from "@/features/stripe/service/stripe.services";
import CollegeOnMap from "@/components/home/college-on-map";
import Stats from "@/components/home/stats";
import Pricing from "@/components/home/pricing-plan/pricing";
import WhyOurApp from "@/components/home/why-our-app";
import CTA from "@/components/home/cta";
import Footer from "@/components/common/footer";
import createClient from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  const colleges = await showCollegeOnMap();
  const plans = await getPlansService();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex h-full w-full flex-1 flex-col items-center justify-between bg-white sm:items-start dark:bg-black">
        <HeroSection claimsData={claimsData} />
        <Stats />
        <CollegeOnMap colleges={colleges} />
        <Pricing plans={plans} />
        <WhyOurApp />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
