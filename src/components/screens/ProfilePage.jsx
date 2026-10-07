import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import { getTranslation } from '../../i18n';
import { haptic } from '../../lib/haptics';
import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  MapPin,
  Calendar,
  Heart,
  Music,
  Phone,
  LogOut,
  Check,
  Zap,
  Camera,
  Users,
} from 'lucide-react';
import InstagramIcon from '../ui/InstagramIcon';
import { POPULAR_CITIES } from '../../lib/mockData';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
];

export default function ProfilePage() {
  const {
    user,
    updateUser,
    language,
    setLanguage,
    logout,
    setScreen,
    currentMatch,
    findNextMatch,
  } = useStore();

  const t = getTranslation(language);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    naam: user?.naam || '',
    gender: user?.gender || 'Male',
    city: user?.city || '',
    dancing_level: user?.dancing_level || 'Intermediate',
    vibe: user?.vibe || 'Energetic',
    event_pin: user?.event_pin || '',
    whatsapp: user?.whatsapp || '',
    instagram: user?.instagram || '',
    photo_url: user?.photo_url || '',
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setEditData((prev) => ({ ...prev, photo_url: result }));
        haptic.light();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    haptic.medium();
    await updateUser(editData);
    setIsEditing(false);
  };

  const handleTogglePartner = async (checked) => {
    haptic.light();
    await updateUser({ has_partner: checked });
  };

  if (!user) {
    return <div className="relative h-full w-full bg-[#0D0208]" />;
  }

  return (
    <div className="relative h-full w-full bg-[#0D0208] flex flex-col justify-between px-6 py-6 overflow-y-auto select-none">
      {/* Top Bar: Back Button, Title, Language, and Edit Profile Button */}
      <header className="relative z-20 flex items-center justify-between mb-6 shrink-0">
        <button
          type="button"
          onClick={() => setScreen('discovery')}
          aria-label="Back to Hub"
          className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#3D151C] hover:border-gold/50 flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-heading font-bold text-lg text-gold-gradient tracking-tight">
          {t.myProfile}
        </span>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-[#1A0A0A] border border-[#3D151C] rounded-full p-0.5 text-[11px] font-medium">
            {['en', 'hi', 'gu'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`px-2 py-1 rounded-full uppercase transition-all ${
                  language === l
                    ? 'bg-primary text-white font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Logout / Switch Account button */}
          <button
            type="button"
            onClick={logout}
            title={user?.is_demo ? 'Sign In with Real Account' : 'Logout'}
            aria-label="Logout"
            className="w-9 h-9 rounded-full bg-[#1A0A0A] border border-[#3D151C] hover:border-red-400/50 flex items-center justify-center text-text-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Edit / Save Button */}
          <button
            type="button"
            onClick={() => {
              if (isEditing) handleSave();
              else {
                setEditData({
                  naam: user?.naam || '',
                  gender: user?.gender || 'Male',
                  city: user?.city || '',
                  dancing_level: user?.dancing_level || 'Intermediate',
                  vibe: user?.vibe || 'Energetic',
                  event_pin: user?.event_pin || '',
                  whatsapp: user?.whatsapp || '',
                  instagram: user?.instagram || '',
                  photo_url: user?.photo_url || '',
                });
                setIsEditing(true);
              }
            }}
            className="w-9 h-9 rounded-full bg-[#1A0A0A] border border-gold/40 flex items-center justify-center text-gold hover:border-gold transition-colors"
          >
            {isEditing ? <Check className="w-4 h-4 text-primary" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Profile Info */}
      <div className="relative z-10 flex-1 space-y-5">
        {/* Notice for Demo User */}
        {user?.is_demo && (
          <div className="bg-gradient-to-r from-primary/20 via-marigold/10 to-primary/20 border border-primary/40 rounded-2xl p-3.5 flex items-center justify-between shadow-glow-primary">
            <div>
              <div className="text-xs font-bold text-gold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Demo Account Active</span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Switch to real account to match real dancers
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-[#FFF5E4] font-bold text-xs hover:bg-primary-hover transition-colors shadow-glow-primary cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
          </div>
        )}
        {/* Photo with Elegant Dual-Ring Gold Festive Border */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {/* Elegant Royal Gold Border */}
            <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#FFD700] via-[#FF7A00] to-[#E63946] shadow-[0_0_24px_rgba(255,122,0,0.35)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#1A0A0A] border-2 border-[#0D0208] flex items-center justify-center">
                <img
                  src={
                    (isEditing ? editData.photo_url : user?.photo_url) ||
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={user?.naam}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Camera Change Icon when in Edit Mode */}
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center cursor-pointer shadow-lg border-2 border-[#0D0208] transition-transform active:scale-90">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Quick preset selector in Edit Mode */}
          {isEditing && (
            <div className="mt-3 w-full">
              <span className="text-[11px] text-text-muted mb-1.5 block">Or select an avatar:</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEditData((p) => ({ ...p, photo_url: url }));
                      haptic.light();
                    }}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                      editData.photo_url === url
                        ? 'border-gold scale-110 shadow-glow-gold'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name Display / Edit */}
          {isEditing ? (
            <div className="w-full mt-4 max-w-xs">
              <label className="text-[11px] font-semibold text-text-muted mb-1 block">Full Name</label>
              <input
                type="text"
                value={editData.naam}
                onChange={(e) => setEditData({ ...editData, naam: e.target.value })}
                className="w-full bg-[#1A0A0A] border border-primary text-xl font-heading font-bold text-center text-gold rounded-xl py-2 px-4 outline-none"
              />
            </div>
          ) : (
            <h2 className="text-3xl font-heading font-extrabold text-gold-gradient mt-4 tracking-tight text-center">
              {user?.naam || 'Garba Enthusiast'}
            </h2>
          )}

          <p className="text-xs text-text-muted mt-1 font-medium tracking-wide text-center">
            {user?.gender === 'Female' ? 'Female' : 'Male'} • {user?.dancing_level || 'Intermediate'} Dancer • {user?.age_group || '18-25'} yrs
          </p>
        </div>

        {/* ALREADY HAVE PARTNER TOGGLE — PROMINENT */}
        <div className="bg-[#1A0A0A] p-2 rounded-3xl border border-gold/30 shadow-card-deep">
          <Toggle
            checked={!!user?.has_partner}
            onChange={handleTogglePartner}
            label={t.alreadyHavePartner}
            description={t.partnerFoundInfo}
            icon={<Heart className="w-5 h-5 text-primary" />}
          />
        </div>

        {/* DETAILS CARDS WITH FESTIVE ICONS & PROPER ALIGNMENT */}
        <div className="grid grid-cols-2 gap-3">
          {/* Gender */}
          <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
              <Users className="w-4 h-4 text-gold" />
              <span>Gender</span>
            </div>
            {isEditing ? (
              <div className="flex gap-1.5 mt-1">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setEditData({ ...editData, gender: g })}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      editData.gender === g
                        ? 'bg-primary border-primary text-white'
                        : 'bg-[#250E13] border-[#3D151C] text-text-muted'
                    }`}
                  >
                    {g === 'Male' ? '🕺 Male' : '💃 Female'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-base font-semibold text-[#FFF5E4]">
                {user?.gender === 'Female' ? 'Female (Girl)' : 'Male (Boy)'}
              </div>
            )}
          </div>

          {/* City */}
          <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
              <MapPin className="w-4 h-4 text-gold" />
              <span>City</span>
            </div>
            {isEditing ? (
              <select
                value={editData.city}
                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                className="w-full bg-[#250E13] text-xs text-[#FFF5E4] rounded-lg p-2 outline-none border border-[#3D151C] cursor-pointer"
              >
                {[...new Set([editData.city, ...POPULAR_CITIES])].filter(Boolean).map((c) => (
                  <option key={c} value={c} className="bg-[#1A0A0A] text-[#FFF5E4]">
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-base font-semibold text-[#FFF5E4]">
                {user?.city || 'Not set'}
              </div>
            )}
          </div>

          {/* Dancing Level */}
          <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span>Level</span>
            </div>
            {isEditing ? (
              <select
                value={editData.dancing_level}
                onChange={(e) => setEditData({ ...editData, dancing_level: e.target.value })}
                className="w-full bg-[#250E13] text-xs text-[#FFF5E4] rounded-lg p-2 outline-none border border-[#3D151C] cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Pro">Pro Dancer</option>
              </select>
            ) : (
              <div className="text-base font-semibold text-[#FFF5E4]">
                {user?.dancing_level || 'Intermediate'}
              </div>
            )}
          </div>

          {/* Vibe */}
          <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
              <Music className="w-4 h-4 text-marigold" />
              <span>Vibe</span>
            </div>
            {isEditing ? (
              <select
                value={editData.vibe}
                onChange={(e) => setEditData({ ...editData, vibe: e.target.value })}
                className="w-full bg-[#250E13] text-xs text-[#FFF5E4] rounded-lg p-2 outline-none border border-[#3D151C] cursor-pointer"
              >
                <option value="Energetic">Energetic</option>
                <option value="Chill">Chill</option>
                <option value="Traditional">Traditional</option>
              </select>
            ) : (
              <div className="text-base font-semibold text-[#FFF5E4]">
                {user?.vibe || 'Energetic'}
              </div>
            )}
          </div>
        </div>

        {/* Contact info card */}
        <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C]">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-2">
            <Phone className="w-4 h-4 text-green-400" />
            <span>Contact Information</span>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="tel"
                value={editData.whatsapp}
                onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value })}
                placeholder="WhatsApp Number"
                className="w-full bg-[#250E13] text-xs text-[#FFF5E4] rounded-lg p-2 outline-none border border-[#3D151C]"
              />
              <input
                type="text"
                value={editData.instagram}
                onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                placeholder="Instagram Handle (@...)"
                className="w-full bg-[#250E13] text-xs text-[#FFF5E4] rounded-lg p-2 outline-none border border-[#3D151C]"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1 text-xs text-[#FFF5E4]">
              <div className="flex items-center gap-2">
                <span className="text-green-400">WhatsApp:</span>
                <span className="font-mono">{user?.whatsapp ? `+91 ${user.whatsapp}` : 'Not added'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400">Instagram:</span>
                <span>{user?.instagram ? `@${user.instagram}` : 'Not added'}</span>
              </div>
            </div>
          )}
        </div>

        {/* EVENT PIN CARD */}
        <div className="bg-[#1A0A0A] p-4 rounded-2xl border border-[#3D151C]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold">
              <Calendar className="w-4 h-4" />
              <span>Event Pin</span>
            </div>
            <span className="text-[10px] text-text-muted">High Priority Match</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editData.event_pin}
              onChange={(e) => setEditData({ ...editData, event_pin: e.target.value })}
              placeholder="e.g. United Way of Baroda"
              className="w-full bg-[#250E13] text-sm text-[#FFF5E4] rounded-lg p-2 outline-none border border-[#3D151C]"
            />
          ) : (
            <div className="text-sm font-semibold text-[#FFF5E4]">
              {user?.event_pin || 'No specific event pinned yet'}
            </div>
          )}
        </div>

        {/* Save button if editing, or Start Finding Partner */}
        {isEditing ? (
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSave}
            className="glow-orange font-bold tracking-wide"
          >
            Save Profile Changes
          </Button>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (!currentMatch) {
                  findNextMatch(false);
                }
                setScreen('matchCard');
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF4D00] via-[#FF6A00] to-[#E0A96D] text-white font-heading font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-glow-primary hover:opacity-95 active:scale-[0.98] transition-transform duration-75 cursor-pointer touch-manipulation"
            >
              <span>Start Swiping</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <button
              type="button"
              onClick={() => setScreen('shareCard')}
              className="w-full py-2.5 text-center text-xs font-semibold text-gold/80 hover:text-gold transition-colors cursor-pointer touch-manipulation active:scale-95"
            >
              {t.shareMyCard}
            </button>
          </div>
        )}
      </div>

      {/* Logout button at bottom */}
      <footer className="relative z-20 pt-6">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-xs text-text-muted hover:text-red-400 py-3 transition-colors cursor-pointer touch-manipulation active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </footer>
    </div>
  );
}
