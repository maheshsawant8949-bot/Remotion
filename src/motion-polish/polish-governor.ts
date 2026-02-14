/**
 * Polish Governor
 * 
 * VERY IMPORTANT:
 * - Prevent duration inflation
 * - Prevent slow stacking
 * - Prevent speed jitter
 * 
 * Viewers feel drag faster than you expect.
 * Smooth timing = premium feel.
 * Erratic timing = automation feel.
 */

import { DURATION_LIMITS } from './duration-system';

/**
 * Polish Governor
 */
export class PolishGovernor {
  /**
   * Prevent duration inflation
   * 
   * If average duration > 500ms → compress globally.
   */
  static preventInflation(durations: number[]): number[] {
    if (durations.length === 0) return durations;
    
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    if (avg > DURATION_LIMITS.avgDurationTarget) {
      const compressionRatio = DURATION_LIMITS.avgDurationTarget / avg;
      
      return durations.map(d => 
        Math.max(DURATION_LIMITS.minDuration, Math.round(d * compressionRatio))
      );
    }
    
    return durations;
  }
  
  /**
   * Prevent slow stacking
   * 
   * Detect consecutive deliberate motions → force next to standard.
   * Viewers feel drag faster than you expect.
   */
  static preventSlowStacking(curves: string[]): string[] {
    const adjusted = [...curves];
    let deliberateStreak = 0;
    
    for (let i = 0; i < adjusted.length; i++) {
      if (adjusted[i] === 'deliberate') {
        deliberateStreak++;
        
        // If 2+ consecutive deliberate, force next to confident
        if (deliberateStreak >= 2 && i + 1 < adjusted.length) {
          adjusted[i + 1] = 'confident';
          deliberateStreak = 0;
        }
      } else {
        deliberateStreak = 0;
      }
    }
    
    return adjusted;
  }
  
  /**
   * Prevent speed jitter
   * 
   * If durations vary wildly scene-to-scene → normalize.
   * Smooth timing = premium feel.
   */
  static preventJitter(durations: number[]): number[] {
    if (durations.length < 2) return durations;
    
    const normalized = [...durations];
    
    for (let i = 1; i < normalized.length; i++) {
      const prev = normalized[i - 1];
      const curr = normalized[i];
      const ratio = Math.max(prev, curr) / Math.min(prev, curr);
      
      // If ratio > 2.5x, smooth it
      if (ratio > 2.5) {
        normalized[i] = Math.round((prev + curr) / 2);
      }
    }
    
    return normalized;
  }
  
  /**
   * Get timing health report
   */
  static getTimingHealth(durations: number[]): {
    avgDuration: number;
    isHealthy: boolean;
    issues: string[];
  } {
    if (durations.length === 0) {
      return { avgDuration: 0, isHealthy: true, issues: [] };
    }
    
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const issues: string[] = [];
    
    // Check inflation
    if (avg > DURATION_LIMITS.avgDurationTarget) {
      issues.push(`Average duration ${avg.toFixed(0)}ms exceeds ${DURATION_LIMITS.avgDurationTarget}ms target`);
    }
    
    // Check jitter
    let maxRatio = 1;
    for (let i = 1; i < durations.length; i++) {
      const prev = durations[i - 1];
      const curr = durations[i];
      const ratio = Math.max(prev, curr) / Math.min(prev, curr);
      maxRatio = Math.max(maxRatio, ratio);
    }
    
    if (maxRatio > 2.5) {
      issues.push(`Speed jitter detected (max ratio ${maxRatio.toFixed(1)}x)`);
    }
    
    return {
      avgDuration: avg,
      isHealthy: issues.length === 0,
      issues,
    };
  }
}
