export interface CognitiveSignals {
  visualElements: number;
  numberCount: number;
  hasComparison: boolean;
  calloutCount: number;
  textLength: number;
}

export interface CognitiveLoadResult {
  totalScore: number;
  recommendation: 'maintain' | 'slow_down' | 'split';
  details: string; // Explains what contributed to high load
}

export function calculateCognitiveLoad(signals: CognitiveSignals): CognitiveLoadResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Visual Elements (+1 each)
  if (signals.visualElements > 0) {
    const points = signals.visualElements * 1;
    score += points;
    reasons.push(`${signals.visualElements} visual elements (+${points})`);
  }

  // 2. Numbers (+2 each) - Data density
  if (signals.numberCount > 0) {
    const points = signals.numberCount * 2;
    score += points;
    reasons.push(`${signals.numberCount} numbers (+${points})`);
  }

  // 3. Comparison (+5) - High mental taxing
  if (signals.hasComparison) {
    score += 5;
    reasons.push(`Comparison presence (+5)`);
  }

  // 4. Callouts (+2 each)
  if (signals.calloutCount > 0) {
    const points = signals.calloutCount * 2;
    score += points;
    reasons.push(`${signals.calloutCount} callouts (+${points})`);
  }

  // 5. Text Length (+1 per 20 chars)
  if (signals.textLength > 0) {
    const points = Math.floor(signals.textLength / 20);
    if (points > 0) {
        score += points;
        reasons.push(`Text density (+${points})`);
    }
  }

  // Determine Recommendation
  let recommendation: CognitiveLoadResult['recommendation'] = 'maintain';
  if (score >= 25) {
    recommendation = 'split';
  } else if (score >= 15) {
    recommendation = 'slow_down';
  }

  return {
    totalScore: score,
    recommendation,
    details: reasons.join(", ")
  };
}
