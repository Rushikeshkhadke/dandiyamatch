# 🪔 DandiyaMatch — Raat Ka Mela, Phone Mein

> A premium, mobile-first Web App (PWA) to find your Dandiya & Garba dance partner during Navratri. Built with React, Tailwind CSS, Framer Motion, and Supabase.

---

## 🌟 Key Features

1. **Rhythmic Loading & Tap Sound (Screen 1)**
   - Custom SVG Dandiya sticks rhythmically clacking with gold sparks and Web Audio API synthesized wooden percussion sound.
   
2. **Geometric Rangoli Draw Reveal (Screen 2)**
   - Intricate SVG mandala that draws itself stroke-by-stroke with gold floating dust and electric orange CTA glow.

3. **Custom Styled Authentication (Screen 3)**
   - Dark festive Google OAuth integration + Instant Festive Demo login for immediate preview.

4. **Typeform-Style 1-Field-At-A-Time Onboarding (Screen 4)**
   - 8 step questions with smooth slide transitions.
   - **Event Pin with Smart Autocomplete & Priority Matching**: Search popular festive grounds (United Way of Baroda, Dome Dandiya Mumbai, Shankus Ahmedabad, etc.).
   - Circular photo upload with marigold floral border + festive avatar picker.

5. **Suspense Matching Screen (Screen 5)**
   - 2.2-second suspense with dandiya strike loading and subtle orange screen flash when partner is located.

6. **Immersive Match Card (Screen 6)**
   - Edge-to-edge photo, gold typography, city, dancing level, vibe chips, and priority event badges.
   - Smooth swipe gestures: Swipe Right to **Connect**, Swipe Left to **Pass**.
   - Discreet report mechanism for community safety.

7. **Explosive Celebration & Contact Reveal (Screen 7)**
   - Dual dandiya sticks fly in from edges and strike with a gold spark burst.
   - Multi-stage confetti explosion with haptic vibrations (`navigator.vibrate([100, 50, 100])`).
   - Direct WhatsApp & Instagram chat buttons.

8. **Festive Profile & Status Control (Screen 8)**
   - Pulsing marigold avatar ring.
   - Prominent **"Already Have Partner"** toggle to hide profile once paired up.
   - Editable fields and real-time synchronization.

9. **Drooping Dandiya "No More Matches" (Screen 9)**
   - Animated sad dandiya sticks with 1-tap viral WhatsApp sharing.

10. **Festive Share Card with QR Code (Screen 10)**
    - High-res shareable image card with QR code pointing to profile.
    - One-click image download via `html2canvas` and WhatsApp share.

11. **Tri-Lingual Localization (i18n)**
    - Instant switching between **English (EN)**, **Hindi (HI)**, and **Gujarati (GU)**.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev
```

Visit `http://localhost:5173` in your browser. Use Mobile View (Chrome DevTools Device Mode) for the ultimate 60fps mobile experience!

---

## ⚡ Supabase Setup (Production & Database)

DandiyaMatch has a complete Supabase schema with Row Level Security (RLS) policies ready.

### 1. Run Schema Migration
Open your [Supabase Dashboard](https://app.supabase.com) > **SQL Editor** and paste the contents of:
`supabase/schema.sql`

This creates:
- `users` table with event_pin, vibe, dancing_level, and contact handles
- `passes` table (tracks skipped partners)
- `connects` table (tracks mutual connections)
- `reports` table (community moderation)
- Optimized PostgreSQL indexes on `city`, `event_pin`, and `has_partner`

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_APP_URL=https://dandiyamatch.com
```

### 3. Google OAuth Setup (Optional)
In Supabase Dashboard > **Authentication** > **Providers** > **Google**:
- Enable Google OAuth
- Add Client ID and Client Secret from Google Cloud Console.

*(Note: If Supabase keys are not set, DandiyaMatch automatically activates its built-in Festive Demo Mode with pre-populated Gujarati and Indian garba profiles so you can explore all features right away!)*

---

## 🎨 Design System

- **Background:** `#0D0208` (Darkest maroon / pitch night)
- **Primary:** `#FF4D00` (Electric festive orange)
- **Accent:** `#FFD700` (Polished gold)
- **Cards:** `#1A0A0A` (Deep maroon)
- **Text:** `#FFF5E4` (Warm white)
- **Muted:** `#8B6F5E`
- **Headings:** Playfair Display
- **Body:** Inter
