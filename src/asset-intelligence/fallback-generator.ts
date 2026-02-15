/**
 * Fallback Generator
 * 
 * When no asset meets standards:
 * Auto-switch to procedural_scene, minimal typography, or diagram.
 * 
 * Never use bad visuals.
 * Bad visuals destroy perceived quality instantly.
 */

import { VisualIntent, VisualCategory } from './visual-intent-extractor';

/**
 * Fallback Type
 */
export type FallbackType =
  | 'procedural_scene'
  | 'minimal_typography'
  | 'diagram';

/**
 * Fallback Config
 */
export interface FallbackConfig {
  type: FallbackType;
  config: any;
  reason: string;
}

/**
 * Fallback Generator
 */
export class FallbackGenerator {
  /**
   * Generate fallback when no asset meets standards
   */
  static generate(intent: VisualIntent): FallbackConfig {
    // Data/process → diagram
    if (this.shouldUseDiagram(intent)) {
      return {
        type: 'diagram',
        config: {
          style: 'minimal',
          concept: intent.primaryConcept,
          category: intent.visualCategory,
        },
        reason: 'Data/process visualization requires diagram',
      };
    }
    
    // Abstract concepts → procedural scene
    if (this.shouldUseProcedural(intent)) {
      return {
        type: 'procedural_scene',
        config: {
          pattern: this.selectPattern(intent),
          tone: intent.emotionalTone || 'calm',
          abstractionLevel: intent.abstractionLevel,
        },
        reason: 'Abstract concept requires procedural generation',
      };
    }
    
    // Default → minimal typography
    return {
      type: 'minimal_typography',
      config: {
        text: intent.primaryConcept,
        style: 'editorial',
        emphasis: intent.emotionalTone === 'inspiring' ? 'strong' : 'mild',
      },
      reason: 'No suitable asset found, using minimal typography',
    };
  }
  
  /**
   * Check if diagram should be used
   */
  private static shouldUseDiagram(intent: VisualIntent): boolean {
    return (
      intent.visualCategory === 'data' ||
      intent.visualCategory === 'process' ||
      (intent.visualCategory === 'conceptual' && intent.abstractionLevel === 'semi-abstract')
    );
  }
  
  /**
   * Check if procedural should be used
   */
  private static shouldUseProcedural(intent: VisualIntent): boolean {
    return (
      intent.abstractionLevel === 'abstract' ||
      intent.visualCategory === 'abstract' ||
      (intent.visualCategory === 'conceptual' && intent.abstractionLevel === 'abstract')
    );
  }
  
  /**
   * Select procedural pattern
   */
  private static selectPattern(intent: VisualIntent): string {
    if (intent.emotionalTone === 'energetic') return 'dynamic-particles';
    if (intent.emotionalTone === 'calm') return 'gentle-waves';
    if (intent.visualCategory === 'ui/tech') return 'grid-network';
    
    return 'geometric-shapes';
  }
  
  /**
   * Validate fallback quality
   */
  static validateFallback(config: FallbackConfig): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check config completeness
    if (!config.config) {
      issues.push('Missing fallback configuration');
    }
    
    // Check reason is provided
    if (!config.reason) {
      issues.push('Missing fallback reason');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
