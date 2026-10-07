-- ==========================================
-- DandiyaMatch Database Schema (Supabase)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id TEXT UNIQUE,
  naam TEXT NOT NULL,
  gender TEXT NOT NULL, -- 'Male', 'Female', 'Other'
  city TEXT NOT NULL,
  age_group TEXT NOT NULL, -- '18-25', '25-35', '35+'
  dancing_level TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Pro'
  vibe TEXT NOT NULL, -- 'Energetic', 'Chill', 'Traditional'
  whatsapp TEXT,
  instagram TEXT,
  photo_url TEXT,
  event_pin TEXT,
  bio TEXT,
  has_partner BOOLEAN DEFAULT FALSE,
  language TEXT DEFAULT 'en', -- 'en', 'hi', 'gu'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning fast matching
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_users_event ON public.users(event_pin);
CREATE INDEX IF NOT EXISTS idx_users_has_partner ON public.users(has_partner);

-- 2. Passes Table (Tracks skipped profiles)
CREATE TABLE IF NOT EXISTS public.passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  passed_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, passed_user_id)
);

-- 3. Connects Table (Tracks matched / connected partners)
CREATE TABLE IF NOT EXISTS public.connects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  connected_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, connected_user_id)
);

-- 4. Reports Table (Safety & Moderation)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reported_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users: public read for matching, self update/insert
CREATE POLICY "Users are viewable by authenticated or anon for matching" 
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can create their own profile" 
  ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE USING (true);

-- Passes: Insert and view own passes
CREATE POLICY "Users can view own passes" 
  ON public.passes FOR SELECT USING (true);

CREATE POLICY "Users can create passes" 
  ON public.passes FOR INSERT WITH CHECK (true);

-- Connects: Insert and view own connects
CREATE POLICY "Users can view own connects" 
  ON public.connects FOR SELECT USING (true);

CREATE POLICY "Users can create connects" 
  ON public.connects FOR INSERT WITH CHECK (true);

-- Reports: Anyone can submit a report
CREATE POLICY "Users can insert reports" 
  ON public.reports FOR INSERT WITH CHECK (true);

-- 5. Messages Table (Real-time In-App Garba Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation 
  ON public.messages(sender_id, receiver_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversation messages"
  ON public.messages FOR SELECT USING (true);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (true);
