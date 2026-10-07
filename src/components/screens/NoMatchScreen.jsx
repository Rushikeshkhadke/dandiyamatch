import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { Share2, RefreshCw, ArrowLeft, MapPin, LogOut } from 'lucide-react';

export default function NoMatchScreen() {
  const { language, resetMatches, setScreen, user, updateUser, logout } = useStore();
  const t = getTranslation(language);

  const handleShare = async () => {
    const shareData = {
      title: 'DandiyaMatch 🎊',
      text: 'Navratri mein Dandiya partner dhundh rahe ho? Check out DandiyaMatch!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard! Share with friends 🎊');
    }
  };

  if (!user) {
    return <div className="relative h-full w-full bg-[#0D0208]" />;
  }

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between px-6 py-6 overflow-y-auto select-none">
      {/* Top back navigation */}
      <header className="relative z-20 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => setScreen('discovery')}
          aria-label="Back to Hub"
          className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#3D151C] hover:border-gold/50 flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-gold uppercase">
          DandiyaMatch
        </span>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A0A0A] border border-[#3D151C] hover:border-gold/40 text-xs font-semibold text-gold transition-colors cursor-pointer touch-manipulation active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5 text-primary" />
          <span>{user?.is_demo ? 'Sign In' : 'Logout'}</span>
        </button>
      </header>

      {/* Center: Sad / Drooping Dandiya Sticks Animation */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-2">
        <div className="relative w-48 h-48 flex items-center justify-center mb-4">
          <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
            {/* Drooping left stick */}
            <motion.g
              animate={{
                rotate: [-35, -45, -35],
                y: [0, 8, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              style={{ originX: '70px', originY: '160px' }}
            >
              <rect x="65" y="40" width="10" height="120" rx="5" fill="#8B6F5E" opacity="0.7" />
              <circle cx="70" cy="38" r="4" fill="#5E493C" />
            </motion.g>

            {/* Drooping right stick */}
            <motion.g
              animate={{
                rotate: [35, 45, 35],
                y: [0, 8, 0],
              }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              style={{ originX: '130px', originY: '160px' }}
            >
              <rect x="125" y="40" width="10" height="120" rx="5" fill="#8B6F5E" opacity="0.7" />
              <circle cx="130" cy="38" r="4" fill="#5E493C" />
            </motion.g>

            {/* Tear drop / sparkle fading */}
            <motion.circle
              cx="100"
              cy="95"
              r="3"
              fill="#FFD700"
              animate={{ y: [0, 20], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#FFF5E4] max-w-xs leading-tight">
          {t.noMatchTitle}
        </h2>

        <p className="text-sm text-text-muted mt-3 max-w-xs leading-relaxed">
          {t.noMatchSub}
        </p>
      </div>

      {/* Bottom Buttons */}
      <div className="relative z-20 space-y-3 pb-4">
        {/* Large Share Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={<Share2 className="w-5 h-5" />}
          onClick={handleShare}
          className="glow-orange font-bold text-base"
        >
          {t.shareApp}
        </Button>

        {/* Switch to real account button if in demo mode */}
        {user?.is_demo && (
          <Button
            variant="primary"
            size="md"
            fullWidth
            icon={<LogOut className="w-4 h-4 text-white" />}
            onClick={logout}
            className="glow-orange font-bold text-sm bg-gradient-to-r from-primary to-marigold"
          >
            Sign In with Google (Real Account)
          </Button>
        )}

        {/* Reset / Review passed profiles */}
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<RefreshCw className="w-4 h-4 text-gold" />}
          onClick={resetMatches}
        >
          Review Passed Partners
        </Button>

        {/* Quick explore other cities if exhausted */}
        <div className="pt-2">
          <p className="text-[11px] text-text-muted text-center mb-2 font-medium">
            Or explore dancers in other Garba hubs:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {['Ahmedabad', 'Vadodara', 'Mumbai', 'Surat'].map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={async () => {
                  await updateUser({ city: cityName });
                  resetMatches();
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-transform duration-75 cursor-pointer touch-manipulation active:scale-95 ${
                  user?.city?.toLowerCase() === cityName.toLowerCase()
                    ? 'bg-gold/20 border-gold text-gold font-semibold'
                    : 'bg-[#1A0A0A] border-[#3D151C] text-text-muted hover:border-gold/40 hover:text-white'
                }`}
              >
                📍 {cityName}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-text-muted/60 pt-1">
          {t.checkLater}
        </p>
      </div>
    </div>
  );
}
