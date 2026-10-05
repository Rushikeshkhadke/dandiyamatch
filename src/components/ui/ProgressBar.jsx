import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ currentStep = 1, totalSteps = 8 }) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full bg-[#1A0A0A] h-1.5 overflow-hidden relative">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-gold to-gold-light shadow-glow-gold relative"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Leading shimmer tip */}
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-80" />
      </motion.div>
    </div>
  );
}
