
/**
 * Confidence Router
 * 
 * Every major subsystem must output confidence:
 * - assetConfidence
 * - aiConfidence
 * - proceduralConfidence
 * - alignmentConfidence
 * 
 * Routes behavior:
 * If HIGH → proceed normally.
 * If MEDIUM → simplify visuals.
 * If LOW → switch strategy.
 */

export interface SystemConfidence {
  assetConfidence: number;      // 0-1
  aiConfidence: number;         // 0-1
  proceduralConfidence: number; // 0-1
  alignmentConfidence: number;  // 0-1
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export class ConfidenceRouter {
  private static HIGH_THRESHOLD = 0.8;
  private static LOW_THRESHOLD = 0.5;

  /**
   * Evaluate overall system confidence
   */
  static evaluate(scores: SystemConfidence): ConfidenceLevel {
    // Weighted average
    const weightedScore = (
      scores.assetConfidence * 0.4 +
      scores.aiConfidence * 0.3 +
      scores.proceduralConfidence * 0.2 +
      scores.alignmentConfidence * 0.1
    );

    if (weightedScore >= this.HIGH_THRESHOLD) return 'high';
    if (weightedScore >= this.LOW_THRESHOLD) return 'medium';
    return 'low';
  }

  /**
   * Determine action based on component confidence
   */
  static routeAction(
    component: keyof SystemConfidence,
    score: number
  ): 'proceed' | 'simplify' | 'fallback' {
    if (score >= this.HIGH_THRESHOLD) return 'proceed';
    if (score >= this.LOW_THRESHOLD) return 'simplify';
    return 'fallback';
  }
}
