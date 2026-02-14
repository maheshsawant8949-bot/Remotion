/**
 * Distribution Metrics
 * 
 * Computes global metrics across entire sequence.
 * Used by Global Distribution Governor for stabilization.
 */

/**
 * Motion Metrics
 */
export interface MotionMetrics {
  calm: number;           // Percentage
  technical: number;      // Percentage
  assertive: number;      // Percentage
  energetic: number;      // Percentage
  maxKineticStreak: number;  // Max consecutive assertive/energetic
  motionVolatility: number;  // Behavior switches / scene count
}

/**
 * Camera Shot Metrics
 */
export interface CameraMetrics {
  standard: number;       // Percentage
  wide: number;          // Percentage
  focus: number;         // Percentage
  macro: number;         // Percentage
  tightStreak: number;   // Max consecutive focus/macro
}

/**
 * Camera Movement Metrics
 */
export interface MovementMetrics {
  static: number;        // Percentage
  drift: number;         // Percentage
  push: number;          // Percentage
  hold: number;          // Percentage
  pushStreak: number;    // Max consecutive push
  movementRatio: number; // Non-static / total
}

/**
 * Emphasis Metrics
 */
export interface EmphasisMetrics {
  strong: number;        // Percentage
}

/**
 * Transition Metrics
 */
export interface TransitionMetrics {
  firm: number;          // Percentage
}

/**
 * Global Metrics
 */
export interface GlobalMetrics {
  motion: MotionMetrics;
  camera: CameraMetrics;
  movement: MovementMetrics;
  emphasis: EmphasisMetrics;
  transition: TransitionMetrics;
}

/**
 * Health Thresholds
 */
export const HEALTH_THRESHOLDS = {
  motion: {
    energetic: { max: 0.07 },           // ≤7%
    kineticStreak: { max: 2 },          // ≤2
    volatility: { min: 0.25, max: 0.40 }, // 25-40%
  },
  camera: {
    macro: { max: 0.05 },               // ≤5%
    tightStreak: { max: 2 },            // ≤2
  },
  movement: {
    static: { min: 0.60, max: 0.75 },   // 60-75%
    push: { max: 0.10 },                // ≤10%
    movementRatio: { max: 0.40 },       // ≤40%
    pushStreak: { max: 1 },             // ≤1
  },
  emphasis: {
    strong: { max: 0.15 },              // ≤15%
  },
  transition: {
    firm: { max: 0.18 },                // ≤18%
  },
} as const;

/**
 * Metrics Computer
 */
export class MetricsComputer {
  /**
   * Compute global metrics from compiled scenes
   */
  static compute(scenes: any[]): GlobalMetrics {
    const total = scenes.length;
    
    if (total === 0) {
      return this.getEmptyMetrics();
    }
    
    // Motion metrics
    const motionCounts = { calm: 0, technical: 0, assertive: 0, energetic: 0 };
    const motionBehaviors: string[] = [];
    
    scenes.forEach(scene => {
      const behavior = scene.trace?.motionBehavior?.behavior || 'calm';
      motionBehaviors.push(behavior);
      motionCounts[behavior as keyof typeof motionCounts]++;
    });
    
    const maxKineticStreak = this.computeKineticStreak(motionBehaviors);
    const motionVolatility = this.computeVolatility(motionBehaviors);
    
    // Camera metrics
    const cameraCounts = { standard: 0, wide: 0, focus: 0, macro: 0 };
    const cameraShots: string[] = [];
    
    scenes.forEach(scene => {
      const shot = scene.trace?.cameraShot?.type || 'standard';
      cameraShots.push(shot);
      cameraCounts[shot as keyof typeof cameraCounts]++;
    });
    
    const tightStreak = this.computeTightStreak(cameraShots);
    
    // Movement metrics
    const movementCounts = { static: 0, drift: 0, push: 0, hold: 0 };
    const movements: string[] = [];
    
    scenes.forEach(scene => {
      const movement = scene.trace?.cameraMovement?.type || 'static';
      movements.push(movement);
      movementCounts[movement as keyof typeof movementCounts]++;
    });
    
    const pushStreak = this.computePushStreak(movements);
    const movementRatio = (total - movementCounts.static) / total;
    
    // Emphasis metrics
    let strongCount = 0;
    scenes.forEach(scene => {
      if (scene.trace?.emphasis?.level === 'strong') {
        strongCount++;
      }
    });
    
    // Transition metrics
    let firmCount = 0;
    scenes.forEach(scene => {
      if (scene.trace?.transitionFromPrevious?.type === 'firm') {
        firmCount++;
      }
    });
    
    return {
      motion: {
        calm: (motionCounts.calm / total) * 100,
        technical: (motionCounts.technical / total) * 100,
        assertive: (motionCounts.assertive / total) * 100,
        energetic: (motionCounts.energetic / total) * 100,
        maxKineticStreak,
        motionVolatility,
      },
      camera: {
        standard: (cameraCounts.standard / total) * 100,
        wide: (cameraCounts.wide / total) * 100,
        focus: (cameraCounts.focus / total) * 100,
        macro: (cameraCounts.macro / total) * 100,
        tightStreak,
      },
      movement: {
        static: (movementCounts.static / total) * 100,
        drift: (movementCounts.drift / total) * 100,
        push: (movementCounts.push / total) * 100,
        hold: (movementCounts.hold / total) * 100,
        pushStreak,
        movementRatio,
      },
      emphasis: {
        strong: (strongCount / total) * 100,
      },
      transition: {
        firm: (firmCount / total) * 100,
      },
    };
  }
  
