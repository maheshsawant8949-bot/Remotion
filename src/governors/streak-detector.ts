/**
 * Streak Detector
 * 
 * Detects consecutive patterns across scenes.
 * Used for identifying pressure chains and intensity clustering.
 */

/**
 * Streak Detector
 */
export class StreakDetector {
  /**
   * Detect max consecutive kinetic (assertive/energetic) streak
   */
  static detectKineticStreak(scenes: any[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    scenes.forEach(scene => {
      const behavior = scene.trace?.motionBehavior?.behavior;
      
      if (behavior === 'assertive' || behavior === 'energetic') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }
  
  /**
   * Detect max consecutive tight (focus/macro) streak
   */
  static detectTightStreak(scenes: any[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    scenes.forEach(scene => {
      const shot = scene.trace?.cameraShot?.type;
      
      if (shot === 'focus' || shot === 'macro') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }
  
  /**
   * Detect max consecutive push streak
   */
  static detectPushStreak(scenes: any[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    scenes.forEach(scene => {
      const movement = scene.trace?.cameraMovement?.type;
      
      if (movement === 'push') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }
  
  /**
   * Detect consecutive pressure
   * Returns scene indices where >2 pressure layers apply simultaneously
   */
  static detectConsecutivePressure(scenes: any[]): number[] {
    const pressureScenes: number[] = [];
    
    scenes.forEach((scene, i) => {
      const pressureLayers = this.countPressureLayers(scene);
      
      if (pressureLayers > 2) {
        pressureScenes.push(i);
      }
    });
    
    // Find consecutive chains
    const chains: number[] = [];
    let chainStart = -1;
    
    for (let i = 0; i < pressureScenes.length; i++) {
      if (chainStart === -1) {
        chainStart = pressureScenes[i];
      }
      
      // Check if next is consecutive
      if (i + 1 < pressureScenes.length && pressureScenes[i + 1] === pressureScenes[i] + 1) {
        continue;
      } else {
        // Chain ended
        if (chainStart !== -1) {
          chains.push(chainStart);
        }
        chainStart = -1;
      }
    }
    
    return chains;
  }
  
  /**
   * Count pressure layers in a scene
   */
  private static countPressureLayers(scene: any): number {
    let count = 0;
    
    // Kinetic motion
    const behavior = scene.trace?.motionBehavior?.behavior;
    if (behavior === 'assertive' || behavior === 'energetic') {
      count++;
    }
    
    // Tight shot
    const shot = scene.trace?.cameraShot?.type;
    if (shot === 'focus' || shot === 'macro') {
      count++;
    }
    
    // Push movement
    const movement = scene.trace?.cameraMovement?.type;
    if (movement === 'push') {
      count++;
    }
    
    // Firm transition
    const transition = scene.trace?.transitionFromPrevious?.type;
    if (transition === 'firm') {
      count++;
    }
    
    return count;
  }
}
