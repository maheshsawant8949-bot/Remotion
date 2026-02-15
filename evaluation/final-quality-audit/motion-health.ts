/**
 * Motion Health Checker
 * 
 * Check:
 * - kinetic streak > 2
 * - average duration > 500ms
 * - curve volatility > 0.45
 * 
 * Smoothness = premium.
 */

/**
 * Motion Health Report
 */
export interface MotionHealthReport {
  isHealthy: boolean;
  issues: string[];
  kineticStreak: number;
  avgDuration: number;
  curveVolatility: number;
}

/**
 * Motion Health Checker
 */
export class MotionHealthChecker {
  /**
   * Check motion health across all scenes
   */
  static check(scenes: any[]): MotionHealthReport {
    const issues: string[] = [];
    
    // Check kinetic streak
    let maxKineticStreak = 0;
    let currentStreak = 0;
    for (const scene of scenes) {
      if (scene.trace?.motionBehavior?.type === 'kinetic') {
        currentStreak++;
        maxKineticStreak = Math.max(maxKineticStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    if (maxKineticStreak > 2) {
      issues.push(`Kinetic streak ${maxKineticStreak} exceeds 2 (smoothness = premium)`);
    }
    
    // Check average duration
    const durations = scenes
      .map(s => s.duration || 0)
      .filter(d => d > 0);
    
    const avgDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;
    
    if (avgDuration > 500) {
      issues.push(`Average duration ${avgDuration.toFixed(0)}ms exceeds 500ms`);
    }
    
    // Check curve volatility
    const curves = scenes.map(s => s.trace?.motionCurve?.type || 'gentle');
    let volatilityCount = 0;
    for (let i = 1; i < curves.length; i++) {
      if (curves[i] !== curves[i - 1]) {
        volatilityCount++;
      }
    }
    const curveVolatility = curves.length > 1 ? volatilityCount / (curves.length - 1) : 0;
    
    if (curveVolatility > 0.45) {
      issues.push(`Curve volatility ${(curveVolatility * 100).toFixed(1)}% exceeds 45%`);
    }
    
    return {
      isHealthy: issues.length === 0,
      issues,
      kineticStreak: maxKineticStreak,
      avgDuration,
      curveVolatility,
    };
  }
}
