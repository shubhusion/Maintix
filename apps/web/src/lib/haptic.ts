/**
 * Haptic Feedback Utility
 * Provides tactile feedback for user interactions on supported devices
 */

/**
 * Triggers a haptic feedback vibration
 * @param type - Type of haptic feedback: 'light', 'medium', 'heavy', or 'success'
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' = 'light') {
  // Check if the device supports vibration API
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  // Pattern definitions for different haptic types
  const patterns = {
    light: [10], // Short, subtle tap
    medium: [20], // Medium tap
    heavy: [30], // Stronger tap
    success: [10, 50, 10], // Double tap for success
  };

  try {
    navigator.vibrate(patterns[type]);
  } catch {
    // Silently fail if vibration is not supported or blocked
  }
}

/**
 * Triggers haptic feedback on button click
 * @param type - Type of haptic feedback
 */
export function hapticClick(type: 'light' | 'medium' | 'heavy' | 'success' = 'light') {
  triggerHaptic(type);
}

/**
 * Triggers haptic feedback on form submission
 */
export function hapticSubmit() {
  triggerHaptic('success');
}

/**
 * Triggers haptic feedback on error
 */
export function hapticError() {
  triggerHaptic('heavy');
}
