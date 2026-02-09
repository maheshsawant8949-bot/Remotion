/**
 * Motion Principles
 * 
 * Global motion philosophy and constraints.
 * 
 * CRITICAL: Start with constraints — not capabilities.
 * Motion is philosophy, not animation.
 */

/**
 * Principle 1: Motion Must Serve Attention
 * 
 * If motion does not guide the eye, it should not exist.
 * Motion is a tool for directing focus.
 * Decorative motion is forbidden.
 */
export const MOTION_SERVES_ATTENTION =
  'Motion must guide the eye or not exist';

/**
 * Principle 2: Avoid Continuous Motion
 * 
 * Static is powerful.
 * Movement should feel intentional.
 * Prefer stillness over constant animation.
 */
export const AVOID_CONTINUOUS_MOTION =
  'Static is powerful, movement is intentional';

/**
 * Principle 3: Respect Cognitive Load
 * 
 * High-density scenes → calmer motion.
 * Let the brain work.
 * Don't overwhelm with movement.
 */
export const RESPECT_COGNITIVE_LOAD = 'High density → calmer motion';

/**
 * Principle 4: Motion Mirrors Emotional Weight
 * 
 * High weight → slower, deliberate movement.
 * Low weight → quicker transitions allowed.
 * Motion tempo reflects content importance.
 */
export const MOTION_MIRRORS_EMOTION = 'High weight → slower, deliberate';

/**
 * Principle 5: Scarcity Creates Impact
 * 
 * Most scenes should be calm.
 * Calm creates contrast.
 * Contrast creates cinematic feel.
 */
export const SCARCITY_CREATES_IMPACT = 'Most scenes calm, peaks kinetic';

/**
 * All motion principles.
 */
export const MOTION_PRINCIPLES = {
  SERVE_ATTENTION: MOTION_SERVES_ATTENTION,
  AVOID_CONTINUOUS: AVOID_CONTINUOUS_MOTION,
  RESPECT_COGNITIVE_LOAD,
  MIRROR_EMOTIONAL_WEIGHT: MOTION_MIRRORS_EMOTION,
  SCARCITY_CREATES_IMPACT,
} as const;

/**
 * Motion Inflation Limits
 * 
 * Prevent motion inflation by limiting assertive/energetic behaviors.
 * 
 * CRITICAL: No more than 20-25% of scenes may use assertive/energetic.
 * Most scenes should remain calm.
 */
export const MOTION_INFLATION_LIMITS = {
  /**
   * Maximum percentage of scenes that can use assertive/energetic behaviors.
   * 25% maximum.
   */
  MAX_ASSERTIVE_ENERGETIC_PERCENT: 0.25,

  /**
   * Target percentage of scenes that should use calm behavior.
   * 75% target.
   */
  CALM_TARGET_PERCENT: 0.75,

  /**
   * Window size for tracking recent behavior history.
   */
  HISTORY_WINDOW: 10,
} as const;

/**
 * Get motion principles summary for logging.
 */
export function getMotionPrinciplesSummary(): string {
  return (
    `Motion Principles:\n` +
    `  1. ${MOTION_PRINCIPLES.SERVE_ATTENTION}\n` +
    `  2. ${MOTION_PRINCIPLES.AVOID_CONTINUOUS}\n` +
    `  3. ${MOTION_PRINCIPLES.RESPECT_COGNITIVE_LOAD}\n` +
    `  4. ${MOTION_PRINCIPLES.MIRROR_EMOTIONAL_WEIGHT}\n` +
    `  5. ${MOTION_PRINCIPLES.SCARCITY_CREATES_IMPACT}\n` +
    `\n` +
    `Inflation Limits:\n` +
    `  Max assertive/energetic: ${MOTION_INFLATION_LIMITS.MAX_ASSERTIVE_ENERGETIC_PERCENT * 100}%\n` +
    `  Target calm: ${MOTION_INFLATION_LIMITS.CALM_TARGET_PERCENT * 100}%`
  );
}
