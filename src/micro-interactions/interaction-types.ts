/**
 * Micro-Interaction Types
 * 
 * HARD RULE: Only 5 types.
 * Constraint is critical. Too many = noisy system.
 * 
 * Stillness is sophistication. Do not animate everything.
 */

/**
 * Micro-Interaction Type
 */
export type MicroInteraction =
  | 'none'        // Default, 50-65%
  | 'settle'      // Tiny stabilization, ≤20% (VERY HIGH VALUE)
  | 'linger'      // Hold attention, ≤15%
  | 'soft-pop'    // Subtle confirmation, ≤10%
  | 'breathe';    // Slow ambient, ≤8%

/**
 * Micro-Interaction Result
 */
export interface MicroInteractionResult {
  type: MicroInteraction;
  reason: string;
}
