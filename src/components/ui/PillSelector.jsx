import React from 'react';
import { motion } from 'framer-motion';
import { haptic } from '../../lib/haptics';

export default function PillSelector({
  options = [], // [{ value, label, emoji, subtitle }]
  value,
  onChange,
  columns = 1, // 1, 2, or 3
  className = '',
}) {
  const handleSelect = (val) => {
    haptic.light();
    onChange(val);
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }[columns] || 'grid-cols-1';

  return (
    <div className={`grid ${gridColsClass} gap-3 w-full ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            animate={
              isSelected
                ? {
                    scale: [1, 1.03, 1],
                    transition: { type: 'spring', stiffness: 450, damping: 18 },
                  }
                : {}
            }
            className={`
              relative flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF4D00]/20 to-[#FFD700]/10 border-2 border-primary shadow-glow-primary text-[#FFF5E4]'
                  : 'bg-[#1A0A0A]/90 hover:bg-[#250E13] border border-[#3D151C] text-[#FFF5E4]/85 hover:border-gold/30'
              }
            `}
          >
            <div className="flex items-center gap-3.5">
              {option.emoji && (
                <span className="text-2xl flex-shrink-0">{option.emoji}</span>
              )}
              <div>
                <div className="font-semibold text-base tracking-wide flex items-center gap-1.5">
                  {option.label}
                </div>
                {option.subtitle && (
                  <div className="text-xs text-text-muted mt-0.5">
                    {option.subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Checkmark or radio dot indicator */}
            <div
              className={`
                w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 flex-shrink-0
                ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-[0_0_8px_#FF4D00]'
                    : 'border-[#5E493C] bg-transparent'
                }
              `}
            >
              {isSelected && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
