'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'PENDING' | 'VERIFIED';
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const isVerified = status === 'VERIFIED';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 blur-md rounded-full transition-opacity duration-1000",
          isVerified ? "bg-emerald-500/40" : "bg-amber-500/40"
        )} />

        {/* Badge Container */}
        <div className={cn(
          "relative flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md text-[10px] font-black uppercase tracking-widest transition-all duration-500",
          isVerified
            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            : "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        )}>
          {isVerified ? (
            <ShieldCheck className="w-3 h-3 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-3 h-3 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]" />
            </motion.div>
          )}
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
};
