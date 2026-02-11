/**
 * Transition Rules
 * 
 * Defines the core mapping logic from Motion Pairs to Transition Types.
 * 
 * CORE RULE:
 * Transitions MUST follow Motion — never override it.
 */

import { MotionBehaviorName } from '../motion-behavior/behavior-types';
import { TransitionType } from './transition-types';

/**
 * Get base transition type based on motion pair.
 * 
 * @param from Previous motion behavior
 * @param to Current motion behavior
 */
export function getBaseTransition(
  from: MotionBehaviorName,
  to: MotionBehaviorName
): TransitionType {
  // 1. Energy Increase: calm → assertive => Firm
  if (from === 'calm' && to === 'assertive') {
    return 'firm';
  }

  // 2. Energy Drop: assertive/energetic → calm => Release
  if ((from === 'assertive' || from === 'energetic') && to === 'calm') {
    return 'release';
  }

  // 3. Technical Flow: technical → technical => Minimal
  if (from === 'technical' && to === 'technical') {
    return 'minimal';
  }

  // 4. Continuity (Default): calm → calm => Soft
  // Also covers: technical → calm, calm → technical, etc.
  return 'soft';
}

/**
 * Check if transition is valid for density.
 * 
 * High-density scenes should use SOFT transitions to reduce cognitive load.
 */
export function isAllowedForDensity(
  transition: TransitionType,
  density: number
): boolean {
  if (density >= 7) {
    // Only allow soft or minimal for high density
    return transition === 'soft' || transition === 'minimal';
  }
  return true;
}

/**
 * Check if transition allows firm sequence.
 * 
 * If previous was firm, next cannot be firm.
 */
export function isAllowedSequence(
  prev: TransitionType | undefined,
  current: TransitionType
): boolean {
  if (prev === 'firm' && current === 'firm') {
    return false; // Prevent consecutive firm transitions
  }
  return true;
}
