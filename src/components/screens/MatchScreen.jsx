import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DandiyaTap from '../animations/DandiyaTap';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';

export default function MatchScreen() {
  const { language, currentMatch } = useStore();
  const t = getTranslation(language);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Flash trigger before transitioning
    const flashTimer = setTimeout(() => {
      setFlash(true);
    }, 1900);

    return () => clearTimeout(flashTimer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0D0208] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle Screen Flash when match found */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-primary pointer-events-none z-30"
          />
        )}
      </AnimatePresence>

      {/* Floating particles */}
      <div className="absolute inset-0 festive-dust opacity-30 pointer-events-none" />

      {/* Center Dandiya Tap animation */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <DandiyaTap size={240} autoPlay={true} playAudio={true} />

        {/* Pulsing Match finding text */}
        <motion.div
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: 'easeInOut',
          }}
          className="mt-8"
        >
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gold-gradient tracking-tight">
            {t.searchingPartner}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-2 tracking-wide">
            {t.findingVibe}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
