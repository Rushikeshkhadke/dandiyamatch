import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SparkEffect({ trigger = 0, count = 12, size = 'md' }) {
  const particles = Array.from({ length: count });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20">
      <AnimatePresence>
        {trigger > 0 &&
          particles.map((_, i) => {
            const angle = (i * 360) / count + (Math.random() * 20 - 10);
            const distance = 40 + Math.random() * (size === 'lg' ? 140 : 60);
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;
            const color = i % 2 === 0 ? '#FFD700' : '#FF4D00';

            return (
              <motion.div
                key={`${trigger}-${i}`}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.4, 0],
                  opacity: [1, 1, 0],
                  x,
                  y,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
}
