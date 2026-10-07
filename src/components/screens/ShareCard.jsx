import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { haptic } from '../../lib/haptics';
import { ArrowLeft, Download, Share2, Music, MapPin, Zap } from 'lucide-react';

export default function ShareCard() {
  const { user, language, setScreen } = useStore();
  const t = getTranslation(language);
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?partner=${encodeURIComponent(user?.naam || 'dandiya')}`
    : 'https://dandiyamatch.com';

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      haptic.medium();
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0D0208',
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `DandiyaMatch-${user?.naam || 'Festive'}.png`;
      a.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    haptic.light();
    const message = `Check out my DandiyaMatch profile for Navratri! Looking for a partner in ${
      user?.city || 'the city'
    }! 🎊 Let's dance: ${profileUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between px-6 py-5 overflow-y-auto select-none">
      {/* Top Bar */}
      <header className="relative z-20 flex items-center justify-between mb-4 shrink-0">
        <button
          type="button"
          onClick={() => setScreen('profile')}
          className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#3D151C] flex items-center justify-center text-text-muted hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-heading font-bold text-base text-gold-gradient">
          Festive Share Card
        </span>

        <div className="w-10" />
      </header>

      {/* THE SHAREABLE CARD */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div
          ref={cardRef}
          className="relative w-full max-w-[340px] rounded-3xl p-6 bg-[#1A0A0A] border-2 border-gold/40 shadow-glow-gold flex flex-col items-center text-center overflow-hidden"
        >
          {/* Background Rangoli Watermark */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <svg width="340" height="340" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="60" stroke="#FF4D00" strokeWidth="1.5" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="190"
                  stroke="#FFD700"
                  strokeWidth="0.7"
                  transform={`rotate(${a} 100 100)`}
                />
              ))}
            </svg>
          </div>

          {/* Top Brand Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-[10px] font-bold text-gold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            <span>DandiyaMatch • Navratri 2026</span>
          </div>

          {/* Photo with Marigold ring */}
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-marigold via-primary to-gold shadow-glow-gold mb-3">
            <img
              src={
                user?.photo_url ||
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
              }
              alt={user?.naam}
              className="w-full h-full rounded-full object-cover"
              crossOrigin="anonymous"
            />
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-heading font-extrabold text-gold tracking-tight">
            {user?.naam || 'Garba Enthusiast'}
          </h2>

          {/* City & Vibe Chips */}
          <div className="flex items-center justify-center gap-2 mt-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2A0D14] border border-[#3D151C] text-[11px] font-medium text-[#FFF5E4]">
              <MapPin className="w-3 h-3 text-gold" />
              {user?.city || 'Ahmedabad'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2A0D14] border border-[#3D151C] text-[11px] font-medium text-[#FFF5E4]">
              <Zap className="w-3 h-3 text-primary" />
              {user?.dancing_level || 'Intermediate'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2A0D14] border border-[#3D151C] text-[11px] font-medium text-[#FFF5E4]">
              <Music className="w-3 h-3 text-marigold" />
              {user?.vibe || 'Energetic'}
            </span>
          </div>

          {/* Event Pin if set */}
          {user?.event_pin && (
            <div className="mb-4 text-xs font-semibold text-primary bg-[#250E13] px-3 py-1 rounded-xl border border-primary/30">
              🎪 {user.event_pin}
            </div>
          )}

          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl shadow-xl mb-3">
            <QRCodeSVG
              value={profileUrl}
              size={120}
              bgColor="#FFFFFF"
              fgColor="#0D0208"
              level="M"
            />
          </div>

          {/* Scan callout */}
          <p className="text-xs font-semibold text-[#FFF5E4]/90 tracking-wide">
            {t.scanAndDance}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-20 space-y-3 pt-3">
        {/* Download Button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={downloading}
          icon={<Download className="w-4 h-4" />}
          onClick={handleDownload}
          className="glow-orange font-bold"
        >
          {downloading ? 'Generating Image...' : t.downloadCard}
        </Button>

        {/* WhatsApp Share Button */}
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<Share2 className="w-4 h-4 text-green-400" />}
          onClick={handleShareWhatsApp}
          className="border-[#25D366]/40 text-green-400"
        >
          {t.shareWhatsApp}
        </Button>
      </div>
    </div>
  );
}
