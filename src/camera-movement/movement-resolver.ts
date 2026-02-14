/**
 * Camera Movement Resolver
 * 
 * Runs AFTER camera framing and motion curves.
 * Selects movement intent based on upstream decisions.
 * 
 * HARD RULES:
 * - Density override (high density → static)
 * - Peak protection (avoid stacking intensity)
 * - Constant motion prevention (movement ≤ 40%)
 * - Consecutive push prevention (push streak ≤ 1)
 * 
 * DOES NOT:
 * - Define transforms
 * - Define keyframes
 * - Define durations
 * - Reference renderer
 * 
 * Defines intent only - renderer executes.
 */

import { CameraMovement, CameraMovementResult } from './movement-types';
import { MOVEMENT_LIMITS } from './movement-principles';

/**
 * Context for movement resolution
 */
export interface MovementContext {
  // Upstream decisions
  cameraShot: string;
  motionCurve: string;
  emphasisLevel: string;
  rhythmPeak: boolean;
  density: number;
  emotionalWeight: number;
  
  // Global state for governors
  totalScenes: number;
  movementCount: number;  // Scenes with any movement (non-static)
  pushCount: number;
  previousMovement?: CameraMovement;
  pushStreak: number;
}

/**
 * Camera Movement Resolver
 */
export class MovementResolver {
  /**
   * Resolve camera movement for a scene
   * 
   * Priority order:
   * 1. Density override (viewer cognition > cinematic flair)
   * 2. Peak protection (avoid stacking intensity)
   * 3. Constant motion prevention
   * 4. Push eligibility check
   * 5. Hold eligibility check
   * 6. Drift eligibility check
   * 7. Default to static
   */
  static resolve(context: MovementContext): CameraMovementResult {
    const reasons: string[] = [];
    
    // ========================================================================
    // GOVERNOR 1: Density Override
    // ========================================================================
    // Viewer cognition > cinematic flair. Always.
    if (context.density >= 7) {
      return {
        type: 'static',
        reason: `High density (${context.density}/10) - viewer cognition > cinematic flair`,
      };
    }
    
    // ========================================================================
    // GOVERNOR 2: Peak Protection
    // ========================================================================
    // Do not stack intensity layers
    const isAlreadyIntense = 
      context.emphasisLevel === 'strong' &&
      context.motionCurve === 'swift';
    
    if (isAlreadyIntense && !context.rhythmPeak) {
      return {
        type: 'static',
        reason: 'Peak protection (strong emphasis + swift curve - avoid stacking intensity)',
      };
    }
    
    // ========================================================================
    // GOVERNOR 3: Constant Motion Prevention
    // ========================================================================
    // Stillness is what makes movement feel expensive
    const movementRatio = context.movementCount / context.totalScenes;
    
    if (movementRatio >= MOVEMENT_LIMITS.maxMovementRatio) {
      return {
        type: 'static',
        reason: `Constant motion prevention (${(movementRatio * 100).toFixed(0)}% >= 40%)`,
      };
    }
    
    // ========================================================================
    // GOVERNOR 4: Consecutive Push Prevention
    // ========================================================================
    // Never stack pushes - that screams automation
    const isPushBlocked = 
      context.previousMovement === 'push' && 
      context.pushStreak >= MOVEMENT_LIMITS.maxPushStreak;
    
    if (isPushBlocked) {
      reasons.push('Push streak prevention (never stack pushes)');
    }
    
    // ========================================================================
    // STEP 1: Check for PUSH Eligibility
    // ========================================================================
    // Push is the cinematic signal - use sparingly
    const isPushEligible = 
      context.cameraShot === 'focus' &&
      context.emphasisLevel === 'strong' &&
      context.rhythmPeak;
    
    if (isPushEligible && !isPushBlocked) {
      const pushRatio = context.pushCount / context.totalScenes;
      
      if (pushRatio < 0.10) {
        return {
          type: 'push',
          reason: 'Cinematic signal (focus shot + strong emphasis + rhythm peak)',
        };
      }
      
      reasons.push(`Push quota exceeded (${(pushRatio * 100).toFixed(0)}% >= 10%)`);
    }
    
    // ========================================================================
    // STEP 2: Check for HOLD Eligibility
    // ========================================================================
    // Hold is massively underrated - let viewer absorb
    const isPostPeak = 
      context.emotionalWeight >= 7 && 
      context.motionCurve === 'deliberate';
    
    if (isPostPeak) {
      return {
        type: 'hold',
        reason: `Post-peak absorption (emotion ${context.emotionalWeight}/10 + deliberate curve)`,
      };
    }
    
    // ========================================================================
    // STEP 3: Check for DRIFT Eligibility
    // ========================================================================
    // Drift prevents dead stillness while maintaining elegance
    const isDriftEligible = 
      context.motionCurve === 'gentle' &&
      context.density < 5 &&
      !context.rhythmPeak;
    
    if (isDriftEligible) {
      return {
        type: 'drift',
        reason: 'Prevent dead stillness (gentle curve + low density)',
      };
    }
    
    // ========================================================================
    // DEFAULT: Static
    // ========================================================================
    // Stillness is premium
    return {
      type: 'static',
      reason: reasons.length > 0 
        ? reasons.join('; ') 
        : 'Default (stillness is premium)',
    };
  }
}
