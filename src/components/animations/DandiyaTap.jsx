import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SparkEffect from './SparkEffect';
import { sounds } from '../../lib/sound';
import { haptic } from '../../lib/haptics';

export default function DandiyaTap({
  size = 240,
  autoPlay = true,
  playAudio = true,
  onTap = null,
}) {
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setTapCount((prev) => prev + 1);
      if (playAudio) {
        sounds.playDandiyaTap();
      }
      haptic.tap();
      if (onTap) onTap();
    }, 1100);

    return () => clearInterval(interval);
  }, [autoPlay, playAudio, onTap]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Central Contact Spark Generator */}
      <SparkEffect trigger={tapCount} count={16} size="lg" />

      {/* Glow aura around strike point */}
      <motion.div
        animate={{
          scale: [0.8, 1.25, 0.8],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: 'easeInOut',
        }}
        className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-primary/30 via-gold/30 to-sindoor/30 blur-xl pointer-events-none"
      />

      {/* SVG Dandiya Sticks */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        <defs>
          {/* Stick Gradient 1: Gold to Electric Orange to Sindoor */}
          <linearGradient id="stickGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF099" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="65%" stopColor="#FF4D00" />
            <stop offset="100%" stopColor="#8A0015" />
          </linearGradient>

          {/* Stick Gradient 2: Mirrored festive gradient */}
          <linearGradient id="stickGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF099" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="65%" stopColor="#FF4D00" />
            <stop offset="100%" stopColor="#8A0015" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFD700" floodOpacity="0.6"/>
          </filter>
        </defs>

        {/* Left Dandiya Stick (Rotates clockwise to strike right) */}
        <motion.g
          animate={{
            rotate: [-28, 6, -28],
            x: [-12, 10, -12],
            y: [5, -4, 5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ originX: '45px', originY: '170px' }}
        >
          {/* Stick Body */}
          <rect
            x="42"
            y="25"
            width="12"
            height="150"
            rx="6"
            fill="url(#stickGrad1)"
            stroke="#FFE566"
            strokeWidth="0.75"
          />

          {/* Traditional Decorative Band Rings */}
          <rect x="41" y="45" width="14" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />
          <rect x="41" y="55" width="14" height="6" rx="2" fill="#FFD700" filter="url(#goldGlow)" />
          <rect x="41" y="67" width="14" height="4" rx="2" fill="#D90429" />
          <rect x="41" y="85" width="14" height="8" rx="2" fill="#FFE566" />
          <rect x="41" y="105" width="14" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
          <rect x="41" y="125" width="14" height="5" rx="2" fill="#FFD700" />

          {/* Golden Bell / Ghunghroo at top */}
          <circle cx="48" cy="22" r="5" fill="#FFD700" filter="url(#goldGlow)" />
          <circle cx="48" cy="22" r="2" fill="#FFFFFF" />

          {/* Tassel Grip at bottom */}
          <path
            d="M48 175 C45 185, 42 192, 40 198 M48 175 C48 185, 48 193, 48 200 M48 175 C51 185, 54 192, 56 198"
            stroke="#FF4D00"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Right Dandiya Stick (Rotates counter-clockwise to strike left) */}
        <motion.g
          animate={{
            rotate: [28, -6, 28],
            x: [12, -10, 12],
            y: [5, -4, 5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ originX: '155px', originY: '170px' }}
        >
          {/* Stick Body */}
          <rect
            x="146"
            y="25"
            width="12"
            height="150"
            rx="6"
            fill="url(#stickGrad2)"
            stroke="#FFE566"
            strokeWidth="0.75"
          />

          {/* Traditional Decorative Band Rings */}
          <rect x="145" y="45" width="14" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />
          <rect x="145" y="55" width="14" height="6" rx="2" fill="#FFD700" filter="url(#goldGlow)" />
          <rect x="145" y="67" width="14" height="4" rx="2" fill="#D90429" />
          <rect x="145" y="85" width="14" height="8" rx="2" fill="#FFE566" />
          <rect x="145" y="105" width="14" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
          <rect x="145" y="125" width="14" height="5" rx="2" fill="#FFD700" />

          {/* Golden Bell / Ghunghroo at top */}
          <circle cx="152" cy="22" r="5" fill="#FFD700" filter="url(#goldGlow)" />
          <circle cx="152" cy="22" r="2" fill="#FFFFFF" />

          {/* Tassel Grip at bottom */}
          <path
            d="M152 175 C149 185, 146 192, 144 198 M152 175 C152 185, 152 193, 152 200 M152 175 C155 185, 158 192, 160 198"
            stroke="#FF4D00"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Central Strike Point Starburst */}
        <motion.circle
          cx="100"
          cy="48"
          r="4"
          fill="#FFF"
          animate={{
            scale: [0, 2.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.1,
            ease: 'easeOut',
          }}
          filter="url(#goldGlow)"
        />
      </svg>
    </div>
  );
}
