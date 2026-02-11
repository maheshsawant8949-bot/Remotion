/**
 * Transition Resolver
 * 
 * Implements transition selection logic.
 * 
 * CRITICAL CONSTRAINTS:
 * 1. Default = soft
 * 2. Never chain high-energy transitions (firm → soft)
 * 3. High density → soft (reduce cognitive load)
 * 4. Firm transition cap (15%)
 */

import {
  TransitionSignals,
  TransitionDecision,
  TransitionType,
} from './transition-types';
import {
  getBaseTransition,
  isAllowedForDensity,
  isAllowedSequence,
} from './transition-rules';

export class TransitionResolver {
  // Cap firm transitions at 15%
  private static readonly FIRM_CAP_PERCENT = 0.15;
  private static readonly HISTORY_WINDOW = 20;

  /**
   * Resolve transition based on motion signals.
   */
  static resolve(signals: TransitionSignals): TransitionDecision {
    const {
      previousMotion,
      currentMotion,
      density,
      isPeak,
      previousTransition,
      recentTransitions,
    } = signals;

    // 1. Get Base Transition
    let transition = getBaseTransition(previousMotion, currentMotion);
    const reasons: string[] = [`Base: ${previousMotion} → ${currentMotion}`];

    // 2. Check Density Constraint
    // High density → soft (cognitive load)
    if (!isAllowedForDensity(transition, density)) {
      if (transition !== 'soft' && transition !== 'minimal') {
        transition = 'soft';
        reasons.push(`High density (${density}) → soft transition`);
      }
    }

    // 3. Check Peak Constraint
    // Peak scenes → soft (let content carry intensity)
    if (isPeak && transition === 'firm') {
      transition = 'soft';
      reasons.push('Peak scene → soft transition (let content carry intensity)');
    }

    // 4. Check Consecutive Firm Constraint
    // If prev was firm, current cannot be firm (bias soft)
    if (transition === 'firm' && !isAllowedSequence(previousTransition, 'firm')) {
      transition = 'soft';
      reasons.push('Consecutive firm prevented (bias soft)');
      return {
        type: transition,
        reason: reasons,
        consecutiveFirmPrevented: true,
      };
    }

    // 5. Check Firm Cap Constraint
    // Firm transitions limited to 15% max
    if (transition === 'firm') {
      const firmAllowed = this.checkFirmAllowed(recentTransitions);
      
      if (!firmAllowed) {
        transition = 'soft';
        reasons.push(`Firm cap reached (${this.getFirmPercent(recentTransitions)}% > 15%)`);
        return {
          type: transition,
          reason: reasons,
          firmnessCapApplied: true,
        };
      }
    }

    return {
      type: transition,
      reason: reasons,
    };
  }

  /**
   * Check if firm transition is allowed based on frequency cap.
   * 
   * Returns true if firm < 15% of recent history.
   */
  private static checkFirmAllowed(
    recentTransitions: TransitionType[]
  ): boolean {
    if (recentTransitions.length === 0) return true;

    const window = recentTransitions.slice(-this.HISTORY_WINDOW);
    const firmCount = window.filter((t) => t === 'firm').length;
    
    // Add 1 (current potentially firm) to check if adding it would exceed limit
    // Or just check current ratio. Let's check current ratio to be safe.
    // Actually, strict limit means we should check current state.
    
    // If current count / window length >= 15%, deny.
    const percent = firmCount / window.length;
    return percent < this.FIRM_CAP_PERCENT;
  }

  /**
   * Get current firm percentage for logging.
   */
  private static getFirmPercent(
    recentTransitions: TransitionType[]
  ): number {
    if (recentTransitions.length === 0) return 0;

    const window = recentTransitions.slice(-this.HISTORY_WINDOW);
    const firmCount = window.filter((t) => t === 'firm').length;

    return Math.round((firmCount / window.length) * 100);
  }
}
