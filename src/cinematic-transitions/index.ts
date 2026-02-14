/**
 * Cinematic Transitions
 * 
 * Energy-aware, camera-aware, motion-aware, rhythm-aware transition intelligence.
 * 
 * Cuts are premium. Fancy transitions are amateur signals.
 */

export {
  type CinematicTransition,
  type CinematicTransitionResult,
  TRANSITION_CHARACTERISTICS,
  TRANSITION_LIMITS,
  EnergyComputer,
} from './transition-energy';

export {
  ContinuityDetector,
} from './transition-continuity';

export {
  CinematicTransitionResolver,
  type TransitionContext,
} from './transition-resolver-v2';

export {
  TransitionGovernor,
  type TransitionState,
} from './transition-governor';
