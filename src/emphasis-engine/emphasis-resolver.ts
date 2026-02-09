/**
 * Emphasis Engine - Level Resolver
 * 
 * Implements emphasis level selection based on cognitive signals.
 * Executes AFTER reveal, BEFORE scene finalization.
 */

import { EmphasisDecision, EmphasisSignals, EmphasisLevelName, PriorityTier } from './emphasis-types';
import { shouldGovernorDowngrade } from './emphasis-rules';

export class EmphasisResolver {
  /**
   * Resolve emphasis level based on cognitive signals.
   * 
   * Selection Algorithm:
   * 1. Check for strong criteria (high emotion OR spotlight)
   * 2. Check for soft criteria (medium emotion OR moderate density)
   * 3. Default to none
   * 4. Apply frequency governor if needed
   * 5. Return decision with trace
   * 
   * @param signals - Input signals for emphasis resolution
   * @returns EmphasisDecision with chosen level and reasoning
   */
  static resolve(signals: EmphasisSignals): EmphasisDecision {
    const { emotionalWeight, densityScore, revealStrategy, strategy, recentHistory } = signals;
    
    const reasons: string[] = [];
    let proposedLevel: EmphasisLevelName;
    let primary: string | undefined;
    let secondary: string[] = [];

    // STEP 1: Determine base emphasis level from cognitive signals
    
    // Check for STRONG criteria
    // Strong requires: High emotion (≥7) OR spotlight reveal
    if (emotionalWeight >= 7) {
      proposedLevel = 'strong';
      primary = this.selectPrimaryElement(strategy, 'high_emotion');
      reasons.push(`Strong: High emotional weight (${emotionalWeight}) demands clear priority`);
    } else if (revealStrategy === 'spotlight') {
      proposedLevel = 'strong';
      primary = this.selectPrimaryElement(strategy, 'spotlight_focal');
      reasons.push(`Strong: Spotlight reveal indicates focal point requiring strong emphasis`);
    }
    // Check for SOFT criteria
    // Soft requires: Medium emotion (4-6) OR moderate density (5-6)
    else if (emotionalWeight >= 4 && emotionalWeight < 7) {
      proposedLevel = 'soft';
      primary = this.selectPrimaryElement(strategy, 'medium_emotion');
      reasons.push(`Soft: Medium emotional weight (${emotionalWeight}) suggests subtle guidance`);
    } else if (densityScore >= 5 && densityScore < 7) {
      proposedLevel = 'soft';
      primary = this.selectPrimaryElement(strategy, 'moderate_density');
      // For dense content, identify supporting elements
      secondary = this.identifySecondaryElements(strategy);
      reasons.push(`Soft: Moderate density (${densityScore}) benefits from gentle priority`);
    }
    // DEFAULT: NONE (most common)
    else {
      proposedLevel = 'none';
      primary = undefined;
      reasons.push(`None: Low emotional weight (${emotionalWeight}) and density (${densityScore}) - normal is powerful`);
    }

    // STEP 2: Hero Layout Enforcement
    // Hero layout REQUIRES medium+ emotional weight
    // If hero strategy but low emotion, this is a mismatch - log warning
    if (strategy === 'hero' && emotionalWeight < 4) {
      reasons.push(`[WARNING] Hero layout with low emotion (${emotionalWeight}) - consider different strategy`);
      // Don't force upgrade - let the mismatch be visible in trace
    }

    // STEP 3: Guaranteed Strong Emphasis Rule
    // Ensure at least one strong emphasis every 8-10 scenes IF qualifying signals exist
    // Check: Has it been 8+ scenes since last strong?
    const scenesSinceLastStrong = this.countScenesSinceLastStrong(recentHistory);
    const hasQualifyingSignals = emotionalWeight >= 5 || revealStrategy === 'spotlight' || densityScore >= 6;
    
    if (scenesSinceLastStrong >= 8 && hasQualifyingSignals && proposedLevel !== 'strong') {
      reasons.push(`[GUARANTEE] Upgraded to 'strong' (${scenesSinceLastStrong} scenes since last strong, qualifying signals present)`);
      proposedLevel = 'strong';
      primary = this.selectPrimaryElement(strategy, 'guaranteed_strong');
    }

    // STEP 4: Apply frequency governor
    let governorApplied = false;
    if (shouldGovernorDowngrade(proposedLevel, recentHistory)) {
      reasons.push(`[GOVERNOR] Downgraded 'strong' to 'soft' (frequency limit: max 1 strong per 3 scenes)`);
      proposedLevel = 'soft';
      governorApplied = true;
    }

    // STEP 3: Map to priority tier (future-proofing for camera/motion/contrast systems)
    const tier = this.mapToTier(proposedLevel);

    // STEP 4: Return decision with trace
    return {
      level: proposedLevel,
      primary: proposedLevel !== 'none' ? primary : undefined,
      secondary: secondary.length > 0 ? secondary : undefined,
      tier,
      reason: reasons,
      governorApplied,
    };
  }

