/**
 * Camera Movement Principles
 * 
 * Stillness is what makes movement feel expensive.
 * 
 * Movement should be felt — not noticed.
 */

import { CameraMovement } from './movement-types';

/**
 * Movement Characteristics
 */
export const MOVEMENT_CHARACTERISTICS = {
  static: {
    description: 'No camera movement',
    usage: 'Default, most scenes',
    feel: 'Stable, grounded, professional',
    target: '60-75%',
  },
  drift: {
    description: 'Very slow lateral or vertical motion',
    usage: 'Calm motion, low density, non-peak scenes',
    purpose: ['Prevent dead stillness', 'Maintain elegance'],
    feel: 'Elegant, subtle, must be very slow',
    target: '15-25%',
  },
  push: {
    description: 'Extremely slow forward movement',
    usage: 'Focus shot + strong emphasis + rhythm peak ONLY',
    purpose: ['Cinematic signal', 'Intentional emphasis'],
    feel: 'Powerful, deliberate, premium',
    target: '5-10%',
    warning: 'Cap strictly - overuse screams automation',
  },
  hold: {
    description: 'Micro-settle after intensity',
    usage: 'Post-peak, high emotion, deliberate curve',
    purpose: ['Let viewer absorb information', 'Contemplative pause'],
    feel: 'Absorptive, underrated, powerful',
    target: '5-10%',
  },
} as const;

/**
 * Distribution Targets
 * 
 * Healthy profile ensures movement feels premium, not templated.
 */
export const MOVEMENT_TARGETS = {
  static: { min: 0.60, max: 0.75 },  // 60-75%
  drift: { min: 0.15, max: 0.25 },   // 15-25%
  push: { min: 0.05, max: 0.10 },    // 5-10%
  hold: { min: 0.05, max: 0.10 },    // 5-10%
} as const;

/**
 * Governor Limits
 * 
 * Critical protection rules to prevent:
 * - Constant motion (floaty feel)
 * - Consecutive pushes (templated feel)
 */
export const MOVEMENT_LIMITS = {
  maxMovementRatio: 0.40,  // Max 40% of scenes with any movement
  maxPushStreak: 1,        // Never stack pushes (screams automation)
} as const;

/**
 * Get movement characteristics
 */
export function getMovementCharacteristics(movement: CameraMovement) {
  return MOVEMENT_CHARACTERISTICS[movement];
}
