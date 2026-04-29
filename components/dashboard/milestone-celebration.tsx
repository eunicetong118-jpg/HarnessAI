'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { Milestone } from '@/config/milestones';

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onComplete?: () => void;
}

export const MilestoneCelebration = ({ milestone, onComplete }: MilestoneCelebrationProps) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Using a common confetti animation from a reliable CDN
    fetch('https://assets9.lottiefiles.com/packages/lf20_u4yrau.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load Lottie animation', err));
  }, []);

  if (!animationData || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" />
      <div className="relative z-10 w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl text-center pointer-events-auto animate-in zoom-in duration-300">
        <div className="h-48 w-48 mx-auto mb-4">
          <Lottie
            animationData={animationData}
            loop={false}
            onComplete={() => {
              // Stay visible for a bit after animation finishes
              setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
              }, 2000);
            }}
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
        <p className="text-lg text-gray-600 mb-6">
          You've reached the <span className="font-semibold text-blue-600">{milestone.label}</span> milestone!
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            onComplete?.();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};
