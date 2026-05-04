"use client";

import HeroSection from "@/components/landing/HeroSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CalculatorSection from "@/components/landing/CalculatorSection";
import StatsSection from "@/components/landing/StatsSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CTASection from "@/components/landing/CTASection";
import { DesignBackground } from "@/components/shared/DesignBackground";

export default function Page() {
  return (
    <main className="bg-design-bg text-white h-screen overflow-hidden relative">
      <DesignBackground />

      <div className="relative z-10 h-full w-full max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-12 grid-rows-12 gap-4">
        {/* LEFT COLUMN: HERO & CTA (Cols 1-3, Rows 1-12) */}
        <div className="col-span-12 md:col-span-3 row-span-4 md:row-span-12 flex flex-col justify-between py-4">
          <div className="space-y-6">
            <div className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-design-pink to-design-purple" />
              REBATENGINE
            </div>
            <HeroSection compact />
          </div>
          <div className="hidden md:block">
            <CTASection compact />
          </div>
        </div>

        {/* TOP: STATS (Cols 4-12, Row 1-2) */}
        <div className="col-span-12 md:col-span-9 row-span-1">
          <StatsSection compact />
        </div>

        {/* CENTER: DASHBOARD (Cols 4-9, Rows 2-10) */}
        <div className="col-span-12 md:col-span-6 row-span-7 md:row-span-9">
          <DashboardPreview compact />
        </div>

        {/* RIGHT: CALCULATOR (Cols 10-12, Rows 2-10) */}
        <div className="col-span-12 md:col-span-3 row-span-4 md:row-span-9">
          <CalculatorSection compact />
        </div>

        {/* BOTTOM: SOCIAL PROOF (Cols 4-12, Rows 11-12) */}
        <div className="col-span-12 md:col-span-9 row-span-2 md:row-span-2">
          <SocialProofSection compact />
        </div>
      </div>

      {/* Mobile Fallback: Consider allowing scroll on very small height viewports */}
      <style jsx global>{`
        @media (max-height: 700px) or (max-width: 768px) {
          main { height: auto !important; overflow: auto !important; }
        }
      `}</style>
    </main>
  );
}
