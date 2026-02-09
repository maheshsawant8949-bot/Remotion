/**
 * Behavior Resolver
 * 
 * Implements motion behavior selection logic.
 * 
 * CRITICAL CONSTRAINTS:
 * 1. Energetic ONLY for upward/activating polarity
 * 2. Technical NEVER escalates to energetic
 * 3. Recovery bias after assertive/energetic
 * 4. Inflation prevention (≤25% assertive/energetic)
 */

import { MOTION_INFLATION_LIMITS } from './motion-principles';
import type {
  MotionBehaviorName,
  MotionDecision,
  MotionSignals,
  EmotionalPolarity,
} from './behavior-types';

export class BehaviorResolver {
  /**
   * Resolve motion behavior from signals.
   * 
   * Selection Algorithm:
   * 1. Recovery bias (if previous was assertive/energetic)
   * 2. High density → calm
   * 3. Process/diagram → technical
   * 4. Peak moment → energetic (upward polarity only)
   * 5. Emphasis → assertive
   * 6. Default → calm
   */
  static resolve(signals: MotionSignals): MotionDecision {
    const {
      emotionalWeight,
      emotionalPolarity,
      density,
      emphasis,
      strategy,
      previousBehavior,
      recentHistory,
    } = signals;

    // STEP 1: Recovery bias - Previous scene was assertive/energetic
    if (previousBehavior === 'assertive' || previousBehavior === 'energetic') {
      // Bias toward calm unless extreme signals (emotion >= 8)
      if (emotionalWeight < 8) {
        return {
          behavior: 'calm',
          reason: [
            `Recovery bias after ${previousBehavior}`,
            `Emotion ${emotionalWeight} < 8 (not extreme)`,
          ],
          recoveryBiasApplied: true,
        };
      }
    }

    // STEP 2: High density → calm (respect cognitive load)
    if (density >= 7) {
      return {
        behavior: 'calm',
        reason: [`High density (${density}) requires calm motion`],
      };
    }
  
    // STEP 3: Process/diagram → technical (WITH FREQUENCY GOVERNOR)
    // Technical for: diagram/process with (no emphasis OR density <= 5)
    // BUT: Enforce global 25% limit via frequency governor
    if ((strategy === 'process' || strategy === 'diagram') && (emphasis === 'none' || density <= 5)) {
      // Check frequency governor: technical should not exceed 25% of recent history
      const technicalAllowed = this.checkTechnicalAllowed(recentHistory);
      
      if (technicalAllowed) {
        return {
          behavior: 'technical',
          reason: [`${strategy} strategy (density=${density}, emphasis=${emphasis})`],
        };
      } else {
        return {
          behavior: 'calm',
          reason: [
            `${strategy} strategy but technical frequency limit reached`,
            `Technical already at ${this.getTechnicalPercent(recentHistory)}% (max 25%)`,
          ],
          governorApplied: true,
        };
      }
    }

    // Check inflation before allowing assertive/energetic
    const inflationAllowed = this.checkInflationAllowed(recentHistory);

    // STEP 4: Peak moment → energetic (ONLY if upward polarity + allowed)
    if (emphasis === 'strong' && emotionalWeight >= 7) {
      // Check emotional polarity
      if (emotionalPolarity === 'upward') {
        if (inflationAllowed) {
          return {
            behavior: 'energetic',
            reason: [
              `Peak moment (strong emphasis, emotion ${emotionalWeight})`,
              'Upward polarity allows energetic',
            ],
          };
        } else {
          return {
            behavior: 'calm',
            reason: [
              `Peak moment but inflation prevented`,
              `Assertive/energetic already at ${this.getInflationPercent(recentHistory)}%`,
            ],
            inflationPrevented: true,
          };
        }
      }

      // Downward or neutral polarity → assertive instead (never energetic)
      if (inflationAllowed) {
        return {
          behavior: 'assertive',
          reason: [
            `Peak moment (strong emphasis, emotion ${emotionalWeight})`,
            `${emotionalPolarity} polarity → assertive (not energetic)`,
          ],
        };
      } else {
        return {
          behavior: 'calm',
          reason: [
            `Peak moment but inflation prevented`,
            `Assertive/energetic already at ${this.getInflationPercent(recentHistory)}%`,
          ],
          inflationPrevented: true,
        };
      }
    }

    // STEP 5: Emphasis moment → assertive (if allowed)
    if (emphasis === 'soft' || emphasis === 'strong') {
      if (inflationAllowed) {
        return {
          behavior: 'assertive',
          reason: [`${emphasis} emphasis moment`],
        };
      } else {
        return {
          behavior: 'calm',
          reason: [
            `${emphasis} emphasis but inflation prevented`,
            `Assertive/energetic already at ${this.getInflationPercent(recentHistory)}%`,
          ],
          inflationPrevented: true,
        };
      }
    }

    // STEP 6: Default → calm
    return {
      behavior: 'calm',
      reason: ['Default state (no emphasis, normal weight)'],
    };
  }

