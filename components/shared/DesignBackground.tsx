'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const DesignBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background base color is handled by body or parent div with bg-design-bg */}

      {/* Animated liquid background blobs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-design-pink/20 blur-[120px] rounded-full mix-blend-screen"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -120, 0],
          y: [0, -80, 0],
          rotate: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-design-purple/20 blur-[120px] rounded-full mix-blend-screen"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 30, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-overlay"
      />

      {/* Static Radial Mesh */}
      <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.1),transparent_50%)]" />
    </div>
  );
};
