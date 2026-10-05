import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RangoliReveal from '../animations/RangoliReveal';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { Volume2, VolumeX, Globe } from 'lucide-react';

export default function LandingPage() {
  const { setScreen, language, setLanguage, isSoundMuted, toggleSound } = useStore();
  const t = getTranslation(language);
  const [rangoliDrawn, setRangoliDrawn] = useState(false);

  return (
    <div className="relative h-screen w-full bg-[#0D0208] flex flex-col justify-between overflow-hidden px-6 py-8">
      {/* Floating tiny gold particles (CSS-powered 60fps) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold/70 animate-float-slow"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 19) % 95}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${7 + (i % 5)}s`,
              boxShadow: '0 0 8px #FFD700',
            }}
          />
        ))}
      </div>

      {/* Top Bar: Brand mark + Language Pill + Sound Toggle */}
      <header className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mini logo icon */}
          <div className="w-8 h-8 rounded-full bg-[#1A0A0A] border border-gold/40 flex items-center justify-center text-gold font-heading font-black text-sm">
            🪔
          </div>
          <span className="font-heading font-bold text-lg text-gold-gradient tracking-tight">
            DandiyaMatch
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-full bg-[#1A0A0A] border border-[#3D151C] flex items-center justify-center text-text-muted hover:text-gold transition-colors"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#1A0A0A] border border-[#3D151C] rounded-full p-0.5 text-xs font-medium">
            {['en', 'hi', 'gu'].map((langKey) => (
              <button
                key={langKey}
                type="button"
                onClick={() => setLanguage(langKey)}
                className={`px-2.5 py-1 rounded-full uppercase transition-all duration-200 ${
                  language === langKey
                    ? 'bg-primary text-white font-bold shadow-[0_0_8px_#FF4D00]'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {langKey}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Center Hero: Rangoli Reveal + Headline overlay */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* Animated Geometric Rangoli */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <RangoliReveal
            size={340}
            onComplete={() => setRangoliDrawn(true)}
            duration={2.2}
          />
        </div>

        {/* Headline and Festive Subtext (Fades in over rangoli) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 1.2, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-sm px-2 backdrop-blur-[2px] py-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2A0D14]/80 border border-gold/30 text-xs font-semibold text-gold mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t.tagline}
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#FFF5E4] tracking-tight leading-[1.15] drop-shadow-lg">
            {t.heroHeading}
          </h2>

          <p className="text-sm text-text-muted mt-3 font-normal max-w-xs mx-auto leading-relaxed">
            Dhol beats, Garba energy, and your perfect dance partner — just a tap away.
          </p>
        </motion.div>
      </div>

      {/* Bottom 25%: Single CTA Button with Warm Glow */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="relative z-20 pb-4"
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setScreen('login')}
          className="glow-orange font-bold text-lg tracking-wide uppercase"
        >
          {t.letsDance}
        </Button>
      </motion.div>
    </div>
  );
}
