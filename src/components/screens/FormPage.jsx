import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';
import PillSelector from '../ui/PillSelector';
import Button from '../ui/Button';
import DandiyaTap from '../animations/DandiyaTap';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { POPULAR_CITIES, POPULAR_EVENTS } from '../../lib/mockData';
import { haptic } from '../../lib/haptics';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  MapPin,
  Calendar,
  Check,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import InstagramIcon from '../ui/InstagramIcon';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
];

export default function FormPage() {
  const { user, updateUser, language, findNextMatch, setScreen } = useStore();
  const t = getTranslation(language);

  const [step, setStep] = useState(1);
  const totalSteps = 9;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    naam: user?.naam || '',
    gender: user?.gender || 'Male',
    city: user?.city || 'Ahmedabad',
    citySearch: '',
    age_group: user?.age_group || '18-25',
    dancing_level: user?.dancing_level || 'Intermediate',
    vibe: user?.vibe || 'Energetic',
    whatsapp: user?.whatsapp || '',
    instagram: user?.instagram || '',
    photo_url: user?.photo_url || '',
    event_pin: user?.event_pin || '',
    eventSearch: '',
  });

  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const nextStep = () => {
    haptic.medium();
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    haptic.light();
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      setScreen('login');
    }
  };

  const handleSkip = () => {
    haptic.light();
    nextStep();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    haptic.celebrate();

    const finalProfile = {
      ...user,
      naam: formData.naam.trim() || 'Garba Enthusiast',
      gender: formData.gender || 'Male',
      city: formData.city || 'Ahmedabad',
      age_group: formData.age_group || '18-25',
      dancing_level: formData.dancing_level || 'Intermediate',
      vibe: formData.vibe || 'Energetic',
      whatsapp: formData.whatsapp.trim(),
      instagram: formData.instagram.trim(),
      photo_url:
        formData.photo_url ||
        (formData.gender === 'Female' ? AVATAR_PRESETS[0] : AVATAR_PRESETS[1]),
      event_pin: formData.event_pin.trim(),
      has_partner: false,
      is_demo: Boolean(!user?.google_id && user?.is_demo),
      language,
    };

    await updateUser(finalProfile);

    setTimeout(() => {
      setIsSubmitting(false);
      setScreen('discovery');
    }, 1200);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('photo_url', event.target?.result);
        haptic.light();
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered popular cities
  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(formData.citySearch.toLowerCase())
  );

  // Filtered popular events based on city and search input
  const suggestedEvents = POPULAR_EVENTS.filter((e) => {
    return (
      formData.eventSearch.trim() === '' ||
      e.name.toLowerCase().includes(formData.eventSearch.toLowerCase()) ||
      e.venue.toLowerCase().includes(formData.eventSearch.toLowerCase())
    );
  });

  // Slide transition animation
  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
  };

  if (isSubmitting) {
    return (
      <div className="relative min-h-screen w-full bg-[#0D0208] flex flex-col items-center justify-center px-6">
        <DandiyaTap size={200} autoPlay={true} playAudio={true} />
        <h3 className="text-2xl font-heading font-bold text-gold mt-6 animate-pulse text-center">
          Creating Your Festive Profile...
        </h3>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0D0208] flex flex-col justify-between overflow-x-hidden">
      {/* Top Thin Gold Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 max-w-[480px] mx-auto">
        <ProgressBar currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Header with Back Button and Step Counter */}
      <header className="relative z-30 pt-6 px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#3D151C] flex items-center justify-center text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold tracking-widest text-gold/80 uppercase">
          {step} OF {totalSteps}
        </span>

        {/* Optional Skip button for optional steps */}
        {step === 7 || step === 8 || step === 9 ? (
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-text-muted hover:text-gold transition-colors px-2 py-1"
          >
            {t.skip}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {/* Main Question Container — Slide Left / Right */}
      <main className="flex-1 flex flex-col justify-center px-6 py-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* STEP 1: Name */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-2">👋</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#FFF5E4] leading-tight text-center">
                {t.q1}
              </h2>
              <p className="text-sm text-text-muted mt-2 mb-8 text-center">{t.q1Sub}</p>

              <div className="w-full relative">
                <input
                  type="text"
                  autoFocus
                  value={formData.naam}
                  onChange={(e) => updateField('naam', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && formData.naam.trim()) nextStep();
                  }}
                  placeholder={t.q1Placeholder}
                  className="w-full bg-[#1A0A0A] border-2 border-[#3D151C] focus:border-primary text-center text-2xl font-heading text-[#FFF5E4] rounded-2xl py-4 px-6 outline-none shadow-card-deep transition-all placeholder:text-text-muted/40 focus:shadow-glow-primary"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Gender (NEW - Ensures Opposite Matching) */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center text-center"
            >
              <div className="text-center mb-8">
                <span className="text-3xl">👥</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.qGender}
                </h2>
                <p className="text-sm text-text-muted mt-2 text-center max-w-xs mx-auto">
                  {t.qGenderSub}
                </p>
              </div>

              <PillSelector
                value={formData.gender}
                onChange={(val) => {
                  updateField('gender', val);
                  setTimeout(nextStep, 250);
                }}
                options={[
                  {
                    value: 'Male',
                    label: t.male,
                    emoji: t.maleEmoji,
                    subtitle: 'Looking for Female Dandiya Partner',
                  },
                  {
                    value: 'Female',
                    label: t.female,
                    emoji: t.femaleEmoji,
                    subtitle: 'Looking for Male Dandiya Partner',
                  },
                ]}
              />
            </motion.div>
          )}

          {/* STEP 3: City */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-3xl">🏙️</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q2}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 text-center">{t.q2Sub}</p>
              </div>

              {/* City Search Bar */}
              <div className="relative mb-4">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input
                  type="text"
                  value={formData.citySearch}
                  onChange={(e) => updateField('citySearch', e.target.value)}
                  placeholder={t.q2Placeholder}
                  className="w-full bg-[#1A0A0A] border border-[#3D151C] focus:border-gold text-sm text-[#FFF5E4] rounded-2xl py-3 pl-11 pr-4 outline-none placeholder:text-text-muted/50"
                />
              </div>

              {/* Popular City Pills */}
              <div className="grid grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {filteredCities.map((city) => {
                  const isSelected = formData.city === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        updateField('city', city);
                        haptic.light();
                      }}
                      className={`py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 border text-center ${
                        isSelected
                          ? 'bg-primary border-primary text-white shadow-glow-primary'
                          : 'bg-[#1A0A0A] border-[#3D151C] text-[#FFF5E4]/80 hover:border-gold/40'
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Age Group */}
          {step === 4 && (
            <motion.div
              key="step-4"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-8">
                <span className="text-3xl">🎂</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q3}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 text-center">{t.q3Sub}</p>
              </div>

              <PillSelector
                value={formData.age_group}
                onChange={(val) => {
                  updateField('age_group', val);
                  setTimeout(nextStep, 250);
                }}
                options={[
                  { value: '18-25', label: '18 - 25 years', emoji: '⚡', subtitle: 'College & young energetic crowd' },
                  { value: '25-35', label: '25 - 35 years', emoji: '🌟', subtitle: 'Prime festive dancers & pros' },
                  { value: '35+', label: '35+ years', emoji: '🪔', subtitle: 'Folk connoisseurs & traditional vibe' },
                ]}
              />
            </motion.div>
          )}

          {/* STEP 5: Dancing Level */}
          {step === 5 && (
            <motion.div
              key="step-5"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-8">
                <span className="text-3xl">💃</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q4}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 text-center">{t.q4Sub}</p>
              </div>

              <PillSelector
                value={formData.dancing_level}
                onChange={(val) => {
                  updateField('dancing_level', val);
                  setTimeout(nextStep, 250);
                }}
                options={[
                  {
                    value: 'Beginner',
                    label: t.beginner,
                    emoji: t.beginnerEmoji,
                    subtitle: '2-taali, basic steps, here for fun',
                  },
                  {
                    value: 'Intermediate',
                    label: t.intermediate,
                    emoji: t.intermediateEmoji,
                    subtitle: 'Dodhiya, 3-taali, can keep rhythm',
                  },
                  {
                    value: 'Pro',
                    label: t.pro,
                    emoji: t.proEmoji,
                    subtitle: 'Sanedo spins, fast rounds, non-stop stamina',
                  },
                ]}
              />
            </motion.div>
          )}

          {/* STEP 6: Vibe */}
          {step === 6 && (
            <motion.div
              key="step-6"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-8">
                <span className="text-3xl">🥁</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q5}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 text-center">{t.q5Sub}</p>
              </div>

              <PillSelector
                value={formData.vibe}
                onChange={(val) => {
                  updateField('vibe', val);
                  setTimeout(nextStep, 250);
                }}
                options={[
                  {
                    value: 'Energetic',
                    label: t.energetic,
                    emoji: t.energeticEmoji,
                    subtitle: 'High tempo, non-stop till 2 AM',
                  },
                  {
                    value: 'Chill',
                    label: t.chill,
                    emoji: t.chillEmoji,
                    subtitle: 'Relaxed rounds, food stalls, taking photos',
                  },
                  {
                    value: 'Traditional',
                    label: t.traditional,
                    emoji: t.traditionalEmoji,
                    subtitle: 'Pure Gujarati folk steps & sacred devotion',
                  },
                ]}
              />
            </motion.div>
          )}

          {/* STEP 7: Contact */}
          {step === 7 && (
            <motion.div
              key="step-7"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-3xl">📱</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q6}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 text-center">{t.q6Sub}</p>
              </div>

              <div className="space-y-4">
                {/* WhatsApp */}
                <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C] focus-within:border-green-500 transition-all">
                  <div className="flex items-center gap-2.5 mb-2 text-green-400 font-semibold text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{t.whatsappLabel}</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    placeholder={t.whatsappPlaceholder}
                    className="w-full bg-transparent text-base text-[#FFF5E4] outline-none placeholder:text-text-muted/40 font-mono"
                  />
                </div>

                {/* Instagram */}
                <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C] focus-within:border-pink-500 transition-all">
                  <div className="flex items-center gap-2.5 mb-2 text-pink-400 font-semibold text-sm">
                    <InstagramIcon className="w-4 h-4" />
                    <span>{t.instagramLabel}</span>
                  </div>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    placeholder={t.instagramPlaceholder}
                    className="w-full bg-transparent text-base text-[#FFF5E4] outline-none placeholder:text-text-muted/40"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Photo */}
          {step === 8 && (
            <motion.div
              key="step-8"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <span className="text-3xl">📸</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q7}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 text-center">{t.q7Sub}</p>
              </div>

              {/* Circular Upload with Marigold Border */}
              <div className="relative mb-6">
                <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-r from-marigold via-primary to-gold shadow-glow-gold">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1A0A0A] flex items-center justify-center relative">
                    {formData.photo_url ? (
                      <img
                        src={formData.photo_url}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-text-muted">
                        <Camera className="w-8 h-8 text-gold mb-1" />
                        <span className="text-xs">Tap to upload</span>
                      </div>
                    )}
                  </div>
                </div>

                <label className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center cursor-pointer shadow-lg border-2 border-[#0D0208] transition-transform active:scale-90">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quick Preset Avatars */}
              <div className="w-full">
                <p className="text-xs text-text-muted mb-2 text-center">Or select a festive avatar:</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateField('photo_url', url);
                        haptic.light();
                      }}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                        formData.photo_url === url
                          ? 'border-gold scale-110 shadow-glow-gold'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 9: Event Pin */}
          {step === 9 && (
            <motion.div
              key="step-9"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col"
            >
              <div className="text-center mb-6">
                <span className="text-3xl">🎪</span>
                <h2 className="text-3xl font-heading font-bold text-[#FFF5E4] mt-2 leading-tight text-center">
                  {t.q8}
                </h2>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-semibold text-primary">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                  <span>Priority Matching Active</span>
                </div>
                <p className="text-xs text-text-muted mt-1.5 text-center">{t.q8Sub}</p>
              </div>

              {/* Search or Enter Event */}
              <div className="relative mb-3">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input
                  type="text"
                  value={formData.event_pin || formData.eventSearch}
                  onChange={(e) => {
                    updateField('event_pin', e.target.value);
                    updateField('eventSearch', e.target.value);
                  }}
                  placeholder={t.q8Placeholder}
                  className="w-full bg-[#1A0A0A] border-2 border-[#3D151C] focus:border-gold text-sm text-[#FFF5E4] rounded-2xl py-3.5 pl-11 pr-4 outline-none placeholder:text-text-muted/40 shadow-card-deep"
                />
              </div>

              {/* Suggested popular grounds */}
              <div className="mt-2">
                <p className="text-xs font-semibold text-gold mb-2 flex items-center gap-1">
                  <span>{t.popularSuggested}</span>
                </p>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {suggestedEvents.slice(0, 6).map((event) => {
                    const isSelected = formData.event_pin === event.name;
                    return (
                      <button
                        key={event.name}
                        type="button"
                        onClick={() => {
                          updateField('event_pin', event.name);
                          haptic.light();
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-primary/20 border-primary text-[#FFF5E4] shadow-glow-primary'
                            : 'bg-[#1A0A0A] border-[#3D151C] text-text-muted hover:border-gold/40 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#FFF5E4]">
                            {event.name}
                          </div>
                          <div className="text-[11px] text-text-muted">
                            {event.venue} • {event.city}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation: Next / Finish Button */}
      <footer className="relative z-30 p-6 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="glow-orange font-bold text-base px-8 py-3.5"
          icon={
            step === totalSteps ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )
          }
        >
          {step === totalSteps ? t.finish : t.next}
        </Button>
      </footer>
    </div>
  );
}
