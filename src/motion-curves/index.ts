/**
 * Motion Curves
 * 
 * Semantic motion curve system.
 * Defines motion INTENT, not renderer easing.
 */

export { 
  type MotionCurve, 
  type MotionCurveResult 
} from './curve-types';

export { 
  CURVE_CHARACTERISTICS,
  CURVE_LIMITS,
  MAX_CURVE_VOLATILITY,
  getCurveCharacteristics,
} from './curve-tokens';

export { 
  CurveResolver,
  type CurveContext,
} from './curve-resolver';
