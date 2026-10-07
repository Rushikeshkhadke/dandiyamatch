import { create } from 'zustand';
import { DUMMY_USERS } from '../lib/mockData';
import { findBestMatch, findBestMatchSync } from '../lib/matching';
import { haptic } from '../lib/haptics';
import { sounds } from '../lib/sound';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generatePartnerGarbaReply } from '../lib/chatBot';

const STORAGE_KEY_USER = 'dandiya_match_user';
const STORAGE_KEY_LANG = 'dandiya_match_lang';
const STORAGE_KEY_PASSED = 'dandiya_match_passed';
const STORAGE_KEY_CONNECTED = 'dandiya_match_connected';
const STORAGE_KEY_CHATS = 'dandiya_match_chats';

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed) {
      if (!parsed.gender) parsed.gender = 'Male';
      if (parsed.google_id) {
        parsed.is_demo = false;
      } else if (parsed.is_demo === undefined) {
        parsed.is_demo = true;
      }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(parsed));
    }
    return parsed;
  } catch (_) {
    return null;
  }
};

const getInitialLang = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_LANG) || 'en';
  } catch (_) {
    return 'en';
  }
};

const getInitialChats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHATS);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
};

export const useStore = create((set, get) => ({
  currentScreen: 'loading', // loading, landing, login, form, matching, matchCard, connect, chat, profile, noMatch, shareCard
  language: getInitialLang(),
  user: getInitialUser(),
  allUsers: getInitialUser()?.is_demo === false ? [] : DUMMY_USERS,
  passedIds: JSON.parse(localStorage.getItem(STORAGE_KEY_PASSED) || '[]'),
  connectedIds: JSON.parse(localStorage.getItem(STORAGE_KEY_CONNECTED) || '[]'),
  reportedIds: [],
  currentMatch: null,
  isEventMatch: false,
  lastConnectedPartner: null,
  isSoundMuted: false,
  chats: getInitialChats(),
  activeChatPartner: null,
  isPartnerTyping: false,

  setScreen: (screen) => {
    set({ currentScreen: screen });
  },

  setLanguage: (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (_) {}
    set({ language: lang });
    haptic.light();
  },

  setUser: (userData) => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    } catch (_) {}
    const isDemo = userData ? Boolean(userData.is_demo) : true;
    set({
      user: userData,
      allUsers: isDemo ? DUMMY_USERS : [],
    });

    // If real Google user, load real registered users from Supabase immediately
    if (userData && !isDemo && userData.google_id && isSupabaseConfigured() && supabase) {
      supabase
        .from('users')
        .select('*')
        .not('google_id', 'is', null)
        .neq('id', userData.id)
        .then(({ data, error }) => {
          if (!error && data) {
            set({ allUsers: data });
            get().findNextMatch(false);
          }
        });
    }
  },

  updateUser: async (partial) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial };
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    } catch (_) {}
    set({ user: updated });

    // Sync with Supabase if online and configured
    if (isSupabaseConfigured() && supabase && updated.id) {
      try {
        await supabase.from('users').upsert(updated);
      } catch (err) {
        console.warn('Could not sync user to Supabase:', err);
      }
    }
  },

  toggleSound: () => {
    const muted = sounds.toggleMute();
    set({ isSoundMuted: muted });
  },

  findNextMatch: (showSuspense = false) => {
    const { user, passedIds, connectedIds, allUsers } = get();
    if (!user) {
      set({ currentScreen: 'login' });
      return;
    }

    // 0ms Instant Synchronous matching
    const syncResult = findBestMatchSync({
      currentUser: user,
      passedIds,
      connectedIds,
      localPool: allUsers,
    });

    if (syncResult && syncResult.match) {
      set((state) => ({
        currentMatch: syncResult.match,
        isEventMatch: syncResult.isEventMatch,
        // Do not force navigation if user is browsing discovery or profile
        currentScreen:
          state.currentScreen === 'discovery' ||
          state.currentScreen === 'profile' ||
          state.currentScreen === 'connect'
            ? state.currentScreen
            : 'matchCard',
      }));
      haptic.medium();
    } else {
      set((state) => {
        if (
          state.currentMatch === null &&
          (state.currentScreen === 'noMatch' ||
            state.currentScreen === 'discovery' ||
            state.currentScreen === 'profile')
        ) {
          return state;
        }
        return {
          currentMatch: null,
          currentScreen:
            state.currentScreen === 'discovery' || state.currentScreen === 'profile'
              ? state.currentScreen
              : 'noMatch',
        };
      });
      haptic.soft();
    }

    // If real Google user, check Supabase in background without blocking UI
    if (user.google_id && !user.is_demo) {
      findBestMatch({
        currentUser: user,
        passedIds,
        connectedIds,
        localPool: allUsers,
      }).then((asyncResult) => {
        if (asyncResult && asyncResult.match) {
          set({
            currentMatch: asyncResult.match,
            isEventMatch: asyncResult.isEventMatch,
          });
        }
      });
    }
  },

  passCurrentMatch: () => {
    const { currentMatch, passedIds, user, allUsers, connectedIds } = get();
    if (!currentMatch) return;

    haptic.soft();
    const updatedPassed = [...passedIds, currentMatch.id];
    set({ passedIds: updatedPassed });
    try {
      localStorage.setItem(STORAGE_KEY_PASSED, JSON.stringify(updatedPassed));
    } catch (_) {}

    // Record in Supabase asynchronously
    if (isSupabaseConfigured() && supabase && user && user.google_id) {
      supabase
        .from('passes')
        .insert({
          user_id: user.id,
          passed_user_id: currentMatch.id,
        })
        .then(() => {})
        .catch(() => {});
    }

    // 0ms Instant next card calculation!
    const result = findBestMatchSync({
      currentUser: user,
      passedIds: updatedPassed,
      connectedIds,
      localPool: allUsers,
    });

    if (result && result.match) {
      set({
        currentMatch: result.match,
        isEventMatch: result.isEventMatch,
        currentScreen: 'matchCard',
      });
    } else {
      set({
        currentMatch: null,
        currentScreen: 'noMatch',
      });
      haptic.soft();
    }
  },

  connectCurrentMatch: () => {
    const { currentMatch, connectedIds, user, chats } = get();
    if (!currentMatch) return;

    const updatedConnected = [...connectedIds, currentMatch.id];
    
    // Auto-create welcoming icebreaker for this connected partner
    const existingThread = chats[currentMatch.id] || [];
    let updatedChats = chats;
    if (existingThread.length === 0) {
      const welcomeMsg = {
        id: 'welcome-' + currentMatch.id,
        sender: 'partner',
        text: `Kem Cho! 🎊 DandiyaMatch par connect karke bahut achha laga! Chalo Garba plan karte hain! 🪔✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updatedChats = {
        ...chats,
        [currentMatch.id]: [welcomeMsg],
      };
      try {
        localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(updatedChats));
      } catch (_) {}
    }

    set({
      connectedIds: updatedConnected,
      lastConnectedPartner: currentMatch,
      chats: updatedChats,
      currentScreen: 'connect',
    });

    haptic.celebrate();
    sounds.playConnectSpark();

    try {
      localStorage.setItem(STORAGE_KEY_CONNECTED, JSON.stringify(updatedConnected));
    } catch (_) {}

    // Record in Supabase if active (fire-and-forget in background)
    if (isSupabaseConfigured() && supabase && user) {
      supabase
        .from('connects')
        .insert({
          user_id: user.id,
          connected_user_id: currentMatch.id,
        })
        .then(() => {})
        .catch(() => {});
    }
  },

  reportCurrentMatch: async (reason = 'Inappropriate behavior') => {
    const { currentMatch, reportedIds, user } = get();
    if (!currentMatch) return;

    haptic.warning();
    set({ reportedIds: [...reportedIds, currentMatch.id] });

    if (isSupabaseConfigured() && supabase && user) {
      try {
        await supabase.from('reports').insert({
          reporter_id: user.id,
          reported_id: currentMatch.id,
          reason,
        });
      } catch (_) {}
    }

    // Automatically pass after reporting
    get().passCurrentMatch();
  },

  resetMatches: () => {
    set({ passedIds: [], connectedIds: [] });
    try {
      localStorage.removeItem(STORAGE_KEY_PASSED);
      localStorage.removeItem(STORAGE_KEY_CONNECTED);
    } catch (_) {}
    haptic.celebrate();

    const { user, allUsers } = get();
    const result = findBestMatchSync({
      currentUser: user,
      passedIds: [],
      connectedIds: [],
      localPool: allUsers,
    });

    if (result && result.match) {
      set({
        currentMatch: result.match,
        isEventMatch: result.isEventMatch,
        currentScreen: 'matchCard',
      });
    } else {
      set({
        currentMatch: null,
        currentScreen: 'noMatch',
      });
      haptic.soft();
    }
  },

  openChat: (partner) => {
    const targetPartner = partner || get().lastConnectedPartner;
    if (!targetPartner) return;

    const { chats } = get();
    const existingThread = chats[targetPartner.id] || [];
    let updatedChats = chats;

    if (existingThread.length === 0) {
      const welcomeMsg = {
        id: 'welcome-' + targetPartner.id,
        sender: 'partner',
        text: `Kem Cho! 🎊 DandiyaMatch par connect karke bahut achha laga! Chalo Garba plan karte hain! 🪔✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updatedChats = {
        ...chats,
        [targetPartner.id]: [welcomeMsg],
      };
      try {
        localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(updatedChats));
      } catch (_) {}
    }

    set({
      activeChatPartner: targetPartner,
      chats: updatedChats,
      currentScreen: 'chat',
    });
    haptic.light();
  },

  sendMessage: (partnerId, text) => {
    if (!text || !text.trim() || !partnerId) return;
    const cleanText = text.trim();
    const { chats, user, activeChatPartner, allUsers } = get();

    const newMsg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentThread = chats[partnerId] || [];
    const updatedThread = [...currentThread, newMsg];
    const updatedChats = {
      ...chats,
      [partnerId]: updatedThread,
    };

    set({ chats: updatedChats });
    haptic.tap();
    sounds.playDandiyaTap();

    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(updatedChats));
    } catch (_) {}

    // Record in Supabase if messages table is available (fire-and-forget)
    if (isSupabaseConfigured() && supabase && user) {
      try {
        supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: partnerId,
            message: cleanText,
          })
          .then(() => {})
          .catch(() => {});
      } catch (_) {}
    }

    // Interactive Festive Auto-Reply if chatting with a partner
    const partner = activeChatPartner || allUsers.find((u) => u.id === partnerId);
    set({ isPartnerTyping: true });

    setTimeout(() => {
      const replyText = generatePartnerGarbaReply(partner, cleanText);
      const replyMsg = {
        id: 'reply-' + Date.now(),
        sender: 'partner',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const freshChats = get().chats;
      const threadWithReply = [...(freshChats[partnerId] || []), replyMsg];
      const chatsWithReply = {
        ...freshChats,
        [partnerId]: threadWithReply,
      };

      set({
        chats: chatsWithReply,
        isPartnerTyping: false,
      });

      haptic.celebrate();
      sounds.playConnectSpark();

      try {
        localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chatsWithReply));
      } catch (_) {}
    }, 1300);
  },

  logout: async () => {
    haptic.light();
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_PASSED);
      localStorage.removeItem(STORAGE_KEY_CONNECTED);
    } catch (_) {}

    // 1. Immediately switch screen to 'login' and clear all user/partner data
    set({
      currentScreen: 'login',
      user: null,
      allUsers: [],
      passedIds: [],
      connectedIds: [],
      currentMatch: null,
      lastConnectedPartner: null,
      activeChatPartner: null,
      isPartnerTyping: false,
    });

    // 2. Safely notify Supabase in background without blocking state or UI
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (_) {}
    }
  },
}));
