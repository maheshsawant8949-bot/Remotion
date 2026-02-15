/**
 * Asset Strategy Engine
 * 
 * Choose ONE path per scene based on visual intent and duration.
 */

import { VisualIntent, VisualCategory } from './visual-intent-extractor';

/**
 * Asset Path
 */
export type AssetPath =
  | 'stock_footage'
  | 'stock_photo'
  | 'vector'
  | 'procedural'
  | 'ai_generated'
  | 'hybrid';

/**
 * Asset Strategy
 */
export interface AssetStrategy {
  path: AssetPath;
  reason: string;
}

/**
 * Asset Strategy Engine
 */
export class AssetStrategyEngine {
  /**
   * Choose asset path based on intent and duration
   */
  static choose(intent: VisualIntent, duration: number): AssetStrategy {
    // Prefer footage over photos when:
    // - scene > 3 seconds
    // - emotion present
    // - macro topic
    // Motion feels premium.
    
    if (this.shouldUseFootage(intent, duration)) {
      return {
        path: 'stock_footage',
        reason: 'Real-world scene >3s with emotion (motion = premium)',
      };
    }
    
    // Prefer procedural when:
    // - explaining
    // - diagramming
    // - showing flow
    // - breaking concepts
    // Top educational channels do this constantly.
    
    if (this.shouldUseProcedural(intent)) {
      return {
        path: 'procedural',
        reason: 'Process/data visualization (educational clarity)',
      };
    }
    
    // Prefer AI when:
    // - concept has no real footage
    // - future tech
    // - impossible visuals
    // - microscopic
    // - cosmic
    // DO NOT overuse AI imagery. It ages quickly.
    
    if (this.shouldUseAI(intent)) {
      return {
        path: 'ai_generated',
        reason: 'Future/abstract concept with no real footage available',
      };
    }
    
    // Prefer vector for:
    // - UI/tech
    // - Clean diagrams
    // - Icon-based content
    
    if (intent.visualCategory === 'ui/tech') {
      return {
        path: 'vector',
        reason: 'UI/tech content (clean, scalable)',
      };
    }
    
    // Hybrid for complex scenes
    if (duration > 5 && intent.abstractionLevel === 'semi-abstract') {
      return {
        path: 'hybrid',
        reason: 'Long scene with semi-abstract content (layered approach)',
      };
    }
    
    // Default: stock photo
    return {
      path: 'stock_photo',
      reason: 'Default static visual',
    };
  }
  
  /**
   * Check if footage is preferred
   */
  private static shouldUseFootage(intent: VisualIntent, duration: number): boolean {
    return (
      duration > 3 &&
      intent.visualCategory === 'real_world' &&
      (intent.emotionalTone === 'energetic' || intent.emotionalTone === 'inspiring')
    );
  }
  
  /**
   * Check if procedural is preferred
   */
  private static shouldUseProcedural(intent: VisualIntent): boolean {
    return (
      intent.visualCategory === 'process' ||
      intent.visualCategory === 'data' ||
      (intent.visualCategory === 'conceptual' && intent.abstractionLevel === 'semi-abstract')
    );
  }
  
  /**
   * Check if AI generation is preferred
   */
  private static shouldUseAI(intent: VisualIntent): boolean {
    return (
      intent.era === 'future' ||
      intent.location === 'space' ||
      (intent.abstractionLevel === 'abstract' && intent.visualCategory === 'conceptual')
    );
  }
  
  /**
   * Get strategy statistics
   */
  static getStats(strategies: AssetStrategy[]): {
    distribution: Record<AssetPath, number>;
    mostCommon: AssetPath;
  } {
    const distribution: Record<AssetPath, number> = {
      stock_footage: 0,
      stock_photo: 0,
      vector: 0,
      procedural: 0,
      ai_generated: 0,
      hybrid: 0,
    };
    
    strategies.forEach(s => {
      distribution[s.path]++;
    });
    
    const mostCommon = Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)[0][0] as AssetPath;
    
    return { distribution, mostCommon };
  }
}
