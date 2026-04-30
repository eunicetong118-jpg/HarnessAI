import HeroSection from "@/components/landing/HeroSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CalculatorSection from "@/components/landing/CalculatorSection";
import StatsSection from "@/components/landing/StatsSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CTASection from "@/components/landing/CTASection";

export default function Page() {
  return (
    <main className="bg-design-bg text-white min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HERO + DASHBOARD */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HeroSection />
          <DashboardPreview />
        </div>

        {/* STATS */}
        <StatsSection />

        {/* CALCULATOR */}
        <CalculatorSection />

        {/* SOCIAL PROOF & LIVE FEED */}
        <SocialProofSection />

        {/* BOTTOM CTA */}
        <CTASection />

      </div>
    </main>
  );
}
