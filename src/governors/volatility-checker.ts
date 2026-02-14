/**
 * Volatility Checker
 * 
 * Detects jitter and volatility spikes.
 * Smooth systems feel premium. Jitter feels automated.
 */

/**
 * Volatility Checker
 */
export class VolatilityChecker {
  /**
   * Compute motion volatility
   * volatility = behavior switches / (scene count - 1)
   */
  static computeMotionVolatility(scenes: any[]): number {
    if (scenes.length <= 1) return 0;
    
    let switches = 0;
    
    for (let i = 1; i < scenes.length; i++) {
      const prevBehavior = scenes[i - 1].trace?.motionBehavior?.behavior || 'calm';
      const currBehavior = scenes[i].trace?.motionBehavior?.behavior || 'calm';
      
      if (prevBehavior !== currBehavior) {
        switches++;
      }
    }
    
    return switches / (scenes.length - 1);
  }
  
  /**
   * Check if volatility is too high (jittery)
   */
  static isVolatile(volatility: number): boolean {
    return volatility > 0.45;
  }
  
  /**
   * Check if volatility is healthy
   * Healthy range: 0.25 - 0.40
   */
  static isHealthy(volatility: number): boolean {
    return volatility >= 0.25 && volatility <= 0.40;
  }
  
  /**
   * Compute camera shot volatility
   */
  static computeCameraVolatility(scenes: any[]): number {
    if (scenes.length <= 1) return 0;
    
    let switches = 0;
    
    for (let i = 1; i < scenes.length; i++) {
      const prevShot = scenes[i - 1].trace?.cameraShot?.type || 'standard';
      const currShot = scenes[i].trace?.cameraShot?.type || 'standard';
      
      if (prevShot !== currShot) {
        switches++;
      }
    }
    
    return switches / (scenes.length - 1);
  }
  
  /**
   * Compute movement volatility
   */
  static computeMovementVolatility(scenes: any[]): number {
    if (scenes.length <= 1) return 0;
    
    let switches = 0;
    
    for (let i = 1; i < scenes.length; i++) {
      const prevMovement = scenes[i - 1].trace?.cameraMovement?.type || 'static';
      const currMovement = scenes[i].trace?.cameraMovement?.type || 'static';
      
      if (prevMovement !== currMovement) {
        switches++;
      }
    }
    
    return switches / (scenes.length - 1);
  }
}
