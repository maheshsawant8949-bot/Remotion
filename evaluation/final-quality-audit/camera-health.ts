/**
 * Camera Health Checker
 * 
 * Detect:
 * - tight shot streak > 2
 * - push frequency > 10%
 * - movement ratio > 40%
 * 
 * Too much camera activity instantly looks automated.
 */

/**
 * Camera Health Report
 */
export interface CameraHealthReport {
  isHealthy: boolean;
  issues: string[];
  tightStreak: number;
  pushFrequency: number;
  movementRatio: number;
}

/**
 * Camera Health Checker
 */
export class CameraHealthChecker {
  /**
   * Check camera health across all scenes
   */
  static check(scenes: any[]): CameraHealthReport {
    const issues: string[] = [];
    
    // Check tight shot streak
    let maxTightStreak = 0;
    let currentStreak = 0;
    for (const scene of scenes) {
      if (scene.trace?.cameraShot?.type === 'tight') {
        currentStreak++;
        maxTightStreak = Math.max(maxTightStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    if (maxTightStreak > 2) {
      issues.push(`Tight shot streak ${maxTightStreak} exceeds 2`);
    }
    
    // Check push frequency
    const pushCount = scenes.filter(s => s.trace?.cameraMovement?.type === 'push').length;
    const pushFrequency = scenes.length > 0 ? pushCount / scenes.length : 0;
    
    if (pushFrequency > 0.10) {
      issues.push(`Push frequency ${(pushFrequency * 100).toFixed(1)}% exceeds 10%`);
    }
    
    // Check movement ratio
    const movementCount = scenes.filter(
      s => s.trace?.cameraMovement?.type !== 'static' && s.trace?.cameraMovement?.type !== undefined
    ).length;
    const movementRatio = scenes.length > 0 ? movementCount / scenes.length : 0;
    
    if (movementRatio > 0.40) {
      issues.push(`Movement ratio ${(movementRatio * 100).toFixed(1)}% exceeds 40% (too much camera activity)`);
    }
    
    return {
      isHealthy: issues.length === 0,
      issues,
      tightStreak: maxTightStreak,
      pushFrequency,
      movementRatio,
    };
  }
}
