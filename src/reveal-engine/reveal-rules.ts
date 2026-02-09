/**
 * Reveal Engine - Strategy Rules
 * 
 * Defines the four reveal strategies and their selection criteria.
 * These are narrative behaviors, not visual effects.
 */

import { RevealStrategy, RevealStrategyName } from './reveal-types';

/**
 * The four reveal strategies.
 * 
 * IMPORTANT: These are ordered by frequency (most common first).
 * Instant should be the default for most scenes.
 */
export const REVEAL_STRATEGIES: Record<RevealStrategyName, RevealStrategy> = {
  /**
   * INSTANT - Most Common (Default)
   * Everything visible immediately.
   * Use when: Low weight AND low density
   * Purpose: Efficient, direct presentation
   */
  instant: {
    name: 'instant',
    narrativePurpose: 'Direct presentation - all content visible immediately',
    pacingModifier: 1.0,
  },

  /**
   * STAGGER - Protective
   * Elements introduced sequentially to manage cognitive load.
   * Use when: High density OR cognitive protection needed
   * Purpose: Prevent information overload
   */
  stagger: {
    name: 'stagger',
    narrativePurpose: 'Sequential introduction to manage cognitive load',
    pacingModifier: 1.2, // 20% slower to allow processing
    maxSteps: 5, // Max 5 sequential reveals
  },

  /**
   * SPOTLIGHT - Rare, Dramatic
   * Primary element first, then supporting context.
   * Use when: High emotional weight AND strong focal point
   * Purpose: Create dramatic emphasis
   * FREQUENCY LIMIT: Max 1 per 3 scenes
   */
  spotlight: {
    name: 'spotlight',
    narrativePurpose: 'Dramatic emphasis on primary element before context',
    pacingModifier: 1.3, // 30% slower for dramatic effect
    maxSteps: 2, // Primary first, then context
  },

  /**
   * BUILD - Explainer
   * Diagram assembles progressively.
   * Use when: Explaining systems, spatial relationships, mechanics
   * Purpose: Progressive understanding of complex systems
   * FREQUENCY LIMIT: Max 1 per 3 scenes
   */
  build: {
    name: 'build',
    narrativePurpose: 'Progressive assembly for system understanding',
    pacingModifier: 1.4, // 40% slower for comprehension
    maxSteps: 6, // Max 6 build steps
  },
};

/**
 * Frequency governor constants.
 * Prevents theatrical overuse of spotlight/build.
 */
export const FREQUENCY_LIMITS = {
  SPOTLIGHT_BUILD_WINDOW: 3, // Check last 3 scenes
  MAX_SPOTLIGHT_BUILD_IN_WINDOW: 1, // Max 1 spotlight/build per window
};

/**
 * Check if frequency governor should downgrade a strategy.
 * 
 * @param proposedStrategy - The strategy being considered
 * @param recentHistory - Last N scenes' reveal strategies
 * @returns true if governor should downgrade
 */
export function shouldGovernorDowngrade(
  proposedStrategy: RevealStrategyName,
  recentHistory: RevealStrategyName[]
): boolean {
  // Only spotlight and build are governed
  if (proposedStrategy !== 'spotlight' && proposedStrategy !== 'build') {
    return false;
  }

  // Check last N scenes
  const window = recentHistory.slice(-FREQUENCY_LIMITS.SPOTLIGHT_BUILD_WINDOW);
  
  // Count spotlight/build in window
  const count = window.filter(s => s === 'spotlight' || s === 'build').length;
  
  // Downgrade if limit exceeded
  return count >= FREQUENCY_LIMITS.MAX_SPOTLIGHT_BUILD_IN_WINDOW;
}
