// Non-blocking Haptic feedback utility with safe fallback
const safeVibrate = (pattern) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      setTimeout(() => {
        try {
          navigator.vibrate(pattern);
        } catch (_) {}
      }, 0);
    } catch (_) {}
  }
};

export const haptic = {
  // Light tick for buttons, pill selects, tabs
  light: () => safeVibrate(15),

  // Medium feedback for card release, next step
  medium: () => safeVibrate(35),

  // Double tap for Dandiya stick strikes
  tap: () => safeVibrate([30, 25, 30]),

  // Massive celebration vibration when match connects
  celebrate: () => safeVibrate([100, 50, 100]),

  // Soft buzz for passing or canceling
  soft: () => safeVibrate(20),

  // Warning or error
  warning: () => safeVibrate([40, 60, 40, 60, 80]),
};
