'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Wallet, Clock } from 'lucide-react';

interface StatsCardsProps {
  totalEarned: bigint;
  available: bigint;
  pending: bigint;
}

export const StatsCards = ({ totalEarned, available, pending }: StatsCardsProps) => {
  const stats = [
    {
      label: 'Total Earned',
      value: formatCurrency(totalEarned),
      icon: TrendingUp,
      color: 'text-design-pink',
      bgColor: 'bg-design-pink/10',
    },
    {
      label: 'Available Balance',
      value: formatCurrency(available),
      icon: Wallet,
      color: 'text-design-purple',
      bgColor: 'bg-design-purple/10',
    },
    {
      label: 'Pending Rebates',
      value: formatCurrency(pending),
      icon: Clock,
      color: 'text-gray-400',
      bgColor: 'bg-white/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center">
            <div className={`p-4 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate tracking-wide uppercase">{stat.label}</dt>
                <dd>
                  <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
