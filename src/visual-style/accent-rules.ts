/**
 * Accent Rules
 * 
 * CRITICAL: Most systems destroy themselves here.
 * 
 * Accent is attention currency. Do not inflate it.
 * Cap: accent coverage < 8-10% of screen
 */

/**
 * Accent Usage Rules
 */
export const ACCENT_USAGE = {
  allowedContexts: [
    'strong-emphasis',
    'key-stat',
    'active-focus',
    'diagram-highlight',
  ],
  maxCoverage: 0.10,  // 10% max
  targetCoverage: 0.08,  // 8% target
} as const;

/**
 * Accent Context
 */
export interface AccentContext {
  emphasisLevel?: string;
  isKeyStat?: boolean;
  isFocused?: boolean;
  isDiagramHighlight?: boolean;
}

/**
 * Accent Guard
 */
export class AccentGuard {
  /**
   * Check if accent is allowed
   * 
   * Accent allowed ONLY when:
   * - strong emphasis
   * - key stat
   * - active focus
   * - diagram highlight
   */
  static isAccentAllowed(context: AccentContext): boolean {
    return (
      context.emphasisLevel === 'strong' ||
      context.isKeyStat === true ||
      context.isFocused === true ||
      context.isDiagramHighlight === true
    );
  }
  
  /**
   * Validate accent coverage
   */
  static validateAccentCoverage(accentCount: number, totalElements: number): void {
    if (totalElements === 0) return;
    
    const coverage = accentCount / totalElements;
    
    if (coverage > ACCENT_USAGE.maxCoverage) {
      throw new Error(
        `Accent coverage ${(coverage * 100).toFixed(1)}% exceeds ${ACCENT_USAGE.maxCoverage * 100}% limit`
      );
    }
  }
  
  /**
   * Get accent coverage report
   */
  static getAccentCoverageReport(accentCount: number, totalElements: number): {
    coverage: number;
    isHealthy: boolean;
    message: string;
  } {
    if (totalElements === 0) {
      return { coverage: 0, isHealthy: true, message: 'No elements' };
    }
    
    const coverage = accentCount / totalElements;
    const isHealthy = coverage <= ACCENT_USAGE.targetCoverage;
    
    return {
      coverage,
      isHealthy,
      message: isHealthy
        ? `Accent coverage ${(coverage * 100).toFixed(1)}% is healthy`
        : `Accent coverage ${(coverage * 100).toFixed(1)}% exceeds ${ACCENT_USAGE.targetCoverage * 100}% target`,
    };
  }
}
