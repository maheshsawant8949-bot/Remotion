/**
 * Cognitive Recovery Detector
 * 
 * Ensures proper tension/relief alternation in narrative flow.
 * 
 * CRITICAL: Great storytelling alternates tension and relief.
 * After a strong emphasis → prefer calmer scene unless signals demand otherwise.
 * 
 * Breathing room increases perceived drama.
 * This is a director-level principle.
 */

import { SceneRhythm } from './rhythm-types';

export class CognitiveRecoveryDetector {
  /**
   * Detect if a scene should be a recovery moment.
   * 
   * Recovery is needed after strong emphasis to:
   * - Give viewer breathing room
   * - Increase perceived drama of peaks
   * - Prevent emotional exhaustion
   * 
   * @param sceneIndex - Current scene index
   * @param scenes - All scene rhythm data
   * @param emotionalWeights - Emotional weights for all scenes
   * @returns true if this scene should be recovery
   */
  static isRecoveryNeeded(
    sceneIndex: number,
    scenes: SceneRhythm[],
    emotionalWeights: number[]
  ): boolean {
    // Can't be recovery if it's the first scene
    if (sceneIndex === 0) return false;
    
    // Check if previous scene was strong emphasis
    const prevScene = scenes[sceneIndex - 1];
    const prevWasStrong = prevScene.suggestedEmphasis === 'strong';
    
    if (!prevWasStrong) return false;
    
    // Previous scene was strong - recovery is beneficial
    // UNLESS current scene has very strong signals that demand emphasis
    const currentEmotion = emotionalWeights[sceneIndex];
    const OVERRIDE_THRESHOLD = 7; // Only override recovery if emotion is very high
    
    // If current scene has very strong emotion, allow it (earned peak)
    if (currentEmotion >= OVERRIDE_THRESHOLD) {
      return false; // Strong signals override recovery need
    }
    
    // Otherwise, recovery is beneficial
    return true;
  }

  /**
   * Enforce cognitive recovery after strong emphasis.
   * 
   * Downgrades scenes immediately after strong emphasis to provide breathing room,
   * unless the scene has very strong signals that justify emphasis.
   * 
   * @returns Number of adjustments made
   */
  static enforceRecovery(
    scenes: SceneRhythm[],
    emotionalWeights: number[]
  ): { adjustments: number; recoveryScenes: number[] } {
    let adjustments = 0;
    const recoveryScenes: number[] = [];
    
    for (let i = 1; i < scenes.length; i++) {
      const scene = scenes[i];
      
      // Check if recovery is needed
      if (!this.isRecoveryNeeded(i, scenes, emotionalWeights)) {
        continue;
      }
      
      // Recovery is needed - check if current scene has emphasis
      if (scene.suggestedEmphasis !== 'none') {
        // Downgrade to provide breathing room
        const originalEmphasis = scene.suggestedEmphasis;
        scene.suggestedEmphasis = 'none';
        scene.adjustmentReason = 
          `[RECOVERY] Downgraded from ${originalEmphasis} to provide cognitive recovery after strong emphasis (emotion: ${emotionalWeights[i]} < 7)`;
        adjustments++;
        recoveryScenes.push(i);
      }
    }
    
    return { adjustments, recoveryScenes };
  }

  /**
   * Detect tension/relief pattern in sequence.
   * Returns analysis of alternation quality.
   */
  static analyzeAlternation(scenes: SceneRhythm[]): {
    hasAlternation: boolean;
    consecutiveStrongCount: number;
    longestTensionStretch: number;
    recoveryMoments: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  } {
    let consecutiveStrong = 0;
    let maxConsecutiveStrong = 0;
    let recoveryMoments = 0;
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      if (scene.suggestedEmphasis === 'strong') {
        consecutiveStrong++;
        maxConsecutiveStrong = Math.max(maxConsecutiveStrong, consecutiveStrong);
      } else {
        // Check if this is a recovery moment (follows strong)
        if (i > 0 && scenes[i - 1].suggestedEmphasis === 'strong') {
          recoveryMoments++;
        }
        consecutiveStrong = 0;
      }
    }
    
    // Determine quality
    let quality: 'poor' | 'fair' | 'good' | 'excellent';
    
    if (maxConsecutiveStrong >= 3) {
      quality = 'poor'; // Too much consecutive tension
    } else if (maxConsecutiveStrong === 2) {
      quality = 'fair'; // Some consecutive tension
    } else if (recoveryMoments >= 2) {
      quality = 'excellent'; // Good alternation
    } else {
      quality = 'good'; // Decent alternation
    }
    
    return {
      hasAlternation: recoveryMoments > 0,
      consecutiveStrongCount: maxConsecutiveStrong,
      longestTensionStretch: maxConsecutiveStrong,
      recoveryMoments,
      quality,
    };
  }

  /**
   * Get recovery report for logging/debugging.
   */
  static getRecoveryReport(
    scenes: SceneRhythm[],
    emotionalWeights: number[]
  ): {
    recoveryNeeded: number[];
    recoveryProvided: number[];
    missedRecoveries: number[];
    recommendation: string;
  } {
    const recoveryNeeded: number[] = [];
    const recoveryProvided: number[] = [];
    const missedRecoveries: number[] = [];
    
    for (let i = 1; i < scenes.length; i++) {
      if (this.isRecoveryNeeded(i, scenes, emotionalWeights)) {
        recoveryNeeded.push(i);
        
        if (scenes[i].suggestedEmphasis === 'none') {
          recoveryProvided.push(i);
        } else {
          missedRecoveries.push(i);
        }
      }
    }
    
    let recommendation: string;
    if (missedRecoveries.length === 0) {
      recommendation = 'All recovery moments provided. Good tension/relief alternation.';
    } else if (missedRecoveries.length <= 2) {
      recommendation = `${missedRecoveries.length} missed recovery moment(s). Consider downgrading scenes: ${missedRecoveries.join(', ')}`;
    } else {
      recommendation = `${missedRecoveries.length} missed recovery moments. Too much consecutive tension.`;
    }
    
    return {
      recoveryNeeded,
      recoveryProvided,
      missedRecoveries,
      recommendation,
    };
  }

  /**
   * Validate that cognitive recovery is respected.
   * Logs warnings if violated.
   */
  static validateRecovery(scenes: SceneRhythm[], emotionalWeights: number[]): void {
    const report = this.getRecoveryReport(scenes, emotionalWeights);
    const alternation = this.analyzeAlternation(scenes);
    
    if (report.missedRecoveries.length > 0) {
      console.warn(
        `\n⚠️  [COGNITIVE RECOVERY WARNING]\n` +
        `   Missed recovery moments: ${report.missedRecoveries.length}\n` +
        `   Scenes needing recovery: ${report.missedRecoveries.join(', ')}\n` +
        `   Impact: Viewer fatigue, reduced peak impact\n` +
        `   Recommendation: ${report.recommendation}\n`
      );
    }
    
    if (alternation.quality === 'poor') {
      console.warn(
        `\n⚠️  [TENSION/RELIEF WARNING]\n` +
        `   Alternation quality: ${alternation.quality}\n` +
        `   Longest tension stretch: ${alternation.longestTensionStretch} consecutive strong\n` +
        `   Recovery moments: ${alternation.recoveryMoments}\n` +
        `   Impact: Emotional exhaustion, diminished drama\n` +
        `   Principle: Great storytelling alternates tension and relief\n`
      );
    }
  }
}
