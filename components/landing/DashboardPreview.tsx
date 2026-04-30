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
    <div className="bg-design-surface rounded-2xl p-6 shadow-xl max-w-4xl mx-auto my-12 border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Your Savings Dashboard</h2>
        <div className="text-green-400 font-medium flex items-center">
          <span className="mr-1">+$12.50 today</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-design-card p-6 rounded-xl">
          <p className="text-sm text-gray-400 mb-2">Total Saved</p>
          <p className="text-3xl font-bold text-white">
            ${(balance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-design-card p-6 rounded-xl md:col-span-2">
          <p className="text-sm text-gray-400 mb-2">Savings Growth</p>
          <div className="h-32 bg-gradient-to-r from-design-purple to-design-pink rounded-lg opacity-40"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
