export interface DensitySignals {
  conceptCount: number;
  numericPresence: number; // Count of numbers
  comparisonWords: number; // Count of comparison words
  calloutsRequired: number; // Estimated count of callouts
  visualElementsPredicted: number;
}

export interface DensityAction {
  type: 'maintain' | 'split' | 'downgrade_intensity';
  reason: string;
  score: number;
}

export class SceneDensityController {
  
  // Heuristics for surgical density scoring (0-10 scale)
  // 0-3: Safe
  // 4-6: Moderate (Downgrade)
  // 7+: High (Split)
  private readonly SPLIT_THRESHOLD = 7;
  private readonly DOWNGRADE_THRESHOLD = 4;

  analyze(script: string, proposedStrategy: string): DensityAction {
    const signals = this.extractSignals(script);
    const score = this.calculateDensityScore(signals);

    if (score >= this.SPLIT_THRESHOLD) {
      return {
        type: 'split',
        reason: `Density score ${score} exceeds split threshold (${this.SPLIT_THRESHOLD}). Scene is too dense.`,
        score
      };
    } else if (score >= this.DOWNGRADE_THRESHOLD) {
      return {
        type: 'downgrade_intensity',
        reason: `Density score ${score} is high. Downgrading intensity to prevent overload. Strategy '${proposedStrategy}' preserved.`,
        score
      };
    }

    return {
      type: 'maintain',
      reason: `Density score ${score} is within safe limits.`,
      score
    };
  }

  private extractSignals(script: string): DensitySignals {
    // CONCEPT ESTIMATION: "How many ideas must the viewer hold?"
    // Focus on cognitive load, not token count
    
    // 1. Distinct Ideas = Sentences (each sentence = one concept to process)
    const sentences = (script.match(/[.!?]+/g) || []).length || 1;
    
    // 2. Data Points = Numbers (each number is a distinct fact to remember)
    const numbers = (script.match(/\d+/g) || []).length;
    
    // 3. Relationships = Comparison words (require holding multiple concepts simultaneously)
    const comparisons = (script.match(/\b(versus|compared|higher|lower|than|increase|decrease|differs|but|however|while|whereas)\b/gi) || []).length;
    
    // 4. Technical Terms = Capitalized mid-sentence words (domain-specific concepts)
    // These require additional cognitive load to understand
    const technicalTerms = (script.match(/\b[A-Z][a-z]{3,}\b/g) || []).length;
    
    // 5. Conjunctions = "and", "or" (indicate multiple concepts in same sentence)
    const conjunctions = (script.match(/\b(and|or)\b/gi) || []).length;
    
    // CONCEPT COUNT = Base ideas + additional complexity
    // Each sentence is 1 concept, but numbers/comparisons/terms add cognitive load
    const concepts = sentences + Math.floor(numbers / 2) + comparisons + Math.floor(technicalTerms / 3) + Math.floor(conjunctions / 2);
    
    // Callouts: estimated as explicit mentions of 'highlight', 'note', 'see'
    const callouts = (script.match(/\b(highlight|note|notice|look)\b/gi) || []).length;

    // Visual Elements: Baseline 1 + extras
    const visuals = 1 + (numbers > 0 ? 1 : 0) + (comparisons > 0 ? 1 : 0);

    return {
      conceptCount: concepts,
      numericPresence: numbers,
      comparisonWords: comparisons,
      calloutsRequired: callouts,
      visualElementsPredicted: visuals
    };
  }

  private calculateDensityScore(signals: DensitySignals): number {
    let score = 0;
    // Concept-based weights (0-10 scale)
    // Concepts are now the primary driver (sentences + complexity)
    score += signals.conceptCount * 1.0;   // Primary: How many ideas?
    score += signals.numericPresence * 0.5; // Secondary: Data points add load
    score += signals.comparisonWords * 1.5; // High: Relationships require holding multiple concepts
    score += signals.calloutsRequired * 1.0; // Medium: Explicit attention markers
    score += signals.visualElementsPredicted * 0.3; // Low: Visual aids reduce cognitive load
    return Math.min(10, Math.round(score)); // Cap at 10
  }
}
