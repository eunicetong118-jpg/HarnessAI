'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { ChartDataPoint } from '@/lib/mock-data';

interface RebateChartProps {
  data: ChartDataPoint[];
}

export const RebateChart = ({ data }: RebateChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card title="Earnings Overview">
        <div className="h-[350px] w-full bg-gray-50 animate-pulse rounded-md" />
      </Card>
    );
  }

  return (
    <Card title="Earnings Overview">
      <div className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRebate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              minTickGap={30}
              tickFormatter={(str) => {
                try {
                  const date = new Date(str);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } catch {
                  return str;
                }
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
              labelFormatter={(label) => {
                try {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                } catch {
                  return label;
                }
              }}
            />
            <Area
              type="monotone"
              dataKey="rebate"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRebate)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
