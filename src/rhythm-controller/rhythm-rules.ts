/**
 * Rhythm Rules
 * 
 * Hard guardrails and success criteria for rhythm controller.
 * 
 * CRITICAL: Rhythm must NEVER:
 * ❌ rewrite grammar
 * ❌ change layout
 * ❌ modify pacing
 * ❌ invent emotion
 * 
 * It only shapes emphasis distribution.
 */

export class RhythmRules {
  /**
   * Flatline threshold.
   * If this many consecutive scenes have no strong emphasis, elevate one.
   */
  static readonly FLATLINE_THRESHOLD = 12;

  /**
   * Clustering window size.
   * If 2+ strong scenes appear within this window, downgrade later ones.
   */
  static readonly CLUSTERING_WINDOW = 4;

  /**
   * Recovery window size.
   * After strong emphasis, prefer softer emphasis for this many scenes.
   */
  static readonly RECOVERY_WINDOW = 1;

  /**
   * Scarcity maximum percentage.
   * Strong emphasis should not exceed this percentage of total scenes.
   */
  static readonly SCARCITY_MAX_PERCENT = 0.15; // 15%

  /**
   * Scarcity minimum percentage.
   * Strong emphasis should be at least this percentage of total scenes.
   */
  static readonly SCARCITY_MIN_PERCENT = 0.10; // 10%

  /**
   * Minimum emotional level for strong emphasis.
   * Scenes must have at least this emotional level to be elevated to strong.
   * 
   * Scale: 1 = low, 2 = medium, 3 = high
   */
  static readonly MIN_EMOTIONAL_FOR_STRONG = 2;

  /**
   * Override threshold for recovery.
   * If emotional level is at or above this, recovery can be overridden.
   */
  static readonly RECOVERY_OVERRIDE_THRESHOLD = 3;

  /**
   * Validate that rhythm rules are not violated.
   * Throws error if forbidden operations detected.
   */
  static validateNoForbiddenOperations(adjustment: any): void {
    // Ensure no grammar changes
    if ('grammar' in adjustment || 'grammarVersion' in adjustment) {
      throw new Error('[RHYTHM VIOLATION] Attempted to modify grammar');
    }

    // Ensure no layout changes
    if ('layout' in adjustment || 'template' in adjustment) {
      throw new Error('[RHYTHM VIOLATION] Attempted to modify layout');
    }

    // Ensure no pacing changes
    if ('duration' in adjustment || 'tempo' in adjustment) {
      throw new Error('[RHYTHM VIOLATION] Attempted to modify pacing');
    }

    // Ensure no emotion invention
    if ('emotionalWeight' in adjustment && adjustment.emotionalWeight !== undefined) {
      throw new Error('[RHYTHM VIOLATION] Attempted to invent emotion');
    }
  }

  /**
   * Check if rhythm output meets success criteria.
   * 
   * Rhythm is correct when:
   * ✅ Peaks feel natural
   * ✅ Strong moments are rare
   * ✅ No long flat segments exist
   * ✅ Intensity breathes
   * ✅ Trace explains adjustments
   */
  static checkSuccessCriteria(outputs: Array<{
    finalEmphasis: 'none' | 'soft' | 'strong';
    rhythmAdjustment?: any;
  }>): {
    success: boolean;
    criteria: {
      peaksNatural: boolean;
      strongRare: boolean;
      noLongFlats: boolean;
      intensityBreathes: boolean;
      traceExplains: boolean;
    };
    issues: string[];
  } {
    const issues: string[] = [];

    // Check: Strong moments are rare (10-15%)
    const strongCount = outputs.filter(o => o.finalEmphasis === 'strong').length;
    const strongPercent = (strongCount / outputs.length) * 100;
    const strongRare = strongPercent >= 10 && strongPercent <= 15;

    if (!strongRare) {
      issues.push(`Strong emphasis ${strongPercent.toFixed(1)}% (should be 10-15%)`);
    }

    // Check: No long flat segments (12+ consecutive non-strong)
    let consecutiveNonStrong = 0;
    let maxConsecutive = 0;
    for (const output of outputs) {
      if (output.finalEmphasis === 'strong') {
        consecutiveNonStrong = 0;
      } else {
        consecutiveNonStrong++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveNonStrong);
      }
    }
    const noLongFlats = maxConsecutive < 12;

    if (!noLongFlats) {
      issues.push(`Flatline detected (${maxConsecutive} consecutive non-strong)`);
    }

    // Check: Intensity breathes (recovery after strong)
    let recoveryCount = 0;
    for (let i = 1; i < outputs.length; i++) {
      if (outputs[i - 1].finalEmphasis === 'strong' && outputs[i].finalEmphasis === 'none') {
        recoveryCount++;
      }
    }
    const intensityBreathes = recoveryCount >= Math.floor(strongCount * 0.5);

    if (!intensityBreathes) {
      issues.push(`Insufficient recovery (${recoveryCount} of ${strongCount} strong scenes)`);
    }

    // Check: Trace explains adjustments
    const adjustedScenes = outputs.filter(o => o.rhythmAdjustment);
    const traceExplains = adjustedScenes.every(o => 
      o.rhythmAdjustment?.reason && o.rhythmAdjustment?.action
    );

    if (!traceExplains) {
      issues.push('Some adjustments lack explanation in trace');
    }

    // Peaks natural (heuristic: not all clustered)
    const peaksNatural = maxConsecutive < 12 && strongPercent <= 15;

    return {
      success: issues.length === 0,
      criteria: {
        peaksNatural,
        strongRare,
        noLongFlats,
        intensityBreathes,
        traceExplains,
      },
      issues,
    };
  }

  /**
   * Get rules summary for logging.
   */
  static getSummary(): string {
    return (
      `Rhythm Rules:\n` +
      `  Flatline threshold: ${this.FLATLINE_THRESHOLD} scenes\n` +
      `  Clustering window: ${this.CLUSTERING_WINDOW} scenes\n` +
      `  Recovery window: ${this.RECOVERY_WINDOW} scenes\n` +
      `  Scarcity range: ${this.SCARCITY_MIN_PERCENT * 100}%-${this.SCARCITY_MAX_PERCENT * 100}%\n` +
      `  Min emotional for strong: ${this.MIN_EMOTIONAL_FOR_STRONG}\n` +
      `  Recovery override threshold: ${this.RECOVERY_OVERRIDE_THRESHOLD}`
    );
  }
}
