"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(18420);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBalance((b) => b + Math.floor(Math.random() * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className={compact ? "py-4" : "py-16 min-h-[600px]"} />;

  return (
    <div className={`relative ${compact ? 'py-4' : 'grid lg:grid-cols-2 gap-12 items-center py-16'}`}>
      <div className="text-left z-10">
        {!compact && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-design-pink/10 border border-design-pink/20 text-design-pink text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-design-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-design-pink"></span>
            </span>
            New Rebate Rates Live
          </div>
        )}

        <h1 className={`${compact ? 'text-4xl' : 'text-5xl md:text-7xl'} font-bold leading-tight text-white mb-4`}>
          Real Traders <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-design-pink to-design-purple">Save Millions.</span>
        </h1>

        <p className={`${compact ? 'text-sm mb-6' : 'text-lg md:text-xl mb-8'} text-gray-400 max-w-lg`}>
          Join 50,000+ traders maximizing profits with automated rebates.
        </p>

        <div className={`flex flex-wrap gap-4 ${compact ? 'mb-6' : 'mb-12'}`}>
          <Link
            href="/signup"
            className={`${compact ? 'px-6 py-3 text-sm' : 'px-8 py-4'} bg-gradient-to-r from-design-pink to-design-purple text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-design-pink/40`}
          >
            Start Saving
          </Link>
          {!compact && (
            <button className="px-8 py-4 glass-card text-white rounded-xl font-bold hover:bg-white/10 transition-all">
              See Live Rates
            </button>
          )}
        </div>

        {!compact && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-design-bg bg-gray-800" />
              ))}
            </div>
            <p><span className="text-white font-bold">1.2k+</span> traders joined today</p>
          </div>
        )}
      </div>

      {!compact && (
        <div className="relative group hidden lg:block">
          <div className="absolute -inset-4 bg-gradient-to-r from-design-pink/20 to-design-purple/20 rounded-3xl blur-2xl group-hover:opacity-100 opacity-50 transition-opacity" />
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600&h=750"
              alt="Lead Trader"
              className="w-full h-full object-cover grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-design-bg/80 via-transparent to-transparent" />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 w-40 h-72 bg-black rounded-[2.5rem] border-[6px] border-gray-900 shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500 z-30"
            >
              <div className="w-full h-full bg-design-bg flex flex-col p-3">
                <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-3 bg-design-pink/40 rounded-full" />
                  <div className="w-4 h-4 bg-design-purple/40 rounded-full" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-16 bg-white/5 rounded-xl border border-white/10 p-2 flex flex-col justify-center">
                    <div className="w-1/2 h-2 bg-gray-500 rounded-full mb-2" />
                    <div className="w-3/4 h-3 bg-design-pink rounded-full" />
                  </div>
                  <div className="h-24 bg-gradient-to-br from-design-pink/20 to-design-purple/20 rounded-xl border border-design-pink/30 p-2 flex items-center justify-center">
                    <div className="text-[10px] font-bold text-white text-center">CLAIM YOUR<br/>CASHBACK</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 translate-y-2 group-hover:translate-y-0 transition-all z-40">
              <p className="text-white font-bold italic mb-1 text-lg">"The best way to trade is to get paid while doing it!"</p>
              <p className="text-design-pink text-sm font-semibold tracking-wide">— Lee Ha-Na, Rebatengine Influencer</p>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-design-card border border-white/10 p-4 rounded-2xl shadow-xl z-20"
          >
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Savings</p>
            <p className="text-xl font-bold text-green-400">$12,482.50</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
