"use client";

import React, { useState } from 'react';

export default function CalculatorSection() {
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
    <div className="grid md:grid-cols-2 gap-8 mt-12">
      <div className="bg-design-surface p-6 rounded-xl border border-white/5 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-white">Calculate Your Savings</h3>

        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full h-2 bg-design-card rounded-lg appearance-none cursor-pointer accent-design-pink"
        />

        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-400">Monthly Trading Volume</p>
          <span className="text-design-pink font-bold text-lg">{formatCurrency(volume)}</span>
        </div>
      </div>

      <div className="bg-design-surface p-6 rounded-xl border border-white/5 shadow-xl flex flex-col justify-center items-center text-center">
        <p className="text-gray-400 mb-2">You Could Save</p>
        <p className="text-4xl text-design-pink font-bold">
          {formatCurrency(savings)} / month
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
          *Estimates based on average cashback rates
        </p>
      </div>
    </div>
  );
}
