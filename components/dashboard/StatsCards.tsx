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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const StatsCards = ({ totalEarned, available, pending }: StatsCardsProps) => {
  const stats = [
    {
      label: 'Total Earned',
      value: totalEarned,
      icon: TrendingUp,
      color: 'text-design-pink',
      glowColor: 'bg-design-pink/20',
      border: 'border-design-pink/20',
    },
    {
      label: 'Available',
      value: available,
      icon: Wallet,
      color: 'text-design-purple',
      glowColor: 'bg-design-purple/20',
      border: 'border-design-purple/20',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'text-blue-400',
      glowColor: 'bg-blue-400/20',
      border: 'border-blue-400/20',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <div className={`relative group cursor-pointer h-full`}>
            {/* Outer Glow */}
            <div className={`absolute -inset-0.5 ${stat.glowColor} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 rounded-3xl`} />

            <Card className={`relative h-full p-6 bg-white/5 backdrop-blur-3xl border ${stat.border} rounded-3xl overflow-hidden`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-2xl ${stat.glowColor} border ${stat.border}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <p className="text-[10px] font-bold text-gray-500 truncate tracking-[0.2em] uppercase leading-none mb-1">{stat.label}</p>
                  <div className="text-3xl font-black text-white tracking-tighter">
                    <CountUp value={stat.value} />
                  </div>
                </div>
              </div>

              {/* Decorative line */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Card>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
