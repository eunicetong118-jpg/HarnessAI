'use client';

import React from "react";
import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-design-bg p-4 overflow-hidden">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
