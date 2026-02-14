/**
 * Camera Movement Governor
 * 
 * Tracks movement state and enforces distribution targets.
 * Provides distribution reporting for verification.
 */

import { CameraMovement } from './movement-types';

/**
 * Movement State
 * Tracks counts for all movement types and governors
 */
export interface MovementState {
  totalScenes: number;
  staticCount: number;
  driftCount: number;
  pushCount: number;
  holdCount: number;
  movementCount: number;  // Total non-static scenes
  previousMovement?: CameraMovement;
  pushStreak: number;
}

/**
 * Movement Governor
 */
export class MovementGovernor {
  /**
   * Update state after movement resolution
   */
  static updateState(state: MovementState, resolvedMovement: CameraMovement): void {
    // Update counts
    switch (resolvedMovement) {
      case 'static':
        state.staticCount++;
        break;
      case 'drift':
        state.driftCount++;
        state.movementCount++;
        break;
      case 'push':
        state.pushCount++;
        state.movementCount++;
        break;
      case 'hold':
        state.holdCount++;
        state.movementCount++;
        break;
    }
    
    // Update push streak tracking
    if (resolvedMovement === 'push') {
      state.pushStreak++;
    } else {
      state.pushStreak = 0;
    }
    
    state.previousMovement = resolvedMovement;
  }
  
  /**
   * Get movement distribution report
   * 
   * Healthy profile:
   * - static: 60-75%
   * - drift: 15-25%
   * - push: 5-10%
   * - hold: 5-10%
   */
  static getDistribution(state: MovementState) {
    const total = state.totalScenes;
    
    if (total === 0) {
      return {
        static: '0%',
        drift: '0%',
        push: '0%',
        hold: '0%',
        movement: '0%',
      };
    }
    
    return {
      static: ((state.staticCount / total) * 100).toFixed(1) + '%',
      drift: ((state.driftCount / total) * 100).toFixed(1) + '%',
      push: ((state.pushCount / total) * 100).toFixed(1) + '%',
      hold: ((state.holdCount / total) * 100).toFixed(1) + '%',
      movement: ((state.movementCount / total) * 100).toFixed(1) + '%',
    };
  }
  
  /**
   * Check if distribution is healthy
   */
  static isHealthy(state: MovementState): boolean {
    const total = state.totalScenes;
    if (total === 0) return true;
    
    const staticRatio = state.staticCount / total;
    const driftRatio = state.driftCount / total;
    const pushRatio = state.pushCount / total;
    const holdRatio = state.holdCount / total;
    
    // Check targets
    const staticOk = staticRatio >= 0.60 && staticRatio <= 0.75;
    const driftOk = driftRatio >= 0.15 && driftRatio <= 0.25;
    const pushOk = pushRatio >= 0.05 && pushRatio <= 0.10;
    const holdOk = holdRatio >= 0.05 && holdRatio <= 0.10;
    
    return staticOk && driftOk && pushOk && holdOk;
  }
}
