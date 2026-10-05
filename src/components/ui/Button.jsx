import React from 'react';
import { motion } from 'framer-motion';
import { haptic } from '../../lib/haptics';

export default function Button({
  children,
  onClick,
  variant = 'primary', // 'primary', 'secondary', 'gold', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  disabled = false,
  icon = null,
  className = '',
  type = 'button',
}) {
  const handleClick = (e) => {
    if (disabled) return;
    haptic.light();
    if (onClick) onClick(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium select-none transition-all duration-200 outline-none rounded-2xl';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5 min-h-[42px]',
    md: 'px-6 py-3.5 text-base gap-2 min-h-[52px]',
    lg: 'px-8 py-4 text-lg font-semibold gap-2.5 min-h-[60px]',
  };

  const variantStyles = {
    primary:
      'bg-primary text-[#FFF5E4] hover:bg-primary-hover shadow-glow-primary hover:shadow-[0_0_30px_rgba(255,77,0,0.6)] border border-[#FF6B26]/30',
    gold:
      'bg-gold text-[#0D0208] font-bold hover:bg-gold-light shadow-glow-gold hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] border border-[#FFE566]/50',
    secondary:
      'bg-[#2A0D14] text-[#FFF5E4] hover:bg-[#3D151C] border border-[#FFD700]/20 hover:border-[#FFD700]/40',
    outline:
      'bg-transparent text-[#FFF5E4] border border-[#8B6F5E]/40 hover:border-gold hover:text-gold',
    ghost:
      'bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5',
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0 text-xl">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
