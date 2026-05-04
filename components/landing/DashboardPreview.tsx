"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DashboardPreview = ({ compact = false }: { compact?: boolean }) => {
  const [balance, setBalance] = useState(18420);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + Math.floor(Math.random() * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full max-w-5xl mx-auto ${compact ? 'py-0' : 'py-12'}`}>
      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ${compact ? 'auto-rows-[120px]' : 'auto-rows-[160px]'}`}>
        {/* Portfolio Card - Main Value Engine */}
        <div className="md:col-span-2 lg:col-span-2 row-span-2 glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6">
             <div className="w-12 h-12 rounded-full bg-design-pink/10 border border-design-pink/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-design-pink animate-pulse" />
             </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Rebates Earned</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">
              ${(balance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-green-400 text-sm font-bold">+12.5%</span>
              <span className="text-gray-500 text-xs">vs last month</span>
            </div>
          </div>

          {/* Simple Sparkline */}
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-50">
            <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="md:col-span-1 row-span-1 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Top Asset</p>
          <div>
            <p className="text-2xl font-bold text-white">XAUUSD</p>
            <p className="text-design-pink text-sm">$4.20 / lot</p>
          </div>
        </div>

        {/* Virtual Card - Holographic */}
        <div className="md:col-span-1 row-span-2 glass-card rounded-3xl p-6 overflow-hidden relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-design-pink/20 via-transparent to-design-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-white/10" />
              <div className="text-white/40 font-mono text-[10px]">REBATENGINE PRO</div>
            </div>
            <div>
              <p className="text-white/60 font-mono text-xs mb-1">**** 8842</p>
              <div className="flex justify-between items-end">
                <p className="text-white font-bold text-sm">TRADER PREMIER</p>
                <div className="w-8 h-5 bg-white/20 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Feed */}
        <div className="md:col-span-2 lg:col-span-2 row-span-1 glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
             <p className="text-white font-bold text-sm">Live Feed</p>
             <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/20" />)}
             </div>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   </div>
                   <span className="text-gray-300">EURUSD Rebate</span>
                </div>
                <span className="text-green-400 font-bold">+$0.82</span>
             </div>
             <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   </div>
                   <span className="text-gray-300">XAUUSD Rebate</span>
                </div>
                <span className="text-green-400 font-bold">+$2.15</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
