import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import DandiyaTap from '../animations/DandiyaTap';
import { useStore } from '../../store/useStore';

export default function LoadingScreen() {
  const { user, setScreen } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        if (user.city && user.vibe) {
          setScreen('discovery');
        } else {
          setScreen('form');
        }
      } else {
        setScreen('landing');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [user, setScreen]);

  return (
    <div className="relative min-h-screen w-full bg-[#0D0208] flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Subtle festive dust background particles */}
      <div className="absolute inset-0 festive-dust opacity-30 pointer-events-none" />

      {/* Center Dandiya Tap animation */}
      <div className="relative z-10 flex flex-col items-center">
        <DandiyaTap size={240} autoPlay={true} playAudio={true} />

        {/* App Name fades in below */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="text-center mt-6"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-gold-gradient drop-shadow-[0_2px_12px_rgba(255,215,0,0.3)]">
            DandiyaMatch
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-sm font-medium text-text-muted mt-2 tracking-widest uppercase"
          >
            Raat Ka Mela — Phone Mein
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom version / loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 text-xs text-text-muted/60 tracking-wider"
      >
        NAVRATRI 2026 EDITION
      </motion.div>
    </div>
  );
}
