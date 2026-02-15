/**
 * Readability Scanner
 * 
 * VERY IMPORTANT: Viewer comprehension > cinematic flair. Always.
 * 
 * Estimate scenes where viewer load is high:
 * - high density + movement + fast curve
 * 
 * Flag as cognitive risk.
 */

/**
 * Readability Risk
 */
export interface ReadabilityRisk {
  sceneIndex: number;
  cognitiveLoad: 'high' | 'medium' | 'low';
  factors: string[];
}

/**
 * Readability Scanner
 */
export class ReadabilityScanner {
  /**
   * Scan for cognitive load risks
   */
  static scan(scenes: any[]): ReadabilityRisk[] {
    const risks: ReadabilityRisk[] = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const factors: string[] = [];
      let loadScore = 0;
      
      // High density
      if (scene.density !== undefined && scene.density >= 7) {
        factors.push('high density');
        loadScore += 2;
      }
      
      // Movement
      if (
        scene.trace?.cameraMovement?.type === 'push' ||
        scene.trace?.cameraMovement?.type === 'drift'
      ) {
        factors.push('camera movement');
        loadScore += 1;
      }
      
      // Fast curve
      if (scene.trace?.motionCurve?.type === 'swift') {
        factors.push('fast curve');
        loadScore += 1;
      }
      
      // Tight shot (adds pressure)
      if (scene.trace?.cameraShot?.type === 'tight') {
        factors.push('tight framing');
        loadScore += 1;
      }
      
      // Flag if load score >= 3
      if (loadScore >= 3) {
        risks.push({
          sceneIndex: i,
          cognitiveLoad: loadScore >= 4 ? 'high' : 'medium',
          factors,
        });
      }
    }
    
    return risks;
  }
  
  /**
   * Get readability summary
   */
  static getSummary(risks: ReadabilityRisk[]): {
    highLoadCount: number;
    mediumLoadCount: number;
    totalRisks: number;
  } {
    return {
      highLoadCount: risks.filter(r => r.cognitiveLoad === 'high').length,
      mediumLoadCount: risks.filter(r => r.cognitiveLoad === 'medium').length,
      totalRisks: risks.length,
    };
  }
}
