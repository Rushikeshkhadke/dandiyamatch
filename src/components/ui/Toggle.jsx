import React from 'react';
import { motion } from 'framer-motion';
import { haptic } from '../../lib/haptics';

export default function Toggle({
  checked = false,
  onChange,
  label = '',
  description = '',
  icon = null,
  disabled = false,
}) {
  const handleToggle = () => {
    if (disabled) return;
    haptic.light();
    onChange(!checked);
  };

  return (
    <div
      onClick={handleToggle}
      className={`
        flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 select-none
        ${
          checked
            ? 'bg-[#2A0D14]/80 border-primary/60 shadow-glow-primary'
            : 'bg-[#1A0A0A] border-[#3D151C] hover:border-gold/30'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center gap-3 pr-4">
        {icon && <div className="text-xl flex-shrink-0">{icon}</div>}
        <div>
          <div className="text-sm font-semibold text-[#FFF5E4]">{label}</div>
          {description && (
            <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </div>

      <div
        className={`
          w-13 h-7 rounded-full flex items-center p-1 transition-colors duration-300 flex-shrink-0
          ${checked ? 'bg-primary shadow-[0_0_12px_#FF4D00]' : 'bg-[#2D1418]'}
        `}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            w-5 h-5 rounded-full bg-white shadow-md
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </div>
    </div>
  );
}
