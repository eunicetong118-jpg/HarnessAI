'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Milestone } from '@/config/milestones';
import { Button } from '@/components/ui/button';

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onComplete?: () => void;
}

export const MilestoneCelebration = ({ milestone, onComplete }: MilestoneCelebrationProps) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Standard confetti animation
    fetch('https://lottie.host/801844b2-0f0e-439b-980b-99f572458e06/8N10u3K0jH.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load Lottie animation', err));
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-design-bg/60 backdrop-blur-2xl"
          onClick={() => {
            setIsVisible(false);
            onComplete?.();
          }}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-lg p-8 bg-design-surface border border-white/10 rounded-2xl shadow-2xl text-center"
        >
          <div className="h-48 w-48 mx-auto mb-4 relative">
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                className="absolute inset-0"
              />
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-lg text-gray-400 mb-6">
            You've reached the <span className="font-semibold text-design-pink">{milestone.label}</span> milestone!
          </p>
          <Button
            onClick={() => {
              setIsVisible(false);
              onComplete?.();
            }}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Awesome!
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
