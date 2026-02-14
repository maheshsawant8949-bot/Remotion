/**
 * Duration System
 * 
 * CRITICAL: Strict duration ranges.
 * Most amateur systems fail here.
 * 
 * Hard cap: MAX = 900ms
 * Slow ≠ cinematic. Slow = boring.
 */

/**
 * Scene Motion Durations
 */
export const SCENE_MOTION_DURATIONS = {
  micro: { min: 180, max: 260 },      // 180-260ms
  standard: { min: 260, max: 420 },   // 260-420ms
  emphasis: { min: 420, max: 650 },   // 420-650ms
  deliberate: { min: 650, max: 900 }, // 650-900ms
} as const;

/**
 * Transition Durations
 * 
 * Never exceed 500ms.
 * Long transitions scream automation.
 */
export const TRANSITION_DURATIONS = {
  cut: { min: 0, max: 120 },            // 0-120ms
  'soft-cut': { min: 180, max: 260 },   // 180-260ms
  'match-cut': { min: 220, max: 320 },  // 220-320ms
  'ease-through': { min: 220, max: 320 },// 220-320ms
  'hold-cut': { min: 320, max: 450 },   // 320-450ms
} as const;

/**
 * Duration Limits
 */
export const DURATION_LIMITS = {
  maxSceneMotion: 900,      // Never exceed
  maxTransition: 500,       // Long transitions scream automation
  avgDurationTarget: 400,   // Target average
  minDuration: 180,         // Minimum (too fast = jarring)
} as const;

/**
 * Get duration for motion type
 */
export function getDurationForMotion(
  type: keyof typeof SCENE_MOTION_DURATIONS,
  bias: 'min' | 'mid' | 'max' = 'mid'
): number {
  const range = SCENE_MOTION_DURATIONS[type];
  
  switch (bias) {
    case 'min': return range.min;
    case 'max': return range.max;
    case 'mid': return Math.round((range.min + range.max) / 2);
  }
}

/**
 * Get duration for transition
 */
export function getDurationForTransition(
  type: keyof typeof TRANSITION_DURATIONS,
  bias: 'min' | 'mid' | 'max' = 'mid'
): number {
  const range = TRANSITION_DURATIONS[type];
  
  switch (bias) {
    case 'min': return range.min;
    case 'max': return range.max;
    case 'mid': return Math.round((range.min + range.max) / 2);
  }
}

/**
 * Validate duration
 */
export function validateDuration(duration: number, type: 'scene' | 'transition'): void {
  const max = type === 'scene' ? DURATION_LIMITS.maxSceneMotion : DURATION_LIMITS.maxTransition;
  
  if (duration > max) {
    throw new Error(
      `Duration ${duration}ms exceeds ${max}ms limit for ${type} (slow = boring)`
    );
  }
  
  if (duration < DURATION_LIMITS.minDuration) {
    throw new Error(
      `Duration ${duration}ms below ${DURATION_LIMITS.minDuration}ms minimum (too fast = jarring)`
    );
  }
}
