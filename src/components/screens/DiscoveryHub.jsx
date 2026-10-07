import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { haptic } from '../../lib/haptics';
import { sounds } from '../../lib/sound';
import {
  MapPin,
  User,
  Heart,
  Sparkles,
  Flame,
  ArrowRight,
  Share2,
  Calendar,
  Volume2,
  VolumeX,
  MessageCircle,
} from 'lucide-react';
import ChatsListModal from '../ui/ChatsListModal';

export default function DiscoveryHub() {
  const [isChatsModalOpen, setIsChatsModalOpen] = React.useState(false);
  const {
    user,
    setScreen,
    findNextMatch,
    currentMatch,
    connectedIds,
    language,
    isSoundMuted,
    toggleSound,
  } = useStore();

  const t = getTranslation(language);

  const hasCheckedMatchRef = React.useRef(false);

  // Pre-calculate the match in the background ONCE when user enters Discovery Hub
  React.useEffect(() => {
    if (user && !currentMatch && !hasCheckedMatchRef.current) {
      hasCheckedMatchRef.current = true;
      findNextMatch(false);
    }
  }, [user, currentMatch, findNextMatch]);

  // Pre-cache partner photo in browser cache for 0ms render
  React.useEffect(() => {
    if (currentMatch?.photo_url) {
      const img = new Image();
      img.src = currentMatch.photo_url;
    }
  }, [currentMatch?.photo_url]);

  const handleStartSwiping = (e) => {
    if (e) e.stopPropagation();
    haptic.tap();
    sounds.playDandiyaTap();

    let match = currentMatch;
    if (!match) {
      findNextMatch(false);
      match = useStore.getState().currentMatch;
    }

    if (match) {
      setScreen('matchCard');
    } else {
      setScreen('noMatch');
    }
  };

  if (!user) {
    return <div className="relative h-full w-full bg-[#0D0208]" />;
  }

  const cityName = user?.city || 'Ahmedabad';
  const partnerGender = user?.gender === 'Female' ? 'Male' : 'Female';

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between px-5 pt-3 pb-5 overflow-y-auto select-none">
      {/* Subtle festive background lighting */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between pb-3 border-b border-[#2A0D14] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪔</span>
          <div>
            <h1 className="font-heading font-extrabold text-base text-gold-gradient tracking-tight leading-none">
              DandiyaMatch
            </h1>
            <span className="text-[10px] text-text-muted/80 tracking-wider uppercase font-semibold">
              Navratri 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-full bg-[#1A0A0A] border border-[#3D151C] flex items-center justify-center text-text-muted hover:text-gold transition-colors cursor-pointer touch-manipulation active:scale-90"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold" />}
          </button>

          {/* My Chats / Jodis Button */}
          <button
            type="button"
            onClick={() => setIsChatsModalOpen(true)}
            aria-label="My Chats"
            title="My Garba Jodis"
            className="relative w-9 h-9 rounded-full bg-[#1A0A0A] border border-primary/40 hover:border-primary flex items-center justify-center text-primary hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-90"
          >
            <MessageCircle className="w-4 h-4" />
            {connectedIds && connectedIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center shadow-glow-primary">
                {connectedIds.length}
              </span>
            )}
          </button>

          {/* Profile Avatar Button */}
          <button
            type="button"
            onClick={() => setScreen('profile')}
            aria-label="My Profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#1A0A0A] border border-gold/40 hover:border-gold transition-all cursor-pointer group touch-manipulation active:scale-95"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
              {user?.photo_url ? (
                <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 text-gold m-auto" />
              )}
            </div>
            <span className="text-xs font-semibold text-gold truncate max-w-[80px]">
              {user?.naam ? user.naam.split(' ')[0] : 'Profile'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6 space-y-6">
        {/* Warm Personal Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#250E13] border border-primary/30 text-gold text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Garba Circle Ready</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#FFF5E4] tracking-tight leading-tight">
            Aavo, {user?.naam ? user.naam.split(' ')[0] : 'Dancer'}!
          </h2>

          <p className="text-xs sm:text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
            The dhol beats are calling and the circle is forming. Find your partner to dance through Navratri nights.
          </p>
        </motion.div>

        {/* Live Matching Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gradient-to-b from-[#1E090F] to-[#14050A] rounded-3xl p-5 border border-[#3D151C] shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#2A0D14]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                  Location
                </span>
                <span className="text-sm font-bold text-[#FFF5E4]">{cityName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScreen('profile')}
              className="text-xs text-gold/90 hover:text-gold font-semibold underline underline-offset-2 cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3.5">
            <div className="bg-[#0D0208]/70 rounded-2xl p-3 border border-[#250E13]">
              <span className="text-[10px] text-text-muted uppercase font-semibold block">
                Looking For
              </span>
              <span className="text-xs font-bold text-gold mt-0.5 block">
                {partnerGender === 'Female' ? 'Female Partner' : 'Male Partner'}
              </span>
            </div>

            <div className="bg-[#0D0208]/70 rounded-2xl p-3 border border-[#250E13]">
              <span className="text-[10px] text-text-muted uppercase font-semibold block">
                Your Dancing Level
              </span>
              <span className="text-xs font-bold text-[#FFF5E4] mt-0.5 block">
                {user?.dancing_level || 'Intermediate'} Dancer
              </span>
            </div>
          </div>

          {user?.event_pin && (
            <div className="mt-3 bg-[#2A0D14]/50 rounded-2xl px-3.5 py-2.5 border border-gold/20 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] text-text-muted block">Pinned Event</span>
                <span className="text-xs font-bold text-gold truncate block">
                  {user.event_pin}
                </span>
              </div>
            </div>
          )}

          {connectedIds && connectedIds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#2A0D14] flex items-center justify-between text-xs text-text-muted">
              <span>Connected Partners:</span>
              <span className="font-bold text-primary">{connectedIds.length} Connected</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Hero CTA Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-20 space-y-3 pt-2 shrink-0"
      >
        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleStartSwiping}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF4D00] via-[#FF6A00] to-[#E0A96D] text-white font-heading font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-glow-primary active:scale-[0.98] transition-transform duration-75 cursor-pointer touch-manipulation"
        >
          <span>Start Swiping</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>

        {/* Secondary Options */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScreen('profile');
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex-1 py-2.5 px-2.5 rounded-xl bg-[#1A0A0A] hover:bg-[#250E13] border border-[#3D151C] text-xs font-semibold text-[#FFF5E4] hover:text-gold active:scale-95 transition-transform duration-75 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <User className="w-3.5 h-3.5 text-gold" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsChatsModalOpen(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex-1 py-2.5 px-2.5 rounded-xl bg-[#1A0A0A] hover:bg-[#250E13] border border-primary/40 hover:border-primary text-xs font-semibold text-[#FFF5E4] hover:text-primary active:scale-95 transition-transform duration-75 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <MessageCircle className="w-3.5 h-3.5 text-primary" />
            <span>My Jodis {connectedIds && connectedIds.length > 0 ? `(${connectedIds.length})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScreen('shareCard');
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex-1 py-2.5 px-2.5 rounded-xl bg-[#1A0A0A] hover:bg-[#250E13] border border-[#3D151C] text-xs font-semibold text-[#FFF5E4] hover:text-gold active:scale-95 transition-transform duration-75 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <Share2 className="w-3.5 h-3.5 text-gold/80" />
            <span>Share</span>
          </button>
        </div>
      </motion.div>

      {/* Connected Jodis Modal */}
      <ChatsListModal
        isOpen={isChatsModalOpen}
        onClose={() => setIsChatsModalOpen(false)}
      />
    </div>
  );
}
