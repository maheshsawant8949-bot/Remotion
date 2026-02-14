/**
 * Interaction Principles
 * 
 * Defines characteristics, usage, and distribution targets for each interaction type.
 */

/**
 * Interaction Characteristics
 */
export const INTERACTION_CHARACTERISTICS = {
  none: {
    description: 'No micro-interaction',
    usage: 'Default, stillness is sophistication',
    target: '50-65%',
  },
  settle: {
    description: 'Tiny stabilization after motion ends',
    usage: 'Focus scenes, text-heavy, stat reveals',
    target: '≤20%',
    value: 'VERY HIGH - removes mechanical feel instantly',
  },
  linger: {
    description: 'Hold attention slightly longer',
    usage: 'Strong emphasis, high emotion, deliberate curve',
    target: '≤15%',
    effect: 'Viewer gets time to absorb',
  },
  'soft-pop': {
    description: 'Extremely subtle scale/opacity confirmation',
    usage: 'Diagram highlights, key labels, important nodes',
    target: '≤10%',
    warning: 'Must be FAST. No bounce.',
  },
  breathe: {
    description: 'Very slow ambient micro-motion',
    usage: 'Calm scenes, wide shots, low density',
    target: '≤8%',
    warning: 'Never combine with push camera. Avoid motion stacking.',
  },
} as const;

/**
 * Interaction Distribution Targets
 */
export const INTERACTION_TARGETS = {
  none: { min: 0.50, max: 0.65 },      // 50-65%
  settle: { max: 0.20 },                // ≤20%
  linger: { max: 0.15 },                // ≤15%
  'soft-pop': { max: 0.10 },            // ≤10%
  breathe: { max: 0.08 },               // ≤8%
} as const;

/**
 * Interaction Limits
 */
export const INTERACTION_LIMITS = {
  maxInteractionRatio: 0.45,  // Max 45% of scenes with interactions
  maxConsecutiveInteractions: 3,  // Prevent interaction fatigue
} as const;

/**
 * Get interaction target
 */
export function getInteractionTarget(type: keyof typeof INTERACTION_TARGETS): {
  min?: number;
  max?: number;
} {
  return INTERACTION_TARGETS[type];
}

/**
 * Validate interaction distribution
 */
export function validateInteractionDistribution(
  counts: Record<string, number>,
  totalScenes: number
): void {
  if (totalScenes === 0) return;
  
  // Check settle cap
  const settleRatio = counts.settle / totalScenes;
  if (settleRatio > INTERACTION_TARGETS.settle.max) {
    throw new Error(
      `Settle ratio ${(settleRatio * 100).toFixed(1)}% exceeds ${INTERACTION_TARGETS.settle.max * 100}% limit`
    );
  }
  
  // Check linger cap
  const lingerRatio = counts.linger / totalScenes;
  if (lingerRatio > INTERACTION_TARGETS.linger.max) {
    throw new Error(
      `Linger ratio ${(lingerRatio * 100).toFixed(1)}% exceeds ${INTERACTION_TARGETS.linger.max * 100}% limit`
    );
  }
  
  // Check soft-pop cap
  const softPopRatio = counts['soft-pop'] / totalScenes;
  if (softPopRatio > INTERACTION_TARGETS['soft-pop'].max) {
    throw new Error(
      `Soft-pop ratio ${(softPopRatio * 100).toFixed(1)}% exceeds ${INTERACTION_TARGETS['soft-pop'].max * 100}% limit`
    );
  }
  
  // Check breathe cap
  const breatheRatio = counts.breathe / totalScenes;
  if (breatheRatio > INTERACTION_TARGETS.breathe.max) {
    throw new Error(
      `Breathe ratio ${(breatheRatio * 100).toFixed(1)}% exceeds ${INTERACTION_TARGETS.breathe.max * 100}% limit`
    );
  }
  
  // Check overall interaction ratio
  const interactionCount = totalScenes - (counts.none || 0);
  const interactionRatio = interactionCount / totalScenes;
  if (interactionRatio > INTERACTION_LIMITS.maxInteractionRatio) {
    throw new Error(
      `Interaction ratio ${(interactionRatio * 100).toFixed(1)}% exceeds ${INTERACTION_LIMITS.maxInteractionRatio * 100}% limit (over-animated systems look cheap)`
    );
  }
}
