export const useHaptic = () => {
  const triggerVibration = (pattern: number | number[] = 50) => {
    // Only works in browser environments that support it
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {
        // Ignore errors in browsers that don't allow it without user interaction
      }
    }
  };

  const hapticLight = () => triggerVibration(30);
  const hapticMedium = () => triggerVibration(60);
  const hapticHeavy = () => triggerVibration(100);
  const hapticSuccess = () => triggerVibration([30, 50, 50]);
  const hapticError = () => triggerVibration([50, 100, 50, 100, 50]);

  return {
    triggerVibration,
    hapticLight,
    hapticMedium,
    hapticHeavy,
    hapticSuccess,
    hapticError
  };
};
