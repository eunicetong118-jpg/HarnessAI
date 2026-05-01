'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Wallet, Clock } from 'lucide-react';

interface StatsCardsProps {
  totalEarned: bigint;
  available: bigint;
  pending: bigint;
}

const CountUp = ({ value, duration = 1.5 }: { value: bigint | number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const target = Number(value) / 100;

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth stop
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(easeOutQuad(progress) * target);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(count)}</span>;
};

export const StatsCards = ({ totalEarned, available, pending }: StatsCardsProps) => {
  const stats = [
    {
      label: 'Total Earned',
      value: totalEarned,
      icon: TrendingUp,
      color: 'text-design-pink',
      bgColor: 'bg-design-pink/10',
    },
    {
      label: 'Available Balance',
      value: available,
      icon: Wallet,
      color: 'text-design-purple',
      bgColor: 'bg-design-purple/10',
    },
    {
      label: 'Pending Rebates',
      value: pending,
      icon: Clock,
      color: 'text-gray-400',
      bgColor: 'bg-white/5',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <Card className="p-6 bg-design-surface border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center">
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate tracking-wide uppercase">{stat.label}</dt>
                  <dd>
                    <div className="text-2xl font-bold text-white mt-1">
                      <CountUp value={stat.value} />
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
