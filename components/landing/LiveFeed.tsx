"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Sam", "Jamie", "Chris"];
const amounts = [0.5, 1.2, 2.5, 0.75, 3.1, 0.9, 1.5, 2.0, 0.3, 4.5];

interface FeedItem {
  id: number;
  name: string;
  amount: number;
  time: string;
}

export default function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    // Initial items
    const initialItems = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() - i * 3000,
      name: names[Math.floor(Math.random() * names.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      time: 'Just now'
    }));
    setItems(initialItems);

    const interval = setInterval(() => {
      const newItem = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        time: 'Just now'
      };
      setItems((prev) => [newItem, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-design-surface/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[520px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-xl font-bold text-white">Live Savings Feed</h3>
        <span className="flex items-center text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="space-y-3 relative flex-1">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-design-pink to-design-purple flex items-center justify-center text-xs font-bold">
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tight">{item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-design-pink font-bold">+${item.amount.toFixed(2)}</p>
                <p className="text-[10px] text-gray-500">Savings</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
