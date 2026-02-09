/**
 * Emphasis Engine - Level Rules
 * 
 * Defines the three emphasis levels and their selection criteria.
 * These are perceptual hierarchy definitions, not visual effects.
 */

import { EmphasisLevelName } from './emphasis-types';

/**
 * The three emphasis levels.
 * 
 * IMPORTANT: These are ordered by frequency (most common first).
 * None should be the default for most scenes.
 */
export const EMPHASIS_LEVELS = {
  /**
   * NONE - Most Common (Default)
   * Normal presentation, no priority.
   * Use when: Low emotional weight AND no spotlight reveal
   * Purpose: Default state - normal is powerful
   */
  none: {
    name: 'none' as const,
    description: 'Normal presentation - no perceptual priority',
  },

  /**
   * SOFT - Subtle Guidance
   * Gentle priority indication.
   * Use when: Medium emotional weight OR moderate density OR comparison
   * Purpose: Subtle guidance for medium-importance content
   */
  soft: {
    name: 'soft' as const,
    description: 'Subtle priority - gentle guidance toward important element',
  },

  /**
   * STRONG - Rare, Authoritative
   * Clear priority signal.
   * Use when: High emotional weight (≥7) OR spotlight reveal exists
   * Purpose: Rare authority for high-impact content
   * FREQUENCY LIMIT: Max 1 per 3 scenes
   */
  strong: {
    name: 'strong' as const,
    description: 'Strong priority - clear perceptual authority',
  },
};

/**
 * Frequency governor constants.
 * Prevents "cinematic shouting" by limiting strong emphasis.
 */
export const EMPHASIS_FREQUENCY_LIMITS = {
  STRONG_WINDOW: 3, // Check last 3 scenes
  MAX_STRONG_IN_WINDOW: 1, // Max 1 strong per window
};

/**
 * Check if frequency governor should downgrade emphasis level.
 * 
 * @param proposedLevel - The emphasis level being considered
 * @param recentHistory - Last N scenes' emphasis levels
 * @returns true if governor should downgrade
 */
export function shouldGovernorDowngrade(
  proposedLevel: EmphasisLevelName,
  recentHistory: EmphasisLevelName[]
): boolean {
  // Only 'strong' is governed
  if (proposedLevel !== 'strong') {
    return false;
  }

  // Check last N scenes
  const window = recentHistory.slice(-EMPHASIS_FREQUENCY_LIMITS.STRONG_WINDOW);
  
  // Count strong emphasis in window
  const strongCount = window.filter(l => l === 'strong').length;
  
  // Downgrade if limit exceeded
  return strongCount >= EMPHASIS_FREQUENCY_LIMITS.MAX_STRONG_IN_WINDOW;
}
