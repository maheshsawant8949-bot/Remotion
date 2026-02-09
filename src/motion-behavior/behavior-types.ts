/**
 * Motion Behavior Types
 * 
 * Defines 4 behavior archetypes for motion philosophy.
 * 
 * CRITICAL: DO NOT exceed 4 behaviors.
 * Constraint builds visual identity.
 * 
 * DO NOT:
 * ❌ Define animation curves
 * ❌ Specify zoom levels
 * ❌ Specify transforms
 * ❌ Reference renderer
 * 
 * Behavior only. Renderer interprets later.
 */

/**
 * Motion behavior names.
 * 
 * ONLY 4 behaviors allowed:
 * - calm: Default, most common
 * - assertive: Emphasis moments
 * - energetic: Rare urgency (upward polarity only)
 * - technical: Diagrams/process (never escalates)
 */
export type MotionBehaviorName =
  | 'calm'
  | 'assertive'
  | 'energetic'
  | 'technical';

/**
 * Emotional polarity classification.
 * 
 * Upward/Activating: positive, excited, urgent, triumphant
 * Downward/Deactivating: sad, somber, reflective, melancholic
 * Neutral: informational, analytical, explanatory
 */
export type EmotionalPolarity = 'upward' | 'downward' | 'neutral';

/**
 * Motion behavior definition.
 */
export interface MotionBehavior {
  type: MotionBehaviorName;
  philosophy: string;
  whenToUse: string[];
  characteristics: string[];
  constraints?: string[];
}

/**
 * Motion decision output.
 */
export interface MotionDecision {
  behavior: MotionBehaviorName;
  reason: string[];
  inflationPrevented?: boolean;
  recoveryBiasApplied?: boolean;
  governorApplied?: boolean;
}

/**
 * Motion signals input.
 */
export interface MotionSignals {
  emotionalWeight: number;
  emotionalPolarity: EmotionalPolarity;
  density: number;
  emphasis: 'none' | 'soft' | 'strong';
  strategy: string;
  intentType?: string;
  previousBehavior?: MotionBehaviorName;
  recentHistory: MotionBehaviorName[];
}

/**
 * Behavior 1: Calm (Default - Most Common)
 * 
 * Slow, minimal motion.
 * Default state.
 * Purpose: Let content breathe, create baseline.
 */
export const CALM_BEHAVIOR: MotionBehavior = {
  type: 'calm',
  philosophy: 'Static is powerful, movement is intentional',
  whenToUse: [
    'Default state',
    'High density scenes',
    'Recovery after assertive/energetic',
    'Low emotional weight',
  ],
  characteristics: [
    'Slow, minimal motion',
    'Let content breathe',
    'Create baseline for contrast',
  ],
};

/**
 * Behavior 2: Assertive (Emphasis Moments)
 * 
 * Confident but not aggressive.
 * Used for emphasis moments.
 * Purpose: Draw attention without overwhelming.
 */
export const ASSERTIVE_BEHAVIOR: MotionBehavior = {
  type: 'assertive',
  philosophy: 'Confident guidance without aggression',
  whenToUse: [
    'Soft emphasis scenes',
    'Strong emphasis with downward polarity',
    'Medium emotional weight',
  ],
  characteristics: [
    'Confident but not aggressive',
    'Draw attention',
    'Maintain clarity',
  ],
};

/**
 * Behavior 3: Energetic (Rare Urgency - Upward Polarity Only)
 * 
 * Reserved for rare urgency.
 * Highest kinetic energy.
 * ONLY for upward/activating emotions.
 * NEVER for downward emotions.
 * Purpose: Peak moments with positive energy.
 */
export const ENERGETIC_BEHAVIOR: MotionBehavior = {
  type: 'energetic',
  philosophy: 'Rare kinetic energy for upward peaks',
  whenToUse: [
    'Strong emphasis with upward polarity',
    'High emotional weight (≥7)',
    'Positive, excited, urgent moments',
  ],
  characteristics: [
    'Highest kinetic energy',
    'Reserved for rare urgency',
    'Positive energy only',
  ],
  constraints: [
    'ONLY for upward/activating emotions',
    'NEVER for downward emotions (sad, somber, reflective)',
    'Subject to inflation limits (≤25%)',
  ],
};

/**
 * Behavior 4: Technical (Diagrams/Process - Never Escalates)
 * 
 * Precise, mechanical feeling.
 * Great for diagrams/process.
 * NEVER escalates to energetic.
 * Stays technical or downgrades to calm.
 * Purpose: Clarity and precision.
 */
export const TECHNICAL_BEHAVIOR: MotionBehavior = {
  type: 'technical',
  philosophy: 'Precise, mechanical clarity',
  whenToUse: [
    'Process strategies',
    'Diagram strategies',
    'Analytical content',
  ],
  characteristics: [
    'Precise, mechanical feeling',
    'Clarity and precision',
    'Methodical presentation',
  ],
  constraints: [
    'NEVER escalates to energetic',
    'Stays technical or downgrades to calm',
  ],
};

/**
 * All behavior definitions.
 */
export const MOTION_BEHAVIORS: Record<MotionBehaviorName, MotionBehavior> = {
  calm: CALM_BEHAVIOR,
  assertive: ASSERTIVE_BEHAVIOR,
  energetic: ENERGETIC_BEHAVIOR,
  technical: TECHNICAL_BEHAVIOR,
};

/**
 * Get behavior definition.
 */
export function getBehaviorDefinition(
  behavior: MotionBehaviorName
): MotionBehavior {
  return MOTION_BEHAVIORS[behavior];
}

/**
 * Get behavior summary for logging.
 */
export function getBehaviorSummary(behavior: MotionBehaviorName): string {
  const def = getBehaviorDefinition(behavior);
  return (
    `${def.type.toUpperCase()}: ${def.philosophy}\n` +
    `  When to use: ${def.whenToUse.join(', ')}\n` +
    `  Characteristics: ${def.characteristics.join(', ')}` +
    (def.constraints
      ? `\n  Constraints: ${def.constraints.join(', ')}`
      : '')
  );
}
