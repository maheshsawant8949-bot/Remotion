/**
 * Cinematic Transition Resolver V2
 * 
 * Replaces old transition resolver.
 * Single source of truth for transition selection.
 * 
 * Energy-aware, camera-aware, motion-aware, rhythm-aware.
 * 
 * DOES NOT define wipes, directions, zoom transitions, or morphs.
 * Those belong in style phase — not intelligence.
 */

import { CinematicTransition, CinematicTransitionResult, EnergyComputer, TRANSITION_LIMITS } from './transition-energy';
import { ContinuityDetector } from './transition-continuity';

/**
 * Transition Context
 */
export interface TransitionContext {
  currentScene: any;
  nextScene: any;
  
  // State for inflation protection
  totalScenes: number;
  matchCutCount: number;
  holdCutCount: number;
  easeThroughCount: number;
}

/**
 * Cinematic Transition Resolver V2
 */
export class CinematicTransitionResolver {
  /**
   * Resolve transition between scenes
   * 
   * Priority order:
   * 1. Hold-cut (post-peak emotional release)
   * 2. Match-cut (continuity detected)
   * 3. Energy delta logic
   * 4. Ease-through (gradual escalation)
   * 5. Soft-cut (minimal delta)
   * 6. Cut (default)
   */
  static resolve(context: TransitionContext): CinematicTransitionResult {
    const { currentScene, nextScene } = context;
    
    // Compute energy delta
    const energyDelta = EnergyComputer.computeEnergyDelta(currentScene, nextScene);
    
    // Check continuity
    const hasContinuity = ContinuityDetector.hasContinuity(currentScene, nextScene);
    
    // Get scene properties
    const currentMotion = currentScene.trace?.motionBehavior?.behavior || 'calm';
    const nextMotion = nextScene.trace?.motionBehavior?.behavior || 'calm';
    const currentCurve = currentScene.trace?.motionCurve?.type || 'gentle';
    const nextCurve = nextScene.trace?.motionCurve?.type || 'gentle';
    const isPostPeak = currentScene.trace?.emphasis?.level === 'strong';
    const emotionalWeight = currentScene.trace?.emotionalAnalysis?.score || 0;
    
    // ========================================================================
    // STEP 1: Hold-cut eligibility (post-peak, high emotion)
    // ========================================================================
    // Micro pause before cutting - lets brain absorb
    // Most automated systems NEVER do this
    if (isPostPeak && currentCurve === 'deliberate' && emotionalWeight >= 7) {
      const holdCutRatio = context.holdCutCount / context.totalScenes;
      
      if (holdCutRatio < TRANSITION_LIMITS.holdCut) {
        return {
          type: 'hold-cut',
          reason: `Post-peak emotional release (emotion ${emotionalWeight}/10, deliberate curve)`,
        };
      }
    }
    
    // ========================================================================
    // STEP 2: Match-cut eligibility (continuity detected)
    // ========================================================================
    // Creates subconscious continuity - HIGH VALUE
    if (hasContinuity) {
      const matchCutRatio = context.matchCutCount / context.totalScenes;
      
      if (matchCutRatio < TRANSITION_LIMITS.matchCut) {
        const reason = ContinuityDetector.getContinuityReason(currentScene, nextScene);
        return {
          type: 'match-cut',
          reason,
        };
      }
    }
    
    // ========================================================================
    // STEP 3: Energy delta logic
    // ========================================================================
    // Large positive delta → cut (let scene carry intensity)
    if (energyDelta > 3) {
      return {
        type: 'cut',
        reason: `Large energy increase (+${energyDelta}) - let scene carry intensity`,
      };
    }
    
    // Large negative delta → hold-cut (emotional release)
    if (energyDelta < -3) {
      const holdCutRatio = context.holdCutCount / context.totalScenes;
      
      if (holdCutRatio < TRANSITION_LIMITS.holdCut) {
        return {
          type: 'hold-cut',
          reason: `Large energy decrease (${energyDelta}) - emotional release`,
        };
      }
      
      // Fallback to cut if hold-cut quota exceeded
      return {
        type: 'cut',
        reason: `Energy decrease (${energyDelta}), hold-cut quota exceeded`,
      };
    }
    
    // ========================================================================
    // STEP 4: Ease-through eligibility (gradual escalation)
    // ========================================================================
    const isEscalating = 
      (currentMotion === 'calm' && (nextMotion === 'assertive' || nextMotion === 'energetic')) ||
      (currentCurve === 'gentle' && (nextCurve === 'confident' || nextCurve === 'swift'));
    
    if (isEscalating) {
      const easeThroughRatio = context.easeThroughCount / context.totalScenes;
      
      if (easeThroughRatio < TRANSITION_LIMITS.easeThrough) {
        return {
          type: 'ease-through',
          reason: `Gradual escalation (${currentMotion} → ${nextMotion})`,
        };
      }
    }
    
    // ========================================================================
    // STEP 5: Soft-cut eligibility (minimal delta)
    // ========================================================================
    // Low energy shift - invisible transition
    if (Math.abs(energyDelta) <= 1 && currentMotion === 'calm' && nextMotion === 'calm') {
      return {
        type: 'soft-cut',
        reason: 'Low energy shift (calm → calm)',
      };
    }
    
    // ========================================================================
    // DEFAULT: Cut
    // ========================================================================
    // Cuts are premium. Fast cognition prefers cuts.
    return {
      type: 'cut',
      reason: 'Default (cuts are premium)',
    };
  }
}
