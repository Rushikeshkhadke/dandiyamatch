import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { haptic } from '../../lib/haptics';
import { sounds } from '../../lib/sound';
import InstagramIcon from '../ui/InstagramIcon';
import {
  ArrowLeft,
  Send,
  Sparkles,
  MapPin,
  Zap,
  Flame,
  Sprout,
  CheckCheck,
  Phone,
} from 'lucide-react';

const ICEBREAKERS = [
  'Chalo Garbe Ghumiye! 🎊',
  '📸 Insta handle share karein?',
  '📱 WhatsApp number exchange karein?',
  'Konsa pass hai aapke paas? 🎟️',
  'Matching outfit color decide karein? 🥻',
  '2-taali ya 3-taali step? 💃',
  'Entry gate pe kab milenge? ⏰',
];

const renderFormattedContent = (text, isMe) => {
  if (!text) return null;

  // Matches URLs, @handles, and 10 or 12 digit phone numbers
  const regex = /(https?:\/\/[^\s]+|@[a-zA-Z0-9_.]+|\+?91[\s-]?[6-9]\d{9}|[6-9]\d{9})/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptic.light()}
          className="underline text-blue-300 hover:text-blue-100 break-all inline"
        >
          {part}
        </a>
      );
    }

    if (part.startsWith('@') && part.length > 1) {
      const handle = part.slice(1);
      return (
        <a
          key={index}
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptic.light()}
          className={`inline-flex items-center gap-1 font-bold underline px-1.5 py-0.5 rounded text-[11px] sm:text-xs my-0.5 transition-colors ${
            isMe
              ? 'bg-black/30 text-yellow-200 decoration-yellow-300/60 hover:text-white'
              : 'bg-gold/15 text-gold decoration-gold/60 hover:text-marigold'
          }`}
        >
          <InstagramIcon className="w-3 h-3 inline-block" />
          <span>{part}</span>
        </a>
      );
    }

    const cleanDigits = part.replace(/\D/g, '');
    const isTenDigit = cleanDigits.length === 10 && /^[6-9]/.test(cleanDigits);
    const isTwelveDigit = cleanDigits.length === 12 && cleanDigits.startsWith('91');
    if (isTenDigit || isTwelveDigit) {
      const waNumber = isTenDigit ? `91${cleanDigits}` : cleanDigits;
      return (
        <a
          key={index}
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptic.light()}
          className={`inline-flex items-center gap-1 font-bold underline px-1.5 py-0.5 rounded text-[11px] sm:text-xs my-0.5 transition-colors ${
            isMe
              ? 'bg-black/30 text-green-200 decoration-green-300/60 hover:text-white'
              : 'bg-green-500/15 text-green-400 decoration-green-400/60 hover:text-green-300'
          }`}
        >
          <Phone className="w-3 h-3 inline-block" />
          <span>{part}</span>
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

export default function ChatScreen() {
  const {
    activeChatPartner,
    lastConnectedPartner,
    chats,
    sendMessage,
    isPartnerTyping,
    setScreen,
  } = useStore();

  const partner = activeChatPartner || lastConnectedPartner;
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const messages = partner ? chats[partner.id] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim() || !partner) return;

    sendMessage(partner.id, text);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getDancingLevelIcon = (level) => {
    if (level === 'Pro') return <Zap className="w-3 h-3 text-gold" />;
    if (level === 'Intermediate') return <Flame className="w-3 h-3 text-primary" />;
    return <Sprout className="w-3 h-3 text-green-400" />;
  };

  if (!partner) {
    return (
      <div className="relative h-full w-full bg-[#0D0208] flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-4xl mb-3">💬</span>
        <h3 className="text-lg font-heading font-bold text-gold mb-2">No active chat</h3>
        <p className="text-xs text-text-muted mb-4">Connect with a partner first to start chatting!</p>
        <button
          type="button"
          onClick={() => setScreen('discovery')}
          className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-glow-primary active:scale-95 transition-transform duration-75 cursor-pointer touch-manipulation"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between overflow-hidden select-none">
      {/* Background ambient festival aura */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-30 px-4 py-3 bg-[#14050A]/95 border-b border-[#2A0D14] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setScreen('discovery')}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-[#1A0A0A] border border-[#3D151C] hover:border-gold/50 flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-90"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Partner Avatar + Online Indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-primary via-gold to-marigold shadow-glow-gold overflow-hidden">
              <img
                src={
                  partner.photo_url ||
                  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
                }
                alt={partner.naam}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Green active status pulse */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#14050A]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading font-bold text-sm text-[#FFF5E4] truncate max-w-[150px]">
                {partner.naam}
              </h2>
              <span className="text-[10px] text-gold font-bold px-1.5 py-0.2 rounded-full bg-gold/15 border border-gold/30">
                Jodi Locked
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-gold" />
                <span>{partner.city}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-text-muted/90">
                {getDancingLevelIcon(partner.dancing_level)}
                <span>{partner.dancing_level}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions: Direct WhatsApp/Insta shortcuts + Festive Sparkle */}
        <div className="flex items-center gap-1.5">
          {partner.whatsapp && (
            <a
              href={`https://wa.me/${
                partner.whatsapp.replace(/\D/g, '').length === 10
                  ? '91' + partner.whatsapp.replace(/\D/g, '')
                  : partner.whatsapp.replace(/\D/g, '')
              }`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open WhatsApp"
              aria-label="Open WhatsApp"
              onClick={() => haptic.light()}
              className="w-8 h-8 rounded-full bg-[#1A0A0A] border border-[#25D366]/40 hover:border-[#25D366] flex items-center justify-center text-[#25D366] transition-colors cursor-pointer touch-manipulation active:scale-90"
            >
              <Phone className="w-3.5 h-3.5 fill-[#25D366]" />
            </a>
          )}

          {partner.instagram && (
            <a
              href={`https://instagram.com/${partner.instagram.replace('@', '').trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Instagram"
              aria-label="Open Instagram"
              onClick={() => haptic.light()}
              className="w-8 h-8 rounded-full bg-[#1A0A0A] border border-[#FD1D1D]/40 hover:border-[#FD1D1D] flex items-center justify-center text-[#FD1D1D] transition-colors cursor-pointer touch-manipulation active:scale-90"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              haptic.celebrate();
              sounds.playConnectSpark();
            }}
            title="Festive Dandiya Spark"
            aria-label="Festive Spark"
            className="w-8 h-8 rounded-full bg-[#1A0A0A] border border-gold/30 hover:border-gold flex items-center justify-center text-gold transition-colors cursor-pointer touch-manipulation active:scale-90"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          </button>
        </div>
      </header>

      {/* Messages Thread Area */}
      <div className="relative z-10 flex-1 px-4 py-4 overflow-y-auto space-y-3">
        {/* Date / Safety notice */}
        <div className="text-center my-1">
          <span className="inline-block px-3 py-1 rounded-full bg-[#1A0A0A] border border-[#2A0D14] text-[10px] text-text-muted uppercase tracking-wider font-semibold">
            🪔 Safe In-App Garba Chat • Navratri 2026
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender === 'user';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[84%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  isMe
                    ? 'bg-gradient-to-r from-[#FF4D00] to-[#FF7A00] text-white rounded-br-none shadow-glow-primary'
                    : 'bg-[#1A0A0A] border border-[#3D151C] text-[#FFF5E4] rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{renderFormattedContent(msg.text, isMe)}</div>
                <div
                  className={`flex items-center gap-1 text-[9px] mt-1 ${
                    isMe ? 'justify-end text-white/80' : 'justify-start text-text-muted'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-white/90" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Partner Typing Indicator */}
        <AnimatePresence>
          {isPartnerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2"
            >
              <div className="bg-[#1A0A0A] border border-[#3D151C] px-3.5 py-2 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-md">
                <span className="text-xs">🪔</span>
                <span className="text-[11px] text-text-muted font-medium">
                  {partner.naam.split(' ')[0]} is typing
                </span>
                <span className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Festive Icebreaker Chips */}
      <div className="relative z-20 px-4 pt-1 pb-2 border-t border-[#2A0D14]/80 bg-[#14050A]/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {ICEBREAKERS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip)}
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-[#1A0A0A] hover:bg-[#250E13] border border-gold/30 hover:border-gold/60 text-[#FFF5E4] active:scale-95 transition-transform duration-75 cursor-pointer touch-manipulation whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Message Input Bar */}
      <footer className="relative z-30 px-4 py-3 bg-[#14050A] border-t border-[#2A0D14] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${partner.naam.split(' ')[0]}...`}
          className="flex-1 bg-[#1A0A0A] border border-[#3D151C] focus:border-gold/60 text-xs sm:text-sm text-[#FFF5E4] rounded-2xl py-3 px-4 outline-none placeholder:text-text-muted/50 transition-colors"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          aria-label="Send message"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-75 cursor-pointer touch-manipulation ${
            inputText.trim()
              ? 'bg-gradient-to-r from-primary to-marigold text-white shadow-glow-primary active:scale-90'
              : 'bg-[#1A0A0A] border border-[#3D151C] text-text-muted/40 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </footer>
    </div>
  );
}