  /**
   * Check if metrics are healthy
   */
  static isHealthy(metrics: GlobalMetrics): boolean {
    const { motion, camera, movement, emphasis, transition } = metrics;
    const t = HEALTH_THRESHOLDS;
    
    // Motion health
    const motionHealthy = 
      motion.energetic / 100 <= t.motion.energetic.max &&
      motion.maxKineticStreak <= t.motion.kineticStreak.max &&
      motion.motionVolatility >= t.motion.volatility.min &&
      motion.motionVolatility <= t.motion.volatility.max;
    
    // Camera health
    const cameraHealthy = 
      camera.macro / 100 <= t.camera.macro.max &&
      camera.tightStreak <= t.camera.tightStreak.max;
    
    // Movement health
    const movementHealthy = 
      movement.static / 100 >= t.movement.static.min &&
      movement.static / 100 <= t.movement.static.max &&
      movement.push / 100 <= t.movement.push.max &&
      movement.movementRatio <= t.movement.movementRatio.max &&
      movement.pushStreak <= t.movement.pushStreak.max;
    
    // Emphasis health
    const emphasisHealthy = emphasis.strong / 100 <= t.emphasis.strong.max;
    
    // Transition health
    const transitionHealthy = transition.firm / 100 <= t.transition.firm.max;
    
    return motionHealthy && cameraHealthy && movementHealthy && emphasisHealthy && transitionHealthy;
  }
  
  private static computeKineticStreak(behaviors: string[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    behaviors.forEach(behavior => {
      if (behavior === 'assertive' || behavior === 'energetic') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }
  
  private static computeTightStreak(shots: string[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    shots.forEach(shot => {
      if (shot === 'focus' || shot === 'macro') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }
  
  private static computePushStreak(movements: string[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    movements.forEach(movement => {
      if (movement === 'push') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }
  
  private static computeVolatility(behaviors: string[]): number {
    if (behaviors.length <= 1) return 0;
    
    let switches = 0;
    for (let i = 1; i < behaviors.length; i++) {
      if (behaviors[i] !== behaviors[i - 1]) {
        switches++;
      }
    }
    
    return switches / (behaviors.length - 1);
  }
  
  private static getEmptyMetrics(): GlobalMetrics {
    return {
      motion: {
        calm: 0,
        technical: 0,
        assertive: 0,
        energetic: 0,
        maxKineticStreak: 0,
        motionVolatility: 0,
      },
      camera: {
        standard: 0,
        wide: 0,
        focus: 0,
        macro: 0,
        tightStreak: 0,
      },
      movement: {
        static: 0,
        drift: 0,
        push: 0,
        hold: 0,
        pushStreak: 0,
        movementRatio: 0,
      },
      emphasis: {
        strong: 0,
      },
      transition: {
        firm: 0,
      },
    };
  }
}
