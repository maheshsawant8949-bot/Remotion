/**
 * Motion Polish
 * 
 * Maps motion curves into real animation behavior.
 * This is a translation layer — NOT a behavior engine.
 * 
 * Slow ≠ cinematic. Slow = boring.
 */

export {
  SCENE_MOTION_DURATIONS,
  TRANSITION_DURATIONS,
  DURATION_LIMITS,
  getDurationForMotion,
  getDurationForTransition,
  validateDuration,
} from './duration-system';

export {
  EASING_CURVES,
  type EasingType,
  EASING_CHARACTERISTICS,
  getEasingCurve,
  validateEasingCurve,
} from './easing-library';

export {
  MotionMapper,
  type MotionPolish,
  type MotionContext,
} from './motion-mapper';

export {
  PolishGovernor,
} from './polish-governor';
