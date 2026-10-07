import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ArrowLeft, Zap } from 'lucide-react';

export default function LoginPage() {
  const { setScreen, language, setUser, findNextMatch } = useStore();
  const t = getTranslation(language);
  const [loading, setLoading] = useState(false);

  // Real Supabase Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.warn('OAuth failed, falling back to festive session:', err);
        createDemoSession();
      }
    } else {
      createDemoSession();
    }
  };

  const createDemoSession = () => {
    // Generate valid UUID for demo session so it works with PostgreSQL & offline
    const demoId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-4000-8000-000000000001';

    // Ready-to-go festive demo user
    const demoUser = {
      id: demoId,
      naam: 'Aarav Patel',
      gender: 'Male',
      city: 'Ahmedabad',
      age_group: '18-25',
      dancing_level: 'Intermediate',
      vibe: 'Energetic',
      whatsapp: '9876543210',
      instagram: 'aarav_garba',
      photo_url:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      event_pin: 'Shankus Dandiya Fest',
      has_partner: false,
      is_demo: true,
      language,
      created_at: new Date().toISOString(),
    };
    setUser(demoUser);
    // Take user to the festive Discovery Hub to connect emotions before swiping
    setScreen('discovery');
  };

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between px-6 py-6 overflow-y-auto select-none">
      {/* Very faint static rangoli pattern background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex items-center justify-center">
        <svg width="600" height="600" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#FFD700" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="130" stroke="#FF4D00" strokeWidth="1" />
          <circle cx="200" cy="200" r="80" stroke="#FFD700" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
            <g key={d} transform={`rotate(${d} 200 200)`}>
              <path d="M 200 40 L 220 90 L 200 140 L 180 90 Z" stroke="#FFD700" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>

      {/* Top back navigation */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setScreen('landing')}
          className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#3D151C] flex items-center justify-center text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-gold uppercase">
          Step 1 of 2 • Sign In
        </span>
        <div className="w-10" />
      </div>

      {/* Center: Crossed Dandiya Gold SVG Logo Mark */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-36 h-36 flex items-center justify-center mb-6"
        >
          {/* Subtle gold glow behind mark */}
          <div className="absolute inset-0 bg-gold/15 rounded-full blur-2xl" />

          {/* Crossed Dandiya sticks SVG */}
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            {/* Stick 1 */}
            <line
              x1="22"
              y1="18"
              x2="78"
              y2="82"
              stroke="#FFD700"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Stick 1 bands */}
            <circle cx="36" cy="34" r="3.5" fill="#FF4D00" />
            <circle cx="50" cy="50" r="3" fill="#FFF5E4" />
            <circle cx="64" cy="66" r="3.5" fill="#FF4D00" />

            {/* Stick 2 */}
            <line
              x1="78"
              y1="18"
              x2="22"
              y2="82"
              stroke="#FFE566"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Stick 2 bands */}
            <circle cx="64" cy="34" r="3.5" fill="#FF4D00" />
            <circle cx="36" cy="66" r="3.5" fill="#FF4D00" />

            {/* Central Spark */}
            <circle cx="50" cy="50" r="4.5" fill="#FFF" />
          </svg>
        </motion.div>

        <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] tracking-tight">
          DandiyaMatch
        </h2>
        <p className="text-sm text-text-muted mt-2 max-w-xs leading-relaxed">
          {t.googleSub}
        </p>
      </div>

      {/* Bottom Login Buttons */}
      <div className="relative z-10 flex flex-col gap-3 pb-2 shrink-0">
        {/* Custom styled Continue with Google button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3.5 bg-[#1A0A0A] hover:bg-[#250E13] text-[#FFF5E4] font-medium py-4 px-6 rounded-2xl border border-[#3D151C] hover:border-gold/40 shadow-card-deep active:scale-[0.98] transition-transform duration-75 cursor-pointer touch-manipulation"
        >
          {/* Custom Google 'G' icon */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
            />
          </svg>
          <span className="text-base font-semibold">{t.continueWithGoogle}</span>
        </button>

        {/* Quick Festive Demo Login */}
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<Zap className="w-4 h-4 text-gold" />}
          onClick={createDemoSession}
          className="border-[#FFD700]/30 text-gold hover:text-white"
        >
          {t.quickDemoLogin}
        </Button>

        <p className="text-center text-[11px] text-text-muted mt-2">
          By signing in, you agree to festive safety & mutual respect guidelines.
        </p>
      </div>
    </div>
  );
}
