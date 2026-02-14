/**
 * Transition Governor
 * 
 * Anti-aggression governor and inflation protection.
 * 
 * Prevents:
 * - push + aggressive transition
 * - macro + strong transition
 * - firm-style stacking
 */

import { CinematicTransition, CinematicTransitionResult } from './transition-energy';

/**
 * Transition State
 */
export interface TransitionState {
  totalScenes: number;
  cutCount: number;
  softCutCount: number;
  matchCutCount: number;
  easeThroughCount: number;
  holdCutCount: number;
}

/**
 * Transition Governor
 */
export class TransitionGovernor {
  /**
   * Detect aggression stacking
   * 
   * Prevent:
   * - push + aggressive transition
   * - macro + strong transition
   */
  static detectAggression(scene: any, transition: CinematicTransition): boolean {
    const isPush = scene.trace?.cameraMovement?.type === 'push';
    const isMacro = scene.trace?.cameraShot?.type === 'macro';
    const isAggressiveTransition = transition === 'ease-through';
    
    // Prevent push + aggressive transition
    if (isPush && isAggressiveTransition) {
      return true;
    }
    
    // Prevent macro + strong transition
    if (isMacro && isAggressiveTransition) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Prevent aggression
   * 
   * Downgrade transition if aggression detected.
   * Transitions are the safest layer to soften.
   */
  static preventAggression(scene: any, transition: CinematicTransitionResult): CinematicTransitionResult {
    if (this.detectAggression(scene, transition.type)) {
      return {
        type: 'cut',
        reason: 'Downgraded from ' + transition.type + ' (anti-aggression governor)',
      };
    }
    
    return transition;
  }
  
  /**
   * Update state after transition resolution
   */
  static updateState(state: TransitionState, resolvedTransition: CinematicTransition): void {
    switch (resolvedTransition) {
      case 'cut':
        state.cutCount++;
        break;
      case 'soft-cut':
        state.softCutCount++;
        break;
      case 'match-cut':
        state.matchCutCount++;
        break;
      case 'ease-through':
        state.easeThroughCount++;
        break;
      case 'hold-cut':
        state.holdCutCount++;
        break;
    }
  }
  
  /**
   * Get transition distribution
   */
  static getDistribution(state: TransitionState) {
    const total = state.totalScenes;
    
    if (total === 0) {
      return {
        cut: '0%',
        softCut: '0%',
        matchCut: '0%',
        easeThrough: '0%',
        holdCut: '0%',
      };
    }
    
    return {
      cut: ((state.cutCount / total) * 100).toFixed(1) + '%',
      softCut: ((state.softCutCount / total) * 100).toFixed(1) + '%',
      matchCut: ((state.matchCutCount / total) * 100).toFixed(1) + '%',
      easeThrough: ((state.easeThroughCount / total) * 100).toFixed(1) + '%',
      holdCut: ((state.holdCutCount / total) * 100).toFixed(1) + '%',
    };
  }
}
