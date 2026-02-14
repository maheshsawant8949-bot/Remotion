/**
 * Motion Curve Tokens
 * 
 * Semantic characteristics for each curve.
 * DOES NOT define cubic-bezier, durations, or animation code.
 * 
 * These are intent descriptors - renderer interprets them.
 */

import { MotionCurve } from './curve-types';

/**
 * Curve Characteristics (Semantic, NOT renderer easing)
 */
export const CURVE_CHARACTERISTICS = {
  gentle: {
    acceleration: 'low',
    stop: 'soft',
    usage: 'Default, calm scenes, technical content',
    feel: 'Smooth, approachable, non-intrusive',
  },
  confident: {
    acceleration: 'steady',
    stop: 'firm',
    usage: 'Assertive content, clear statements',
    feel: 'Professional, decisive, controlled',
  },
  swift: {
    acceleration: 'high',
    duration: 'short',
    usage: 'Energetic moments, quick transitions',
    feel: 'Dynamic, exciting, attention-grabbing',
  },
  deliberate: {
    acceleration: 'slow',
    duration: 'long',
    usage: 'High emotion, dramatic moments',
    feel: 'Intentional, weighty, impactful',
  },
} as const;

/**
 * Inflation Protection Limits
 * 
 * Premium motion is subtle.
 * Overuse of swift/deliberate = cheap feel.
 */
export const CURVE_LIMITS = {
  swift: 0.10,      // Max 10% of scenes
  deliberate: 0.12, // Max 12% of scenes
} as const;

/**
 * Jitter Prevention Threshold
 * 
 * Jittery curves = cheap feel.
 * Smooth rhythm = premium feel.
 */
export const MAX_CURVE_VOLATILITY = 0.45; // Max 45% curve switches

/**
 * Get curve characteristics
 */
export function getCurveCharacteristics(curve: MotionCurve) {
  return CURVE_CHARACTERISTICS[curve];
}
