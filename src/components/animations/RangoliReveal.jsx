import React from 'react';
import { motion } from 'framer-motion';

export default function RangoliReveal({
  size = 320,
  onComplete = null,
  duration = 2.4,
}) {
  const drawTransition = {
    duration,
    ease: 'easeInOut',
  };

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80"
      >
        <defs>
          <filter id="rangoliGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#FFD700" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Circular Ring */}
        <motion.circle
          cx="200"
          cy="200"
          r="180"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={drawTransition}
        />

        {/* Concentric Circle 2 */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          stroke="#FF4D00"
          strokeWidth="1.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={drawTransition}
          filter="url(#rangoliGlow)"
        />

        {/* Concentric Circle 3 */}
        <motion.circle
          cx="200"
          cy="200"
          r="90"
          stroke="#FFD700"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={drawTransition}
        />

        {/* Central Core Circle */}
        <motion.circle
          cx="200"
          cy="200"
          r="30"
          stroke="#FFE566"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={drawTransition}
        />

        {/* 8-Petal Geometry generated programmatically */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            {/* Outer Diamond Spoke */}
            <motion.path
              d="M 200 50 L 225 100 L 200 150 L 175 100 Z"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ ...drawTransition, delay: i * 0.08 }}
              filter="url(#rangoliGlow)"
            />

            {/* Inner Floral Curved Petal */}
            <motion.path
              d="M 200 110 C 220 135 220 165 200 190 C 180 165 180 135 200 110 Z"
              stroke="#FF4D00"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ ...drawTransition, delay: 0.3 + i * 0.06 }}
            />

            {/* Radial Line to Outer Ring */}
            <motion.line
              x1="200"
              y1="20"
              x2="200"
              y2="50"
              stroke="#FFE566"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ ...drawTransition, delay: 0.5 }}
            />

            {/* Accent Diya Dot */}
            <motion.circle
              cx="200"
              cy="20"
              r="3.5"
              fill="#FFD700"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: duration + i * 0.04 }}
            />
          </g>
        ))}

        {/* Central 8-Point Star */}
        <motion.polygon
          points="200,165 210,190 235,200 210,210 200,235 190,210 165,200 190,190"
          stroke="#FFD700"
          strokeWidth="2"
          fill="rgba(255, 77, 0, 0.15)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: duration * 0.6 }}
          onAnimationComplete={onComplete}
        />
      </svg>
    </div>
  );
}
