/**
 * Reveal Engine - Strategy Resolver
 * 
 * Implements reveal strategy selection based on cognitive signals.
 * Executes AFTER pacing, BEFORE scene finalization.
 */

import { RevealDecision, RevealSignals, RevealStrategyName } from './reveal-types';
import { REVEAL_STRATEGIES, shouldGovernorDowngrade } from './reveal-rules';

export class RevealResolver {
  /**
   * Resolve reveal strategy based on cognitive signals.
   * 
   * Selection Algorithm:
   * 1. Check frequency governor (spotlight/build limit)
   * 2. Evaluate cognitive signals (weight, density)
   * 3. Match to reveal strategy criteria
   * 4. Apply frequency downgrade if needed
   * 5. Return decision with trace
   * 
   * @param signals - Input signals for reveal resolution
   * @returns RevealDecision with chosen strategy and reasoning
   */
  static resolve(signals: RevealSignals): RevealDecision {
    const { emotionalWeight, densityScore, strategy, recentHistory } = signals;
    
    const reasons: string[] = [];
    let proposedStrategy: RevealStrategyName;

    // STEP 1: Determine base strategy from cognitive signals
    
    // Check for BUILD criteria (system explanation)
    // Build is for diagrams explaining systems, spatial relationships, mechanics
    if (strategy === 'diagram' && densityScore >= 7 && emotionalWeight < 7) {
      proposedStrategy = 'build';
      reasons.push(`Build: Diagram with high density (${densityScore}) suggests system explanation`);
    }
    // Check for SPOTLIGHT criteria (dramatic emphasis)
    // Spotlight requires high emotional weight AND a strong focal point (hero layout)
    else if (emotionalWeight >= 7 && (strategy === 'hero' || strategy === 'title')) {
      proposedStrategy = 'spotlight';
      reasons.push(`Spotlight: High emotional weight (${emotionalWeight}) with focal point (${strategy})`);
    }
    // Check for STAGGER criteria (cognitive protection)
    // Stagger is protective - use when density is high
    else if (densityScore >= 7) {
      proposedStrategy = 'stagger';
      reasons.push(`Stagger: High density (${densityScore}) requires cognitive protection`);
    }
    // DEFAULT: INSTANT (most common)
    // Low weight AND low density = instant presentation
    else {
      proposedStrategy = 'instant';
      reasons.push(`Instant: Default for low-medium weight (${emotionalWeight}) and density (${densityScore})`);
    }

    // STEP 2: Apply frequency governor
    let governorApplied = false;
    if (shouldGovernorDowngrade(proposedStrategy, recentHistory)) {
      reasons.push(`[GOVERNOR] Downgraded '${proposedStrategy}' to 'stagger' (frequency limit: max 1 spotlight/build per 3 scenes)`);
      proposedStrategy = 'stagger';
      governorApplied = true;
    }

    // STEP 3: Return decision with trace
    return {
      chosen: proposedStrategy,
      reason: reasons,
      governorApplied,
    };
  }

  /**
   * Get reveal strategy definition by name.
   */
  static getStrategy(name: RevealStrategyName) {
    return REVEAL_STRATEGIES[name];
  }
}
