
import { RiskProfile } from './risk-detector';
import { StressReport } from './stress-test-engine';
import { ConfidenceLevel } from './confidence-router';

export interface QualityDecision {
  status: 'approved' | 'warning' | 'rejected';
  score: number;
  blockers: string[];
}

export class QualityGate {
  /**
   * Final quality audit
   */
  static decide(
    riskProfile: RiskProfile,
    stressReport: StressReport,
    confidence: ConfidenceLevel
  ): QualityDecision {
    let score = 100;
    const blockers: string[] = [];

    // Deduct for Risks
    score -= riskProfile.visualChaosScore * 2;
    score -= riskProfile.cognitiveLoadScore * 3; // Heavy penalty
    score -= riskProfile.styleDriftScore * 2;

    // Deduct for Stress Failures
    if (stressReport.pacingCollapse) score -= 15;
    if (stressReport.highEmotionStacking) score -= 10;
    if (stressReport.minimalScriptEmptiness) score -= 10;

    // Deduct for Low Confidence
    if (confidence === 'low') score -= 20;
    if (confidence === 'medium') score -= 5;

    // Blocking Conditions (Safety Governors)
    if (riskProfile.cognitiveLoadScore > 8) {
      blockers.push("CRITICAL: Cognitive Overload too high");
    }
    if (score < 60) {
      blockers.push("CRITICAL: Overall Quality Score too low");
    }

    let status: QualityDecision['status'] = 'approved';
    if (score < 75 || blockers.length > 0) status = 'rejected';
    else if (score < 85) status = 'warning';

    return {
      status,
      score,
      blockers
    };
  }
}
