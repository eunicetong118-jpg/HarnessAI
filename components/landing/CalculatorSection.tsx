"use client";

import React, { useState } from 'react';

export default function CalculatorSection({ compact = false }: { compact?: boolean }) {
  const [volume, setVolume] = useState(20000);
  const savings = Math.floor(volume * 0.056);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`grid ${compact ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-8 mt-12'}`}>
      <div className={`glass-card ${compact ? 'p-4' : 'p-8'} rounded-3xl`}>
        <h3 className={`${compact ? 'mb-4 text-lg' : 'mb-6 text-xl'} font-bold text-white`}>Calculate Savings</h3>

        <div className="relative mb-6">
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-design-pink"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-xs font-medium">Volume</p>
          <span className="text-white font-bold text-lg">{formatCurrency(volume)}</span>
        </div>
      </div>

      <div className={`glass-card ${compact ? 'p-4' : 'p-8'} rounded-3xl flex flex-col justify-center items-center text-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-design-pink/5 to-design-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">Savings</p>
          <p className={`${compact ? 'text-2xl' : 'text-4xl'} text-transparent bg-clip-text bg-gradient-to-r from-design-pink to-design-purple font-bold`}>
            {formatCurrency(savings)} <span className="text-xs">/ mo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
