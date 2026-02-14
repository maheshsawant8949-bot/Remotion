/**
 * Interaction Governor
 * 
 * CRITICAL safeguards:
 * - Prevent inflation
 * - Prevent stack conflicts
 * - Prevent emotional violations
 * - Prevent jitter
 */

import { MicroInteractionResult } from './interaction-types';
import { INTERACTION_LIMITS } from './interaction-principles';

/**
 * Interaction Governor
 */
export class InteractionGovernor {
  /**
   * Prevent stack conflicts
   * 
   * Detect:
   * - push camera + swift curve + soft-pop
   * 
   * If found: Remove the micro-interaction FIRST.
   * Movement layers outrank micro details.
   */
  static preventStackConflicts(
    scene: {
      trace?: {
        cameraMovement?: { type: string };
        motionCurve?: { type: string };
      };
    },
    interaction: MicroInteractionResult
  ): MicroInteractionResult {
    const isPush = scene.trace?.cameraMovement?.type === 'push';
    const isSwift = scene.trace?.motionCurve?.type === 'swift';
    const isSoftPop = interaction.type === 'soft-pop';
    
    if (isPush && isSwift && isSoftPop) {
      return {
        type: 'none',
        reason: 'Stack conflict (push + swift + soft-pop - movement layers outrank micro details)',
      };
    }
    
    return interaction;
  }
  
  /**
   * Prevent emotional violations
   * 
   * If emotion == high:
   * - Avoid: soft-pop, breathe
   * - Prefer: linger
   * 
   * Respect tone.
   */
  static preventEmotionalViolations(
    context: { emotionalWeight?: number },
    interaction: MicroInteractionResult
  ): MicroInteractionResult {
    if (context.emotionalWeight && context.emotionalWeight >= 7) {
      if (interaction.type === 'soft-pop' || interaction.type === 'breathe') {
        return {
          type: 'none',
          reason: 'Emotional violation (high emotion - avoid soft-pop/breathe, respect tone)',
        };
      }
    }
    
    return interaction;
  }
  
  /**
   * Prevent jitter
   * 
   * If interaction switching becomes frequent:
   * - Bias toward: settle
   * 
   * Stability feels premium.
   */
  static preventJitter(
    recentInteractions: string[],
    interaction: MicroInteractionResult
  ): MicroInteractionResult {
    if (recentInteractions.length < 3) return interaction;
    
    // Check if last 3 interactions are all different
    const last3 = recentInteractions.slice(-3);
    const uniqueCount = new Set(last3).size;
    
    if (uniqueCount === 3 && interaction.type !== 'none') {
      return {
        type: 'settle',
        reason: 'Jitter prevention (frequent switching - stability feels premium)',
      };
    }
    
    return interaction;
  }
  
  /**
   * Get interaction health report
   */
  static getInteractionHealth(
    counts: Record<string, number>,
    totalScenes: number
  ): {
    interactionRatio: number;
    isHealthy: boolean;
    issues: string[];
  } {
    if (totalScenes === 0) {
      return { interactionRatio: 0, isHealthy: true, issues: [] };
    }
    
    const interactionCount = totalScenes - (counts.none || 0);
    const interactionRatio = interactionCount / totalScenes;
    const issues: string[] = [];
    
    // Check inflation
    if (interactionRatio > INTERACTION_LIMITS.maxInteractionRatio) {
      issues.push(
        `Interaction ratio ${(interactionRatio * 100).toFixed(1)}% exceeds ${INTERACTION_LIMITS.maxInteractionRatio * 100}% limit`
      );
    }
    
    // Check individual caps
    const settleRatio = (counts.settle || 0) / totalScenes;
    if (settleRatio > 0.20) {
      issues.push(`Settle ratio ${(settleRatio * 100).toFixed(1)}% exceeds 20% cap`);
    }
    
    const lingerRatio = (counts.linger || 0) / totalScenes;
    if (lingerRatio > 0.15) {
      issues.push(`Linger ratio ${(lingerRatio * 100).toFixed(1)}% exceeds 15% cap`);
    }
    
    const softPopRatio = (counts['soft-pop'] || 0) / totalScenes;
    if (softPopRatio > 0.10) {
      issues.push(`Soft-pop ratio ${(softPopRatio * 100).toFixed(1)}% exceeds 10% cap`);
    }
    
    const breatheRatio = (counts.breathe || 0) / totalScenes;
    if (breatheRatio > 0.08) {
      issues.push(`Breathe ratio ${(breatheRatio * 100).toFixed(1)}% exceeds 8% cap`);
    }
    
    return {
      interactionRatio,
      isHealthy: issues.length === 0,
      issues,
    };
  }
}
