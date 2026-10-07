import { supabase, isSupabaseConfigured } from './supabase';
import { DUMMY_USERS } from './mockData';

export const isValidUUID = (id) => {
  return (
    typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
};

export const normalizeCity = (city) => {
  if (!city) return '';
  const c = city.trim().toLowerCase();
  if (c.includes('sambhajinagar') || c.includes('aurangabad')) return 'chh. sambhajinagar';
  if (c.includes('mumbai') || c.includes('bombay')) return 'mumbai';
  if (c.includes('delhi')) return 'delhi ncr';
  if (c.includes('pune') || c.includes('poona')) return 'pune';
  if (c.includes('ahmedabad') || c.includes('amdavad')) return 'ahmedabad';
  if (c.includes('vadodara') || c.includes('baroda')) return 'vadodara';
  if (c.includes('surat')) return 'surat';
  if (c.includes('rajkot')) return 'rajkot';
  if (c.includes('nagpur')) return 'nagpur';
  if (c.includes('nashik')) return 'nashik';
  if (c.includes('thane')) return 'thane';
  if (c.includes('indore')) return 'indore';
  if (c.includes('jaipur')) return 'jaipur';
  if (c.includes('bengaluru') || c.includes('bangalore')) return 'bengaluru';
  if (c.includes('hyderabad')) return 'hyderabad';
  if (c.includes('kolkata') || c.includes('calcutta')) return 'kolkata';
  return c;
};

/**
 * 0ms Synchronous Intelligent Matcher (Pure In-Memory)
 * Resolves instantly without network latency so swiping and transitions are ultra-smooth.
 */
export const findBestMatchSync = ({
  currentUser,
  passedIds = [],
  connectedIds = [],
  localPool = [],
}) => {
  if (!currentUser) return null;

  const isDemo = Boolean(currentUser.is_demo);

  const excludedIds = new Set([
    currentUser.id,
    ...(passedIds || []),
    ...(connectedIds || []),
  ]);

  const userCity = normalizeCity(currentUser.city || 'Ahmedabad');
  const isUserFemale =
    currentUser.gender && currentUser.gender.toLowerCase() === 'female';
  const targetGender = isUserFemale ? 'Male' : 'Female';

  // Strict Pool Construction:
  // - Demo user: uses localPool + DUMMY_USERS
  // - Google user: strictly uses real users from localPool (where google_id is present). NO DUMMY_USERS!
  const poolMap = new Map();
  const poolToUse = isDemo
    ? [...(localPool || []), ...DUMMY_USERS]
    : (localPool || []);

  poolToUse.forEach((u) => {
    if (u && u.id && u.id !== currentUser.id) {
      // For real Google users, NEVER include dummy mock users
      if (!isDemo && !u.google_id) return;
      poolMap.set(u.id, u);
    }
  });

  const allCandidates = Array.from(poolMap.values());

  // 1. Filter candidates matching city and target gender
  let eligible = allCandidates.filter((u) => {
    if (!u || excludedIds.has(u.id) || u.has_partner) return false;
    if (u.gender !== targetGender) return false;
    return normalizeCity(u.city) === userCity;
  });

  // 2. Fallback to any city if local city pool is exhausted
  // In demo mode: keeps swiping infinite
  // In real mode: allows finding real dancers from other cities if available
  if (eligible.length === 0) {
    eligible = allCandidates.filter((u) => {
      if (!u || excludedIds.has(u.id) || u.has_partner) return false;
      return u.gender === targetGender;
    });
  }

  // If no real registered partner available, return null so NoMatchScreen is shown
  if (eligible.length === 0) {
    return null;
  }

  // Priority 1: Same Event match
  if (currentUser.event_pin && currentUser.event_pin.trim().length > 0) {
    const searchEvent = currentUser.event_pin.trim().toLowerCase();
    const eventMatch = eligible.find(
      (u) => u.event_pin && u.event_pin.toLowerCase().includes(searchEvent)
    );
    if (eventMatch) {
      return { match: eventMatch, isEventMatch: true };
    }
  }

  // Priority 2: Same Vibe match
  if (currentUser.vibe) {
    const searchVibe = currentUser.vibe.trim().toLowerCase();
    const vibeMatch = eligible.find(
      (u) => u.vibe && u.vibe.trim().toLowerCase() === searchVibe
    );
    if (vibeMatch) {
      return { match: vibeMatch, isEventMatch: false };
    }
  }

  // Priority 3: Same Dancing Level
  if (currentUser.dancing_level) {
    const levelMatch = eligible.find(
      (u) => u.dancing_level === currentUser.dancing_level
    );
    if (levelMatch) {
      return { match: levelMatch, isEventMatch: false };
    }
  }

  // Default: First eligible match
  return { match: eligible[0], isEventMatch: false };
};

/**
 * Async Intelligent Matching Algorithm:
 * - Executes in 0ms for demo exploration.
 * - Single ultra-fast query for Google authenticated users strictly fetching REAL registered users.
 */
export const findBestMatch = async ({
  currentUser,
  passedIds = [],
  connectedIds = [],
  localPool = [],
}) => {
  if (!currentUser) return null;

  const isGoogleUser = Boolean(currentUser.google_id && !currentUser.is_demo);

  // For Demo users: Synchronous response immediately with mock pool
  if (!isGoogleUser) {
    return findBestMatchSync({
      currentUser,
      passedIds,
      connectedIds,
      localPool: localPool && localPool.length > 0 ? localPool : DUMMY_USERS,
    });
  }

  // For Google users: Query Supabase ONLY for real users (google_id IS NOT NULL)
  if (isSupabaseConfigured() && supabase) {
    try {
      const isUserFemale =
        currentUser.gender && currentUser.gender.toLowerCase() === 'female';
      const targetGender = isUserFemale ? 'Male' : 'Female';

      const { data: dbUsers, error } = await supabase
        .from('users')
        .select('*')
        .not('google_id', 'is', null)
        .neq('id', currentUser.id)
        .eq('gender', targetGender)
        .eq('has_partner', false)
        .limit(30);

      if (!error && dbUsers) {
        return findBestMatchSync({
          currentUser,
          passedIds,
          connectedIds,
          localPool: dbUsers,
        });
      }
    } catch (err) {
      console.warn('Real Google user matching lookup fallback:', err);
    }
  }

  return findBestMatchSync({
    currentUser,
    passedIds,
    connectedIds,
    localPool,
  });
};
