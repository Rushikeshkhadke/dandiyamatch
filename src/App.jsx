import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import { useAuth } from './hooks/useAuth';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Screens
import LoadingScreen from './components/screens/LoadingScreen';
import LandingPage from './components/screens/LandingPage';
import LoginPage from './components/screens/LoginPage';
import FormPage from './components/screens/FormPage';
import MatchScreen from './components/screens/MatchScreen';
import MatchCard from './components/screens/MatchCard';
import ConnectScreen from './components/screens/ConnectScreen';
import ProfilePage from './components/screens/ProfilePage';
import NoMatchScreen from './components/screens/NoMatchScreen';
import ShareCard from './components/screens/ShareCard';
import DiscoveryHub from './components/screens/DiscoveryHub';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  const { currentScreen, user, findNextMatch } = useStore();
  useAuth();

  // Sync users from Supabase if online into local store
  useEffect(() => {
    const loadUsers = async () => {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase.from('users').select('*');
          if (!error && data && data.length > 0) {
            useStore.setState({ allUsers: data });
          }
        } catch (_) {}
      }
    };
    loadUsers();
  }, []);

  // If user lands directly with matching data, kickstart match pool
  useEffect(() => {
    if (currentScreen === 'matchCard' && !useStore.getState().currentMatch) {
      findNextMatch(false);
    }
  }, [currentScreen, findNextMatch]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return <LoadingScreen key="loading" />;
      case 'landing':
        return <LandingPage key="landing" />;
      case 'login':
        return <LoginPage key="login" />;
      case 'form':
        return <FormPage key="form" />;
      case 'matching':
        return <MatchScreen key="matching" />;
      case 'matchCard':
        return <MatchCard key="matchCard" />;
      case 'connect':
        return <ConnectScreen key="connect" />;
      case 'profile':
        return <ProfilePage key="profile" />;
      case 'noMatch':
        return <NoMatchScreen key="noMatch" />;
      case 'discovery':
        return <DiscoveryHub key="discovery" />;
      case 'shareCard':
        return <ShareCard key="shareCard" />;
      default:
        return <LandingPage key="default" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070104] flex items-center justify-center relative overflow-hidden">
      {/* Ambient festival lighting background on larger screens */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gold/15 blur-[120px]" />
      </div>

      {/* Mobile-first centered app shell */}
      <div className="w-full max-w-[440px] h-[100dvh] sm:h-[844px] sm:max-h-[92vh] sm:rounded-[36px] sm:border-[4px] sm:border-[#3D151C] relative bg-[#0D0208] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="w-full h-full flex flex-col"
          >
            <ErrorBoundary onReset={() => findNextMatch(false)}>
              {renderScreen()}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
