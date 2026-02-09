/**
 * Scarcity Protector
 * 
 * Enforces the golden rule: Strong emphasis should rarely exceed 10-15% of scenes.
 * 
 * CRITICAL: This is cinematic physiology.
 * - More than 15% = fatigue, everything feels important (nothing is)
 * - Less than 10% = flat, no peaks
 * - 10-15% = ideal, peaks feel special
 * 
 * For a 26-scene video: 2-4 peaks is ideal.
 */

import { SceneRhythm } from './rhythm-types';

export class ScarcityProtector {
  /**
   * Calculate ideal strong emphasis count for a given scene count.
   * 
   * Rule: 10-15% of scenes should have strong emphasis.
   */
  static getIdealStrongCount(totalScenes: number): { min: number; max: number; target: number } {
    const min = Math.ceil(totalScenes * 0.10);  // 10% minimum
    const max = Math.floor(totalScenes * 0.15); // 15% maximum
    const target = Math.round(totalScenes * 0.12); // 12% target (sweet spot)
    
    return { min, max, target };
  }

  /**
   * Check if strong emphasis count exceeds safe threshold.
   * Returns true if we're in the fatigue zone (>15%).
   */
  static isFatigueZone(strongCount: number, totalScenes: number): boolean {
    const percentage = (strongCount / totalScenes) * 100;
    return percentage > 15;
  }

  /**
   * Check if strong emphasis count is below minimum threshold.
   * Returns true if we're in the flat zone (<10%).
   */
  static isFlatZone(strongCount: number, totalScenes: number): boolean {
    const percentage = (strongCount / totalScenes) * 100;
    return percentage < 10;
  }

  /**
   * Get current strong emphasis percentage.
   */
  static getStrongPercentage(strongCount: number, totalScenes: number): number {
    return (strongCount / totalScenes) * 100;
  }

  /**
   * Enforce scarcity by downgrading excess strong emphasis.
   * 
   * If we have too many strong emphasis (>15%), downgrade the weakest ones.
   * This prevents fatigue and maintains the special nature of peaks.
   */
  static enforceScarcity(
    scenes: SceneRhythm[],
    emotionalWeights: number[]
  ): { adjustments: number; downgradedScenes: number[] } {
    const totalScenes = scenes.length;
    const { max } = this.getIdealStrongCount(totalScenes);
    
    // Count current strong emphasis
    const strongScenes = scenes
      .map((scene, index) => ({ scene, index, emotion: emotionalWeights[index] }))
      .filter(({ scene }) => scene.suggestedEmphasis === 'strong');
    
    const strongCount = strongScenes.length;
    
    // If within limits, no action needed
    if (strongCount <= max) {
      return { adjustments: 0, downgradedScenes: [] };
    }
    
    // We have too many strong emphasis - need to downgrade
    const excessCount = strongCount - max;
    
    // Sort by emotional weight (weakest first)
    const sortedByEmotion = [...strongScenes].sort((a, b) => a.emotion - b.emotion);
    
    // Downgrade the weakest excess scenes
    const downgradedScenes: number[] = [];
    for (let i = 0; i < excessCount; i++) {
      const { scene, index, emotion } = sortedByEmotion[i];
      scene.suggestedEmphasis = 'soft';
      scene.adjustmentReason = 
        `[SCARCITY] Downgraded to protect scarcity (${strongCount} strong > ${max} max, emotion: ${emotion} - weakest in set)`;
      downgradedScenes.push(index);
    }
    
    return { adjustments: excessCount, downgradedScenes };
  }

  /**
   * Get scarcity report for logging/debugging.
   */
  static getScarcityReport(scenes: SceneRhythm[], totalScenes: number): {
    strongCount: number;
    percentage: number;
    ideal: { min: number; max: number; target: number };
    status: 'flat' | 'ideal' | 'fatigue';
    recommendation: string;
  } {
    const strongCount = scenes.filter(s => s.suggestedEmphasis === 'strong').length;
    const percentage = this.getStrongPercentage(strongCount, totalScenes);
    const ideal = this.getIdealStrongCount(totalScenes);
    
    let status: 'flat' | 'ideal' | 'fatigue';
    let recommendation: string;
    
    if (this.isFatigueZone(strongCount, totalScenes)) {
      status = 'fatigue';
      recommendation = `Too many peaks (${strongCount}). Downgrade weakest to ${ideal.max}.`;
    } else if (this.isFlatZone(strongCount, totalScenes)) {
      status = 'flat';
      recommendation = `Too few peaks (${strongCount}). Consider elevating strongest candidates to ${ideal.min}.`;
    } else {
      status = 'ideal';
      recommendation = `Peak count (${strongCount}) is in ideal range.`;
    }
    
    return { strongCount, percentage, ideal, status, recommendation };
  }

  /**
   * Validate that scarcity is maintained.
   * Throws warning if violated.
   */
  static validateScarcity(scenes: SceneRhythm[], totalScenes: number): void {
    const report = this.getScarcityReport(scenes, totalScenes);
    
    if (report.status === 'fatigue') {
      console.warn(
        `\n⚠️  [SCARCITY WARNING]\n` +
        `   Strong emphasis: ${report.strongCount} (${report.percentage.toFixed(1)}%)\n` +
        `   Maximum safe: ${report.ideal.max} (15%)\n` +
        `   Status: FATIGUE ZONE\n` +
        `   Impact: Peaks lose special nature, viewer fatigue\n` +
        `   Recommendation: ${report.recommendation}\n`
      );
    } else if (report.status === 'flat') {
      console.warn(
        `\n⚠️  [SCARCITY WARNING]\n` +
        `   Strong emphasis: ${report.strongCount} (${report.percentage.toFixed(1)}%)\n` +
        `   Minimum recommended: ${report.ideal.min} (10%)\n` +
        `   Status: FLAT ZONE\n` +
        `   Impact: No peaks, monotonous flow\n` +
        `   Recommendation: ${report.recommendation}\n`
      );
    }
  }
}
