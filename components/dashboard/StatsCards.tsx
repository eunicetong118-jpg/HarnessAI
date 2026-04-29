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
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Available Balance',
      value: formatCurrency(available),
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Rebates',
      value: formatCurrency(pending),
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
