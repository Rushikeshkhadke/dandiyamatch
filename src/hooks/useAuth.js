import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const { user, setUser, logout } = useStore();

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    // Listen to Supabase auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser = session.user;
          // Check if profile exists in users table
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', authUser.id)
            .single();

          if (profile) {
            setUser({ ...profile, is_demo: false });
            useStore.getState().setScreen('discovery');
          } else {
            // Seed new profile with Google metadata
            const newProfile = {
              id: authUser.id,
              google_id: authUser.id,
              naam: authUser.user_metadata?.full_name || 'Festive Garba Lover',
              photo_url: authUser.user_metadata?.avatar_url || '',
              gender: 'Male',
              city: 'Ahmedabad',
              age_group: '18-25',
              dancing_level: 'Intermediate',
              vibe: 'Energetic',
              has_partner: false,
              is_demo: false,
              created_at: new Date().toISOString(),
            };
            setUser(newProfile);
            try {
              await supabase.from('users').upsert(newProfile);
            } catch (_) {}
            useStore.getState().setScreen('form');
          }
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [setUser, logout]);

  return {
    user,
    isAuthenticated: !!user,
    logout,
  };
}
