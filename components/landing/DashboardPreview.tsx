"use client";

import React, { useState, useEffect } from 'react';

const DashboardPreview = () => {
  const [balance, setBalance] = useState(18420);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + Math.floor(Math.random() * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-design-surface p-6 rounded-2xl shadow-xl border border-white/5">
      <h2 className="mb-4 text-lg font-semibold text-white">Your Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-design-card p-4 rounded-lg">
          <p className="text-sm text-gray-400">Saved</p>
          <p className="text-design-pink font-bold">
            ${(balance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-design-card p-4 rounded-lg">
          <p className="text-sm text-gray-400">This Month</p>
          <p className="text-green-400">+$52.30</p>
        </div>

        <div className="bg-design-card p-4 rounded-lg">
          <p className="text-sm text-gray-400">Payout</p>
          <p className="text-white font-medium">$128.50</p>
        </div>
      </div>

      {/* fake graph */}
      <div className="mt-6 h-32 bg-gradient-to-r from-design-purple to-design-pink rounded-lg opacity-60"></div>

      {/* activity */}
      <div className="mt-4 space-y-2">
        <div className="bg-design-card p-3 rounded flex justify-between items-center text-sm">
          <span className="text-gray-300">Cashback</span>
          <span className="text-green-400 font-medium">+$0.32</span>
        </div>
        <div className="bg-design-card p-3 rounded flex justify-between items-center text-sm">
          <span className="text-gray-300">Cashback</span>
          <span className="text-green-400 font-medium">+$0.18</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
