/**
 * Motion Curve Resolver
 * 
 * Selects curve based on motion behavior, emotion, and density.
 * 
 * HARD RULES:
 * - Emotion overrides motion behavior
 * - Inflation protection for swift/deliberate
 * - Jitter prevention for smooth flow
 * 
 * DOES NOT:
 * - Define cubic-bezier
 * - Define durations
 * - Define animation code
 * 
 * Renderer interprets curves later.
 */

import { MotionCurve, MotionCurveResult } from './curve-types';
import { CURVE_LIMITS, MAX_CURVE_VOLATILITY } from './curve-tokens';

/**
 * Context for curve resolution
 */
export interface CurveContext {
  // Scene properties
  motionBehavior: string;
  emotionalWeight: number;
  density: number;
  rhythmPeak?: boolean;
  transitionEnergy?: string;
  
  // Global state for inflation protection
  totalScenes: number;
  swiftCount: number;
  deliberateCount: number;
  
  // Jitter prevention
  previousCurve?: MotionCurve;
  curveChanges: number;
}

/**
 * Motion Curve Resolver
 */
export class CurveResolver {
  /**
   * Resolve motion curve for a scene
   * 
   * Priority order:
   * 1. Emotion override (high emotion → deliberate)
   * 2. Motion behavior mapping
   * 3. Inflation protection
   * 4. Jitter prevention
   */
  static resolve(context: CurveContext): MotionCurveResult {
    const reasons: string[] = [];
    
    // ========================================================================
    // STEP 1: Emotion Override (Highest Priority)
    // ========================================================================
    // High emotion should outrank raw motion
    if (context.emotionalWeight >= 8) {
      // Check deliberate inflation
      const deliberateRatio = context.deliberateCount / context.totalScenes;
      
      if (deliberateRatio < CURVE_LIMITS.deliberate) {
        return {
          type: 'deliberate',
          reason: `High emotion (${context.emotionalWeight}/10) - dramatic weight`,
        };
      }
      
      reasons.push(`High emotion detected, but deliberate quota exceeded (${(deliberateRatio * 100).toFixed(0)}% >= ${CURVE_LIMITS.deliberate * 100}%)`);
    }
    
    // ========================================================================
    // STEP 2: Motion Behavior Mapping
    // ========================================================================
    let baseCurve: MotionCurve;
    
    switch (context.motionBehavior) {
      case 'energetic':
        // Check swift inflation
        const swiftRatio = context.swiftCount / context.totalScenes;
        
        if (swiftRatio < CURVE_LIMITS.swift) {
          baseCurve = 'swift';
          reasons.push('Energetic motion behavior');
        } else {
          baseCurve = 'confident';
          reasons.push(`Energetic motion, but swift quota exceeded (${(swiftRatio * 100).toFixed(0)}% >= ${CURVE_LIMITS.swift * 100}%) - downgraded to confident`);
        }
        break;
        
      case 'assertive':
        baseCurve = 'confident';
        reasons.push('Assertive motion behavior');
        break;
        
      case 'calm':
        baseCurve = 'gentle';
        reasons.push('Calm motion behavior');
        break;
        
      case 'technical':
        baseCurve = 'gentle';
        reasons.push('Technical motion behavior');
        break;
        
      default:
        baseCurve = 'gentle';
        reasons.push(`Default motion behavior (${context.motionBehavior || 'unspecified'})`);
        break;
    }
    
    // ========================================================================
    // STEP 3: Jitter Prevention
    // ========================================================================
    // Smooth rhythm = premium feel
    if (context.totalScenes > 1) {
      const curveVolatility = context.curveChanges / (context.totalScenes - 1);
      
      if (curveVolatility > MAX_CURVE_VOLATILITY && context.previousCurve) {
        // If volatility is too high and we're about to change curve again
        if (baseCurve !== context.previousCurve && baseCurve !== 'gentle') {
          baseCurve = 'gentle';
          reasons.push(`Jitter prevention (volatility ${(curveVolatility * 100).toFixed(0)}% > ${MAX_CURVE_VOLATILITY * 100}%) - biased to gentle`);
        }
      }
    }
    
    return {
      type: baseCurve,
      reason: reasons.join('; '),
    };
  }
  
  /**
   * Update global state after curve resolution
   */
  static updateState(
    state: Pick<CurveContext, 'swiftCount' | 'deliberateCount' | 'previousCurve' | 'curveChanges'>,
    resolvedCurve: MotionCurve
  ): void {
    // Update counts
    if (resolvedCurve === 'swift') {
      state.swiftCount++;
    } else if (resolvedCurve === 'deliberate') {
      state.deliberateCount++;
    }
    
    // Update jitter tracking
    if (state.previousCurve && state.previousCurve !== resolvedCurve) {
      state.curveChanges++;
    }
    
    state.previousCurve = resolvedCurve;
  }
}