  /**
   * Map emphasis level to priority tier.
   * Future-proofs for camera logic, motion weighting, contrast systems.
   */
  private static mapToTier(level: EmphasisLevelName): PriorityTier {
    switch (level) {
      case 'strong':
        return 'primary';
      case 'soft':
        return 'secondary';
      case 'none':
      default:
        return 'background';
    }
  }

  /**
   * Select ONE primary element for emphasis.
   * Never multiple - multiple primaries destroy hierarchy.
   * 
   * @param strategy - Layout/template strategy
   * @param context - Context for selection (high_emotion, spotlight_focal, etc.)
   * @returns Single primary element identifier
   */
  private static selectPrimaryElement(strategy: string, context: string): string {
    // Element selection based on strategy and context
    // This is deterministic - same inputs always produce same output
    
    if (context === 'spotlight_focal') {
      // Spotlight reveal always emphasizes the focal point
      return 'focal_element';
    }
    
    if (context === 'high_emotion' || context === 'guaranteed_strong') {
      // High emotion or guaranteed strong emphasizes the emotional anchor
      if (strategy === 'hero') return 'hero_element';
      if (strategy === 'title') return 'title_text';
      if (strategy === 'statistic') return 'statistic_value';
      return 'primary_element';
    }
    
    if (context === 'medium_emotion' || context === 'moderate_density') {
      // Medium signals emphasize key content element
      if (strategy === 'diagram') return 'diagram_primary';
      if (strategy === 'comparison') return 'comparison_key';
      return 'key_element';
    }
    
    // Fallback
    return 'primary_element';
  }

  /**
   * Count scenes since last strong emphasis.
   * Used for guaranteed strong emphasis rule.
   * 
   * @param history - Recent emphasis history
   * @returns Number of scenes since last strong emphasis
   */
  private static countScenesSinceLastStrong(history: EmphasisLevelName[]): number {
    // Find the most recent 'strong' in history
    const lastStrongIndex = history.lastIndexOf('strong');
    
    if (lastStrongIndex === -1) {
      // No strong emphasis found - return history length (could be 0 or more)
      return history.length;
    }
    
    // Return scenes since last strong (not including the strong itself)
    return history.length - lastStrongIndex - 1;
  }

  /**
   * Identify secondary supporting elements.
   * Used for dense content to provide context hierarchy.
   * 
   * @param strategy - Layout/template strategy
   * @returns Array of secondary element identifiers
   */
  private static identifySecondaryElements(strategy: string): string[] {
    // For dense content, identify supporting elements
    if (strategy === 'diagram') {
      return ['diagram_labels', 'diagram_context'];
    }
    if (strategy === 'comparison') {
      return ['comparison_secondary'];
    }
    // Most strategies don't need explicit secondary elements
    return [];
  }
}
