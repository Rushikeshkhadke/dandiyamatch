import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from '../animations/Confetti';
import SparkEffect from '../animations/SparkEffect';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { haptic } from '../../lib/haptics';
import { sounds } from '../../lib/sound';
import { Phone, Share2, ArrowRight, ArrowLeft, X, MessageCircle } from 'lucide-react';
import InstagramIcon from '../ui/InstagramIcon';

export default function ConnectScreen() {
  const {
    lastConnectedPartner,
    setScreen,
    findNextMatch,
    openChat,
    language,
    user,
  } = useStore();

  const t = getTranslation(language);
  const [sticksTapped, setSticksTapped] = useState(false);
  const [sparkTrigger, setSparkTrigger] = useState(0);

  useEffect(() => {
    // Vibrate phone with celebratory rhythm
    haptic.celebrate();
    sounds.playConnectSpark();

    const timer = setTimeout(() => {
      setSticksTapped(true);
      setSparkTrigger((prev) => prev + 1);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  if (!user || !lastConnectedPartner) {
    return (
      <div className="relative h-full w-full bg-[#0D0208] flex flex-col items-center justify-center p-6 text-center select-none">
        <h3 className="text-base font-bold text-gold mb-2">Connect partner ready</h3>
        <button
          type="button"
          onClick={() => {
            if (user) {
              findNextMatch(false);
            } else {
              setScreen('login');
            }
          }}
          className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs cursor-pointer touch-manipulation active:scale-95 shadow-glow-primary"
        >
          Explore Partners
        </button>
      </div>
    );
  }

  const cleanWhatsApp = (num) => {
    if (!num) return '';
    const digits = num.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const cleanInstagram = (handle) => {
    if (!handle) return '';
    return handle.replace('@', '').trim();
  };

  const whatsappLink = lastConnectedPartner.whatsapp
    ? `https://wa.me/${cleanWhatsApp(lastConnectedPartner.whatsapp)}?text=${encodeURIComponent(
        `Hi ${lastConnectedPartner.naam}! We matched on DandiyaMatch 🎊 Chalo Garbe Ghumiye!`
      )}`
    : null;

  const instagramLink = lastConnectedPartner.instagram
    ? `https://instagram.com/${cleanInstagram(lastConnectedPartner.instagram)}`
    : null;

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between px-5 pt-3 pb-6 overflow-y-auto overflow-x-hidden select-none">
      {/* Shower of Confetti */}
      <Confetti active={true} />

      {/* Screen-filling Gold Spark Explosion */}
      <SparkEffect trigger={sparkTrigger} count={32} size="lg" />

      {/* Background festive aura */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* TOP HEADER WITH EXPLICIT BACK & CLOSE BUTTONS */}
      <header className="relative z-30 flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            findNextMatch(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Back to Matching"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A0A0A]/90 border border-[#3D151C] hover:border-gold/50 text-gold hover:text-white transition-all cursor-pointer active:scale-95 shadow-md text-xs font-semibold touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary text-gold text-xs font-bold uppercase tracking-wider shadow-glow-primary"
        >
          <span className="w-2 h-2 rounded-full bg-gold inline-block animate-pulse" />
          <span>Garba Jodi Locked 🪔</span>
        </motion.div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            findNextMatch(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Close"
          className="w-9 h-9 rounded-full bg-[#1A0A0A]/90 border border-[#3D151C] hover:border-gold/50 flex items-center justify-center text-text-muted hover:text-white transition-all cursor-pointer active:scale-95 shadow-md touch-manipulation"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* TITLE */}
      <div className="relative z-20 text-center mt-3">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-3xl sm:text-4xl font-heading font-extrabold text-gold-gradient tracking-tight"
        >
          {t.youConnected}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-text-muted mt-1 max-w-xs mx-auto"
        >
          {t.connectSub}
        </motion.p>
      </div>

      {/* CENTER: TWO DANDIYA STICKS ANIMATING IN FROM SIDES AND TAPPING */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-3">
        <div className="relative w-56 h-36 flex items-center justify-center">
          {/* Left stick flies in */}
          <motion.div
            initial={{ x: -140, rotate: -60, opacity: 0 }}
            animate={{ x: -6, rotate: -18, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
            className="absolute origin-bottom"
          >
            <div className="w-3.5 h-32 rounded-full bg-gradient-to-t from-sindoor via-primary to-gold border border-gold shadow-glow-primary relative">
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-2 left-1" />
            </div>
          </motion.div>

          {/* Right stick flies in */}
          <motion.div
            initial={{ x: 140, rotate: 60, opacity: 0 }}
            animate={{ x: 6, rotate: 18, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
            className="absolute origin-bottom"
          >
            <div className="w-3.5 h-32 rounded-full bg-gradient-to-t from-sindoor via-primary to-gold border border-gold shadow-glow-primary relative">
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-2 left-1" />
            </div>
          </motion.div>

          {/* Partner Photo Badge in Center */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.35 }}
            className="relative z-10 w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary via-gold to-marigold shadow-glow-gold overflow-hidden"
          >
            <img
              src={lastConnectedPartner.photo_url}
              alt={lastConnectedPartner.naam}
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-center mt-1"
        >
          <h3 className="text-xl font-heading font-bold text-[#FFF5E4]">
            {lastConnectedPartner.naam}
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            {lastConnectedPartner.city} • {lastConnectedPartner.vibe} Vibe
          </p>
        </motion.div>
      </div>

      {/* BOTTOM CONTACT & NAVIGATION SECTION */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.5 }}
        className="relative z-20 space-y-2.5 pt-2"
      >
        {/* BIG PRIMARY IN-APP CHAT BUTTON */}
        <button
          type="button"
          onClick={() => openChat(lastConnectedPartner)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF4D00] via-[#FF6A00] to-[#E0A96D] text-white font-heading font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-glow-primary hover:opacity-95 active:scale-[0.98] transition-transform duration-75 cursor-pointer touch-manipulation"
        >
          <MessageCircle className="w-5 h-5 fill-white/20" />
          <span>Chat with {lastConnectedPartner.naam.split(' ')[0]} Now 💬</span>
        </button>

        {/* Optional Secondary Socials (Compact Row) */}
        {(whatsappLink || instagramLink) && (
          <div className="flex items-center gap-2 pt-0.5">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptic.light()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1A0A0A] hover:bg-[#20ba5a]/20 border border-[#25D366]/40 text-[#25D366] font-semibold py-2.5 px-3 rounded-xl transition-all active:scale-95 cursor-pointer text-xs touch-manipulation"
              >
                <Phone className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            )}

            {instagramLink && (
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptic.light()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1A0A0A] hover:bg-[#FD1D1D]/20 border border-[#FD1D1D]/40 text-[#FD1D1D] font-semibold py-2.5 px-3 rounded-xl transition-all active:scale-95 cursor-pointer text-xs touch-manipulation"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            )}
          </div>
        )}

        {/* Find Another Partner Button */}
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<ArrowRight className="w-4 h-4 text-gold" />}
          onClick={() => findNextMatch(false)}
          className="border-gold/30 text-gold hover:text-white font-bold text-sm active:scale-95 cursor-pointer mt-1"
        >
          {t.findAnother} →
        </Button>

        {/* Share Card Link */}
        <button
          type="button"
          onClick={() => setScreen('shareCard')}
          className="w-full text-center text-xs font-semibold text-gold/80 hover:text-gold pt-1 transition-colors cursor-pointer touch-manipulation active:scale-95"
        >
          {t.shareMyCard}
        </button>
      </motion.div>
    </div>
  );
}
