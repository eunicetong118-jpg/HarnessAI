import HeroSection from "@/components/landing/HeroSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CalculatorSection from "@/components/landing/CalculatorSection";
import StatsSection from "@/components/landing/StatsSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CTASection from "@/components/landing/CTASection";
import GoldCoinRain from "@/components/landing/GoldCoinRain";

export default function Page() {
  return (
    <main className="bg-design-bg text-white min-h-screen relative overflow-hidden">
      <GoldCoinRain />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* HERO */}
        <HeroSection />

        {/* STATS */}
        <StatsSection />

        {/* DASHBOARD PREVIEW */}
        <div className="mt-20">
          <DashboardPreview />
        </div>

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
