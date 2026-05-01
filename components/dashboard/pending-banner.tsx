'use client';

import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const PendingBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-amber-500/10 border-l-4 border-amber-500 p-4 mb-6 rounded-r-xl"
    >
      <div className="flex items-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <AlertCircle className="h-5 w-5 text-amber-500" aria-hidden="true" />
        </motion.div>
        <div className="ml-3">
          <p className="text-sm text-amber-200 font-medium">
            Account Verification Pending: Your MT5 account is currently being reviewed.
            Rebates will start accumulating once verified.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
