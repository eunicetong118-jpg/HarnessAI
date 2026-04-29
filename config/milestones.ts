export const MILESTONES = [
  {
    threshold: 10000n, // $100.00
    label: '$100 Reward',
    description: 'Reach $100 in total rebates to unlock the first milestone.',
  },
  {
    threshold: 50000n, // $500.00
    label: '$500 Reward',
    description: 'Reach $500 in total rebates to unlock the second milestone.',
  },
  {
    threshold: 100000n, // $1,000.00
    label: '$1,000 Reward',
    description: 'Reach $1,000 in total rebates to unlock the elite milestone.',
  },
];

export type Milestone = (typeof MILESTONES)[number];
