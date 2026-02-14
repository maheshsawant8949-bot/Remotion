/**
 * Motion Curve Types
 * 
 * HARD RULE: Only 4 curves. Constraint creates identity.
 * 
 * These define INTENT only, NOT renderer easing.
 * Renderer interprets these curves later.
 */

/**
 * Motion Curve Type
 * 
 * - gentle: Default, low acceleration, soft stop
 * - confident: Steady acceleration, firm stop
 * - swift: High acceleration, short duration
 * - deliberate: Slow acceleration, long duration
 */
export type MotionCurve = 
  | 'gentle'      // Default: low acceleration, soft stop
  | 'confident'   // Steady acceleration, firm stop
  | 'swift'       // High acceleration, short duration
  | 'deliberate'; // Slow acceleration, long duration

/**
 * Motion Curve Result
 * Includes the curve type and reasoning for explainability
 */
export interface MotionCurveResult {
  type: MotionCurve;
  reason: string;
}
