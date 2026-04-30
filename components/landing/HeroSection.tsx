"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [balance, setBalance] = useState(18420);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((b) => b + Math.floor(Math.random() * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-left py-10">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
        Real Traders Don't Just Earn.
        <br />
        <span className="text-design-pink">They Save.</span>
      </h1>

      <p className="mt-4 text-lg md:text-xl text-gray-400">
        Trade with near-zero cost. Show the world how much you saved.
      </p>

      <Link
        href="/signup"
        className="inline-block mt-6 bg-gradient-to-r from-design-pink to-design-purple text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
      >
        Start Saving Now
      </Link>

      {/* mini savings card */}
      <div className="mt-8 bg-design-card p-4 rounded-xl w-64 border border-white/5">
        <p className="text-sm text-gray-400">This Month</p>
        <p className="text-2xl text-design-pink font-bold">
          ${(balance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
