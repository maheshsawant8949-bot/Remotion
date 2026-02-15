/**
 * Intensity Balance Checker
 * 
 * Check overall intensity distribution:
 * - Transition health (match-cut, hold-cut caps)
 * - Accent inflation
 * - Interaction noise
 */

/**
 * Intensity Balance Report
 */
export interface IntensityBalanceReport {
  isHealthy: boolean;
  issues: string[];
  transitionHealth: {
    matchCutRatio: number;
    holdCutRatio: number;
  };
  accentCoverage?: number;
  interactionRatio: number;
}

/**
 * Intensity Balance Checker
 */
export class IntensityBalanceChecker {
  /**
   * Check intensity balance
   */
  static check(scenes: any[]): IntensityBalanceReport {
    const issues: string[] = [];
    
    // Check transition health
    const matchCutCount = scenes.filter(
      s => s.trace?.cinematicTransition?.type === 'match-cut'
    ).length;
    const holdCutCount = scenes.filter(
      s => s.trace?.cinematicTransition?.type === 'hold-cut'
    ).length;
    
    const matchCutRatio = scenes.length > 0 ? matchCutCount / scenes.length : 0;
    const holdCutRatio = scenes.length > 0 ? holdCutCount / scenes.length : 0;
    
    if (matchCutRatio > 0.15) {
      issues.push(`Match-cut ratio ${(matchCutRatio * 100).toFixed(1)}% exceeds 15% (transitions should disappear)`);
    }
    
    if (holdCutRatio > 0.08) {
      issues.push(`Hold-cut ratio ${(holdCutRatio * 100).toFixed(1)}% exceeds 8%`);
    }
    
    // Check interaction noise
    const interactionCount = scenes.filter(
      s => s.trace?.microInteraction?.type !== 'none' && s.trace?.microInteraction?.type !== undefined
    ).length;
    const interactionRatio = scenes.length > 0 ? interactionCount / scenes.length : 0;
    
    if (interactionRatio > 0.45) {
      issues.push(
        `Micro-interaction ratio ${(interactionRatio * 100).toFixed(1)}% exceeds 45% (over-animation destroys maturity)`
      );
    }
    
    return {
      isHealthy: issues.length === 0,
      issues,
      transitionHealth: {
        matchCutRatio,
        holdCutRatio,
      },
      interactionRatio,
    };
  }
}
