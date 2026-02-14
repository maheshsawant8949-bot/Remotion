/**
 * Transition Continuity Detection
 * 
 * Detects visual structure similarity for match-cut eligibility.
 * Continuity is one of the fastest ways to feel cinematic.
 */

/**
 * Continuity Detector
 */
export class ContinuityDetector {
  /**
   * Detect layout continuity
   * 
   * If layout types match → bias toward match-cut
   */
  static detectLayoutContinuity(currentScene: any, nextScene: any): boolean {
    const currentLayout = currentScene.layout;
    const nextLayout = nextScene.layout;
    
    if (!currentLayout || !nextLayout) {
      return false;
    }
    
    return currentLayout === nextLayout;
  }
  
  /**
   * Detect element continuity
   * 
   * If primary element types match → bias toward match-cut
   * 
   * Examples:
   * - diagram → diagram
   * - stat → stat
   * - object → object
   */
  static detectElementContinuity(currentScene: any, nextScene: any): boolean {
    // Get primary layer types
    const currentLayers = currentScene.layers || [];
    const nextLayers = nextScene.layers || [];
    
    if (currentLayers.length === 0 || nextLayers.length === 0) {
      return false;
    }
    
    // Get primary element type (first layer)
    const currentPrimary = currentLayers[0]?.type;
    const nextPrimary = nextLayers[0]?.type;
    
    if (!currentPrimary || !nextPrimary) {
      return false;
    }
    
    // Check for matching types
    const matchingTypes = [
      'three',      // 3D object → 3D object
      'svg',        // Diagram → Diagram
      'bar_chart',  // Chart → Chart
      'timeline',   // Timeline → Timeline
      'image',      // Image → Image
    ];
    
    if (matchingTypes.includes(currentPrimary) && currentPrimary === nextPrimary) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if scenes have continuity
   */
  static hasContinuity(currentScene: any, nextScene: any): boolean {
    return this.detectLayoutContinuity(currentScene, nextScene) || 
           this.detectElementContinuity(currentScene, nextScene);
  }
  
  /**
   * Get continuity reason
   */
  static getContinuityReason(currentScene: any, nextScene: any): string {
    if (this.detectLayoutContinuity(currentScene, nextScene)) {
      return `Layout continuity (${currentScene.layout} → ${nextScene.layout})`;
    }
    
    if (this.detectElementContinuity(currentScene, nextScene)) {
      const elementType = currentScene.layers?.[0]?.type || 'element';
      return `Element continuity (${elementType} → ${elementType})`;
    }
    
    return 'Continuity detected';
  }
}
