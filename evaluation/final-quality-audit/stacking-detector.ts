/**
 * Stacking Detector
 * 
 * CRITICAL: Detect intensity stacking.
 * 
 * Scan scenes for combinations like:
 * - energetic motion + push camera + macro shot + firm transition + strong emphasis
 * 
 * If 3+ appear together → Flag HIGH RISK
 */

/**
 * Stacking Risk
 */
export interface StackingRisk {
  sceneIndex: number;
  stackedFactors: string[];
  riskLevel: 'high' | 'medium' | 'low';
  recommendation: string;
}

/**
 * Stacking Detector
 */
export class StackingDetector {
  /**
   * Detect intensity stacking across all scenes
   */
  static detect(scenes: any[]): StackingRisk[] {
    const risks: StackingRisk[] = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const factors: string[] = [];
      
      // Check energetic motion
      if (scene.trace?.motionBehavior?.type === 'kinetic') {
        factors.push('energetic motion');
      }
      
      // Check push camera
      if (scene.trace?.cameraMovement?.type === 'push') {
        factors.push('push camera');
      }
      
      // Check macro shot
      if (scene.trace?.cameraShot?.type === 'macro') {
        factors.push('macro shot');
      }
      
      // Check firm transition
      if (scene.trace?.cinematicTransition?.type === 'ease-through') {
        factors.push('firm transition');
      }
      
      // Check strong emphasis
      if (scene.trace?.emphasis?.level === 'strong') {
        factors.push('strong emphasis');
      }
      
      // Flag if 3+ factors
      if (factors.length >= 3) {
        risks.push({
          sceneIndex: i,
          stackedFactors: factors,
          riskLevel: factors.length >= 4 ? 'high' : 'medium',
          recommendation: 'Downgrade priority: micro → transition → movement → motion (never emphasis first)',
        });
      }
    }
    
    return risks;
  }
  
  /**
   * Get stacking summary
   */
  static getSummary(risks: StackingRisk[]): {
    highRiskCount: number;
    mediumRiskCount: number;
    totalRisks: number;
  } {
    return {
      highRiskCount: risks.filter(r => r.riskLevel === 'high').length,
      mediumRiskCount: risks.filter(r => r.riskLevel === 'medium').length,
      totalRisks: risks.length,
    };
  }
}