  /**
   * Check if inflation allows more assertive/energetic behaviors.
   * 
   * Returns true if assertive/energetic < 25% of recent history.
   */
  private static checkInflationAllowed(
    recentHistory: MotionBehaviorName[]
  ): boolean {
    if (recentHistory.length === 0) return true;

    const window = recentHistory.slice(
      -MOTION_INFLATION_LIMITS.HISTORY_WINDOW
    );
    const assertiveEnergeticCount = window.filter(
      (b) => b === 'assertive' || b === 'energetic'
    ).length;

    const percent = assertiveEnergeticCount / window.length;
    return percent < MOTION_INFLATION_LIMITS.MAX_ASSERTIVE_ENERGETIC_PERCENT;
  }

  /**
   * Get current inflation percentage for logging.
   */
  private static getInflationPercent(
    recentHistory: MotionBehaviorName[]
  ): number {
    if (recentHistory.length === 0) return 0;

    const window = recentHistory.slice(
      -MOTION_INFLATION_LIMITS.HISTORY_WINDOW
    );
    const assertiveEnergeticCount = window.filter(
      (b) => b === 'assertive' || b === 'energetic'
    ).length;

    return Math.round((assertiveEnergeticCount / window.length) * 100);
  }

  /**
   * Check if technical behavior is allowed based on frequency governor.
   * 
   * Returns true if technical < 25% of recent history.
   * This prevents technical from dominating when many scenes use diagram/process.
   */
  private static checkTechnicalAllowed(
    recentHistory: MotionBehaviorName[]
  ): boolean {
    if (recentHistory.length === 0) return true;

    const window = recentHistory.slice(
      -MOTION_INFLATION_LIMITS.HISTORY_WINDOW
    );
    const technicalCount = window.filter((b) => b === 'technical').length;

    const percent = technicalCount / window.length;
    return percent < 0.25; // Max 25% technical
  }

  /**
   * Get current technical percentage for logging.
   */
  private static getTechnicalPercent(
    recentHistory: MotionBehaviorName[]
  ): number {
    if (recentHistory.length === 0) return 0;

    const window = recentHistory.slice(
      -MOTION_INFLATION_LIMITS.HISTORY_WINDOW
    );
    const technicalCount = window.filter((b) => b === 'technical').length;

    return Math.round((technicalCount / window.length) * 100);
  }

  /**
   * Detect emotional polarity from intent type.
   * 
   * Upward/Activating: positive, excited, urgent, triumphant, energetic
   * Downward/Deactivating: sad, somber, reflective, melancholic, calm
   * Neutral: informational, analytical, explanatory
   */
  static detectEmotionalPolarity(intentType?: string): EmotionalPolarity {
    if (!intentType) return 'neutral';

    const upwardKeywords = [
      'awe',
      'triumph',
      'excitement',
      'urgency',
      'breakthrough',
      'celebration',
      'energetic',
      'positive',
      'excited',
      'urgent',
    ];

    const downwardKeywords = [
      'somber',
      'reflective',
      'melancholic',
      'loss',
      'quiet',
      'contemplative',
      'sad',
      'grief',
    ];

    const intent = intentType.toLowerCase();

    if (upwardKeywords.some((kw) => intent.includes(kw))) return 'upward';
    if (downwardKeywords.some((kw) => intent.includes(kw))) return 'downward';

    return 'neutral';
  }
}
