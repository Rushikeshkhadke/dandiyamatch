import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import {
  Heart,
  X,
  MapPin,
  Calendar,
  Flag,
  User,
  Zap,
  Flame,
  Sprout,
  CheckCircle,
  LogOut,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { normalizeCity } from '../../lib/matching';
import ChatsListModal from '../ui/ChatsListModal';

/**
 * Individual Swipeable Card
 * Has its own isolated MotionValues so dragging one card NEVER affects the next card!
 */
const SwipeCard = React.forwardRef(function SwipeCard(
  { match, isEventMatch, onPass, onConnect, t },
  ref
) {
  // Each card instance has its own motion values starting clean at x = 0
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-240, -180, 0, 180, 240], [0, 1, 1, 1, 0]);

  // Indicator badges on drag
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const passOpacity = useTransform(x, [-20, -90], [0, 1]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 80 || info.velocity.x > 400) {
      onConnect();
    } else if (info.offset.x < -80 || info.velocity.x < -400) {
      onPass();
    }
  };

  const getDancingLevelIcon = (level) => {
    if (level === 'Pro') return <Zap className="w-3.5 h-3.5 text-gold" />;
    if (level === 'Intermediate') return <Flame className="w-3.5 h-3.5 text-primary" />;
    return <Sprout className="w-3.5 h-3.5 text-green-400" />;
  };

  return (
    <motion.div
      ref={ref}
      key={match.id}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: -450,
        opacity: 0,
        rotate: -20,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full flex flex-col cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* SWIPE OVERLAY INDICATORS */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-20 right-6 z-40 px-5 py-2 rounded-2xl border-2 border-primary bg-[#0D0208]/90 text-primary font-heading font-black text-2xl rotate-12 shadow-glow-primary pointer-events-none"
      >
        CONNECT
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-20 left-6 z-40 px-5 py-2 rounded-2xl border-2 border-[#8B6F5E] bg-[#0D0208]/90 text-[#8B6F5E] font-heading font-bold text-2xl -rotate-12 pointer-events-none"
      >
        PASS
      </motion.div>

      {/* TOP 50%: Partner Photo with edge-to-edge finish & gradient */}
      <div className="relative h-[50%] w-full overflow-hidden bg-[#1A0A0A] flex-shrink-0">
        <img
          src={
            match.photo_url ||
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
          }
          alt={match.naam}
          className="w-full h-full object-cover object-top pointer-events-none"
          loading="lazy"
        />

        {/* Deep dark gradient overlay at bottom of photo for seamless blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0A] via-[#1A0A0A]/40 to-transparent pointer-events-none" />

        {/* Event Match Badge if attending same event */}
        {isEventMatch && (
          <div className="absolute bottom-4 left-5 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wide shadow-glow-primary">
            <Flame className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>{t.eventMatch}</span>
          </div>
        )}
      </div>

      {/* BOTTOM 50%: Dark Maroon Card with clean vertical rhythm and alignment */}
      <div className="relative -mt-3 flex-1 bg-[#1A0A0A] rounded-t-3xl border-t border-[#3D151C] px-5 pt-4 pb-24 flex flex-col justify-start overflow-hidden shadow-2xl">
        {/* Row 1: Partner Name (Full Width, Left Aligned) */}
        <div className="mb-2">
          <h2 className="text-3xl font-heading font-black text-gold tracking-tight leading-tight drop-shadow-sm text-left">
            {match.naam}
          </h2>
        </div>

        {/* Row 2: Demographic Chips (Gender, Age, City) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#2A0D14] text-gold border border-gold/40 text-xs font-bold">
            {match.gender}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#250E13] text-[#FFF5E4]/90 border border-[#3D151C] text-xs font-semibold">
            {match.age_group} yrs
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#250E13] text-[#FFF5E4]/90 border border-[#3D151C] text-xs font-semibold">
            <MapPin className="w-3 h-3 text-gold" />
            <span>{match.city}</span>
          </span>
        </div>

        {/* Row 3: Dance Attributes (Dancing Level & Vibe) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#250E13] border border-[#3D151C] text-xs font-medium text-[#FFF5E4]">
            {getDancingLevelIcon(match.dancing_level)}
            <span>{match.dancing_level} Dancer</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#250E13] border border-[#3D151C] text-xs font-medium text-[#FFF5E4]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{match.vibe} Vibe</span>
          </div>
        </div>

        {/* Row 4: Event Pin Card (Clean, well-aligned) */}
        {match.event_pin && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#2A0D14]/80 border border-gold/30 mb-2.5 text-xs text-[#FFF5E4]">
            <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-text-muted text-[11px]">Event:</span>
              <span className="font-semibold text-gold truncate">{match.event_pin}</span>
            </div>
          </div>
        )}

        {/* Row 5: Bio (Cleanly aligned text) */}
        {match.bio && (
          <div className="mt-0.5">
            <p className="text-xs sm:text-sm text-text-muted/90 italic leading-relaxed text-left line-clamp-3">
              "{match.bio}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default function MatchCard() {
  const {
    currentMatch,
    isEventMatch,
    passCurrentMatch,
    connectCurrentMatch,
    reportCurrentMatch,
    findNextMatch,
    setScreen,
    language,
    user,
    logout,
    connectedIds,
  } = useStore();

  const t = getTranslation(language);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [chatsModalOpen, setChatsModalOpen] = useState(false);

  // Auto-correct if current match has different city OR same gender as user (e.g. from previous session)
  useEffect(() => {
    if (currentMatch && user) {
      const userGender = user.gender || 'Male';
      const targetGender = userGender === 'Male' ? 'Female' : 'Male';
      const userCity = normalizeCity(user.city || 'Ahmedabad');
      const matchCity = normalizeCity(currentMatch.city || '');

      const isGenderMismatch = currentMatch.gender && currentMatch.gender !== targetGender;
      const isCityMismatch = userCity && matchCity && userCity !== matchCity;

      if (isGenderMismatch || isCityMismatch) {
        findNextMatch(false);
      }
    } else if (!currentMatch && user) {
      findNextMatch(false);
    }
  }, [currentMatch, user, findNextMatch]);

  if (!user || !currentMatch) {
    return (
      <div className="relative h-full w-full bg-[#0D0208] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleReport = (reason) => {
    reportCurrentMatch(reason);
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
    }, 1500);
  };

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Floating App Bar */}
      <header className="absolute top-0 left-0 right-0 z-50 px-5 pt-4 pb-3 flex items-center justify-between bg-gradient-to-b from-[#0D0208]/90 via-[#0D0208]/50 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScreen('discovery');
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Back to Hub"
            className="w-8 h-8 rounded-full bg-[#1A0A0A]/80 border border-[#3D151C] hover:border-gold/50 flex items-center justify-center text-text-muted hover:text-white active:scale-90 transition-transform duration-75 cursor-pointer touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-heading font-bold text-base text-gold-gradient tracking-tight">
            DandiyaMatch
          </span>
          {user?.is_demo && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
              Demo
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user?.is_demo ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/30 to-marigold/30 border border-primary/60 text-[#FFF5E4] hover:text-gold text-xs font-bold transition-all cursor-pointer shadow-glow-primary active:scale-95 touch-manipulation"
            >
              <LogOut className="w-3.5 h-3.5 text-primary" />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="Logout"
              aria-label="Logout"
              className="w-9 h-9 rounded-full bg-[#0D0208]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-muted hover:text-white active:scale-90 transition-transform duration-75 cursor-pointer touch-manipulation"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Chats / Messages Button */}
          {connectedIds && connectedIds.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setChatsModalOpen(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="My Garba Jodis"
              aria-label="My Chats"
              className="relative w-9 h-9 rounded-full bg-[#0D0208]/70 backdrop-blur-md border border-primary/40 hover:border-primary flex items-center justify-center text-primary active:scale-90 transition-transform duration-75 cursor-pointer touch-manipulation"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center shadow-glow-primary">
                {connectedIds.length}
              </span>
            </button>
          )}

          {/* Report Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setReportModalOpen(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Report Profile"
            className="w-9 h-9 rounded-full bg-[#0D0208]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-muted hover:text-red-400 active:scale-90 transition-transform duration-75 cursor-pointer touch-manipulation"
          >
            <Flag className="w-4 h-4" />
          </button>

          {/* Profile Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScreen('profile');
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="View My Profile"
            className="w-9 h-9 rounded-full bg-[#0D0208]/70 backdrop-blur-md border border-gold/40 flex items-center justify-center text-gold hover:border-gold active:scale-90 transition-transform duration-75 overflow-hidden cursor-pointer touch-manipulation"
          >
            {user?.photo_url ? (
              <img src={user.photo_url} alt="My Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-gold" />
            )}
          </button>
        </div>
      </header>

      {/* Swipeable Card Stack Area */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <SwipeCard
            key={currentMatch.id}
            match={currentMatch}
            isEventMatch={isEventMatch}
            onPass={passCurrentMatch}
            onConnect={connectCurrentMatch}
            t={t}
          />
        </AnimatePresence>
      </div>

      {/* Floating Bottom Action Buttons: Pass (left) & Connect (right) */}
      <footer className="absolute bottom-5 left-0 right-0 z-50 px-6 flex items-center justify-between max-w-md mx-auto pointer-events-auto">
        {/* Pass Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            passCurrentMatch();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Pass"
          className="w-16 h-16 rounded-full bg-[#1A0A0A] border-2 border-[#3D151C] hover:border-[#8B6F5E] text-text-muted hover:text-white flex items-center justify-center shadow-card-deep active:scale-90 transition-transform duration-75 cursor-pointer touch-manipulation"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Swipe Hint */}
        <div className="text-center pointer-events-none">
          <span className="text-[11px] font-semibold tracking-widest text-text-muted/70 uppercase">
            ← Swipe to Match →
          </span>
        </div>

        {/* Connect Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            connectCurrentMatch();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Connect"
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF4D00] to-[#FF7A00] border-2 border-[#FFE566]/70 text-white flex items-center justify-center shadow-glow-primary hover:shadow-[0_0_35px_rgba(255,77,0,0.8)] active:scale-90 transition-transform duration-75 cursor-pointer relative touch-manipulation"
        >
          {/* Dandiya + Heart Icon combo */}
          <div className="relative flex items-center justify-center">
            <Heart className="w-9 h-9 fill-white text-white drop-shadow" />
            <span className="absolute text-sm">🪔</span>
          </div>
        </button>
      </footer>

      {/* Report Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A0A0A] border border-[#3D151C] rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl"
            >
              {reportSuccess ? (
                <div className="py-4">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg text-gold">
                    {t.reported}
                  </h3>
                </div>
              ) : (
                <>
                  <Flag className="w-10 h-10 text-red-400 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg text-[#FFF5E4]">
                    Report Profile
                  </h3>
                  <p className="text-xs text-text-muted mt-1 mb-5">
                    We maintain a safe, welcoming festival space. Why are you reporting?
                  </p>

                  <div className="space-y-2 mb-4">
                    {[
                      'Fake profile / Wrong photo',
                      'Inappropriate contact information',
                      'Spam or advertising',
                      'Harassment / Rude behavior',
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleReport(reason)}
                        className="w-full p-3 rounded-2xl bg-[#250E13] hover:bg-[#3D151C] text-xs font-semibold text-text-muted hover:text-white border border-[#3D151C] text-left transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="text-xs text-text-muted hover:text-white px-4 py-2 cursor-pointer touch-manipulation active:scale-95"
                  >
                    Cancel
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Connected Jodis Modal */}
      <ChatsListModal
        isOpen={chatsModalOpen}
        onClose={() => setChatsModalOpen(false)}
      />
    </div>
  );
}
