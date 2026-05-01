"use client";

import React from 'react';
import { motion } from 'framer-motion';

const stories = [
  { id: 1, name: "Jin-Soo", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100", active: true },
  { id: 2, name: "Min-Ji", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100&h=100", active: true },
  { id: 3, name: "Yuna", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100", active: false },
  { id: 4, name: "Seo-Yun", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100", active: true },
  { id: 5, name: "Hye-Jin", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100", active: false },
  { id: 6, name: "Ji-Won", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=100&h=100", active: true },
];

export default function StoriesSection() {
  return (
    <div className="py-8 overflow-hidden">
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-2">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <div className={`p-1 rounded-full ${story.active ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-gray-700'}`}>
              <div className="bg-design-bg p-1 rounded-full">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover grayscale-[20%] hover:grayscale-0 transition-all"
                />
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">{story.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
