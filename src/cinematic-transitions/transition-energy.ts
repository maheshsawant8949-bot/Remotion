/**
 * Cinematic Transition Types & Energy Computation
 * 
 * HARD RULE: Only 5 transition types.
 * Professional videos use cuts constantly.
 * Fancy transitions are amateur signals.
 */

/**
 * Cinematic Transition Type
 * 
 * - cut: Default, 40-60% target
 * - soft-cut: Low energy shift, invisible
 * - match-cut: Visual continuity, ≤15%
 * - ease-through: Gradual escalation, ≤20%
 * - hold-cut: Micro pause, 5-8% (very cinematic)
 */
export type CinematicTransition = 
  | 'cut'          // Default, fast cognition prefers cuts
  | 'soft-cut'     // Low energy shift (calm → calm)
  | 'match-cut'    // Visual structure similarity (HIGH VALUE)
  | 'ease-through' // Gradual escalation
  | 'hold-cut';    // Micro pause before cutting (VERY CINEMATIC)

/**
 * Cinematic Transition Result
 */
export interface CinematicTransitionResult {
  type: CinematicTransition;
  reason: string;
}

/**
 * Transition Characteristics
 */
export const TRANSITION_CHARACTERISTICS = {
  cut: {
    description: 'Standard cut',
    usage: 'Default, strong continuity',
    target: '40-60%',
    feel: 'Professional, fast cognition',
  },
  'soft-cut': {
    description: 'Low energy shift',
    usage: 'calm → calm, standard → standard',
    feel: 'Invisible, smooth',
  },
  'match-cut': {
    description: 'Visual continuity',
    usage: 'diagram → diagram, stat → stat, object → object',
    target: '≤15%',
    feel: 'Subconscious continuity, high value',
    warning: 'Overuse kills the effect',
  },
  'ease-through': {
    description: 'Gradual escalation',
    usage: 'calm → focus, gentle → confident',
    target: '≤20%',
    feel: 'Directed, smooth escalation',
  },
  'hold-cut': {
    description: 'Micro pause before cutting',
    usage: 'Post-peak, high emotion, deliberate curve',
    target: '5-8%',
    feel: 'Very cinematic, lets brain absorb',
    note: 'Most automated systems NEVER do this',
  },
} as const;

/**
 * Transition Inflation Limits
 */
export const TRANSITION_LIMITS = {
  matchCut: 0.15,      // ≤15%
  holdCut: 0.08,       // ≤8%
  easeThrough: 0.20,   // ≤20%
} as const;

/**
 * Energy Computer
 * 
 * Computes scene energy for energy delta logic.
 */
export class EnergyComputer {
  /**
   * Compute scene energy
   * 
   * Energy = motion + camera + movement + emphasis
   */
  static computeSceneEnergy(scene: any): number {
    let energy = 0;
    
    // Motion contribution (0-3)
    const motion = scene.trace?.motionBehavior?.behavior;
    switch (motion) {
      case 'energetic': energy += 3; break;
      case 'assertive': energy += 2; break;
      case 'technical': energy += 1; break;
      case 'calm': energy += 0; break;
      default: energy += 0;
    }
    
    // Camera contribution (0-3)
    const shot = scene.trace?.cameraShot?.type;
    switch (shot) {
      case 'macro': energy += 3; break;
      case 'focus': energy += 2; break;
      case 'standard': energy += 1; break;
      case 'wide': energy += 0; break;
      default: energy += 1;
    }
    
    // Movement contribution (0-2)
    const movement = scene.trace?.cameraMovement?.type;
    switch (movement) {
      case 'push': energy += 2; break;
      case 'drift': energy += 1; break;
      case 'hold': energy += 0; break;
      case 'static': energy += 0; break;
      default: energy += 0;
    }
    
    // Emphasis contribution (0-2)
    const emphasis = scene.trace?.emphasis?.level;
    switch (emphasis) {
      case 'strong': energy += 2; break;
      case 'soft': energy += 1; break;
      case 'none': energy += 0; break;
      default: energy += 0;
    }
    
    return energy;
  }
  
  /**
   * Compute energy delta
   * 
   * energyDelta = nextSceneEnergy - currentSceneEnergy
   */
  static computeEnergyDelta(currentScene: any, nextScene: any): number {
    const currentEnergy = this.computeSceneEnergy(currentScene);
    const nextEnergy = this.computeSceneEnergy(nextScene);
    
    return nextEnergy - currentEnergy;
  }
}
