'use client';

import { useEffect, useState } from 'react';
import { MilestoneCelebration } from '@/components/dashboard/milestone-celebration';
import { MILESTONES, Milestone } from '@/config/milestones';

interface MilestoneTriggerProps {
  totalEarned: bigint;
}

export const MilestoneTrigger = ({ totalEarned }: MilestoneTriggerProps) => {
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    // Check if any milestone was reached
    const reachedMilestone = [...MILESTONES]
      .reverse() // Check largest first
      .find(m => totalEarned >= m.threshold);

    if (reachedMilestone) {
      const storageKey = `milestone_celebrated_${reachedMilestone.threshold}`;
      const alreadyCelebrated = localStorage.getItem(storageKey);

      if (!alreadyCelebrated) {
        setActiveMilestone(reachedMilestone);
      }
    }
  }, [totalEarned]);

  if (!activeMilestone) return null;

  return (
    <MilestoneCelebration
      milestone={activeMilestone}
      onComplete={() => {
        localStorage.setItem(`milestone_celebrated_${activeMilestone.threshold}`, 'true');
        setActiveMilestone(null);
      }}
    />
  );
};
