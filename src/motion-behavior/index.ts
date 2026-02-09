/**
 * Motion Behavior - Public API
 * 
 * Renderer-agnostic layer for motion philosophy.
 */

export { BehaviorResolver } from './behavior-resolver';
export { MOTION_PRINCIPLES, MOTION_INFLATION_LIMITS, getMotionPrinciplesSummary } from './motion-principles';
export {
  MOTION_BEHAVIORS,
  CALM_BEHAVIOR,
  ASSERTIVE_BEHAVIOR,
  ENERGETIC_BEHAVIOR,
  TECHNICAL_BEHAVIOR,
  getBehaviorDefinition,
  getBehaviorSummary,
} from './behavior-types';

export type {
  MotionBehaviorName,
  EmotionalPolarity,
  MotionBehavior,
  MotionDecision,
  MotionSignals,
} from './behavior-types';
