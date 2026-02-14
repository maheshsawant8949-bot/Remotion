/**
 * Camera Movement Types
 * 
 * HARD RULE: Only 4 movement types. Constraint is critical.
 * Too many movements = amateur system.
 * 
 * This layer runs AFTER camera framing and motion curves.
 * Movement must respect all upstream decisions.
 * 
 * DOES NOT define transforms, keyframes, or durations.
 * Defines intent only - renderer executes.
 */

/**
 * Camera Movement Type
 * 
 * - static: No movement (default, 60-75% target)
 * - drift: Very slow lateral/vertical (15-25%)
 * - push: Extremely slow forward (5-10%, cinematic signal)
 * - hold: Micro-settle post-peak (5-10%)
 */
export type CameraMovement = 
  | 'static'  // Default: no movement, stillness is premium
  | 'drift'   // Slow lateral/vertical, prevent dead stillness
  | 'push'    // Slow forward, cinematic signal
  | 'hold';   // Micro-settle, let viewer absorb

/**
 * Camera Movement Result
 * Includes the movement type and reasoning for explainability
 */
export interface CameraMovementResult {
  type: CameraMovement;
  reason: string;
}
