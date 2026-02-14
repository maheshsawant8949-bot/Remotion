/**
 * Interaction Resolver
 * 
 * Interactions must respect intensity. Never amplify chaos.
 * 
 * Resolver MUST read:
 * - motionCurve, cameraMovement
 * - emphasisLevel, emotionalWeight
 * - density, rhythmState
 */

import { MicroInteraction, MicroInteractionResult } from './interaction-types';
import { INTERACTION_LIMITS } from './interaction-principles';

/**
 * Interaction Context
 */
export interface InteractionContext {
  // Scene properties
  motionCurve?: string;
  cameraMovement?: string;
  cameraShot?: string;
  emphasisLevel?: string;
  emotionalWeight?: number;
  density?: number;
  rhythmPeak?: boolean;
  
  // Layout hints
  isTextHeavy?: boolean;
  isDiagram?: boolean;
  
  // State tracking
  totalScenes: number;
  settleCount: number;
  lingerCount: number;
  softPopCount: number;
  breatheCount: number;
  interactionCount: number;
}

/**
 * Interaction Resolver
 */
export class InteractionResolver {
  /**
   * Resolve micro-interaction for scene
   */
  static resolve(context: InteractionContext): MicroInteractionResult {
    // Check inflation first
    const interactionRatio = context.interactionCount / context.totalScenes;
    if (interactionRatio >= INTERACTION_LIMITS.maxInteractionRatio) {
      return {
        type: 'none',
        reason: 'Interaction inflation prevention (over-animated systems look cheap)',
      };
    }
    
    // Settle eligibility (VERY HIGH VALUE)
    if (this.isSettleEligible(context)) {
      const settleRatio = context.settleCount / context.totalScenes;
      if (settleRatio < 0.20) {
        return {
          type: 'settle',
          reason: 'Text-heavy focus scene (removes mechanical feel instantly)',
        };
      }
    }
    
    // Linger eligibility
    if (this.isLingerEligible(context)) {
      const lingerRatio = context.lingerCount / context.totalScenes;
      if (lingerRatio < 0.15) {
        return {
          type: 'linger',
          reason: 'Strong emphasis + high emotion (viewer gets time to absorb)',
        };
      }
    }
    
    // Soft-pop eligibility
    if (this.isSoftPopEligible(context)) {
      const softPopRatio = context.softPopCount / context.totalScenes;
      if (softPopRatio < 0.10) {
        return {
          type: 'soft-pop',
          reason: 'Diagram highlight (subtle confirmation)',
        };
      }
    }
    
    // Breathe eligibility
    if (this.isBreatheEligible(context)) {
      const breatheRatio = context.breatheCount / context.totalScenes;
      if (breatheRatio < 0.08) {
        return {
          type: 'breathe',
          reason: 'Calm wide shot (creates life without distraction)',
        };
      }
    }
    
    // Default: none (stillness is sophistication)
    return {
      type: 'none',
      reason: 'Default (stillness is sophistication)',
    };
  }
  
  /**
   * Check settle eligibility
   * 
   * Use when:
   * - focus scenes
   * - text-heavy scenes
   * - stat reveals
   */
  private static isSettleEligible(context: InteractionContext): boolean {
    return (
      context.cameraShot === 'close' ||
      context.isTextHeavy === true ||
      context.density >= 6 ||
      context.motionCurve === 'deliberate'
    );
  }
  
  /**
   * Check linger eligibility
   * 
   * Use when:
   * - strong emphasis
   * - high emotion
   * - deliberate curve
   */
  private static isLingerEligible(context: InteractionContext): boolean {
    return (
      context.emphasisLevel === 'strong' &&
      context.emotionalWeight !== undefined &&
      context.emotionalWeight >= 7 &&
      context.motionCurve === 'deliberate'
    );
  }
  
  /**
   * Check soft-pop eligibility
   * 
   * Use for:
   * - diagram highlights
   * - key labels
   * - important nodes
   * 
   * Avoid if already intense (push + swift)
   */
  private static isSoftPopEligible(context: InteractionContext): boolean {
    // Avoid if already intense (stack conflict prevention)
    if (context.cameraMovement === 'push' && context.motionCurve === 'swift') {
      return false;
    }
    
    return (
      context.isDiagram === true &&
      context.emphasisLevel === 'strong'
    );
  }
  
  /**
   * Check breathe eligibility
   * 
   * Use ONLY when:
   * - calm scenes
   * - wide shots
   * - low density
   * 
   * Never combine with push camera
   */
  private static isBreatheEligible(context: InteractionContext): boolean {
    // Never combine with push
    if (context.cameraMovement === 'push') {
      return false;
    }
    
    return (
      context.motionCurve === 'gentle' &&
      context.cameraShot === 'wide' &&
      context.density !== undefined &&
      context.density < 4
    );
  }
}
