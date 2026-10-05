// Haptic feedback utility with safe fallback for unsupported browsers/devices
export const haptic = {
  // Light tick for buttons, pill selects, tabs
  light: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch (_) {}
  },

  // Medium feedback for card release, next step
  medium: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(35);
      }
    } catch (_) {}
  },

  // Double tap for Dandiya stick strikes
  tap: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 25, 30]);
      }
    } catch (_) {}
  },

  // Massive celebration vibration when match connects
  celebrate: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (_) {}
  },

  // Soft buzz for passing or canceling
  soft: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    } catch (_) {}
  },

  // Warning or error
  warning: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 60, 40, 60, 80]);
      }
    } catch (_) {}
  },
};
