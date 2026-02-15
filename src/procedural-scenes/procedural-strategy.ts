/**
 * Procedural Strategy
 * 
 * Decide WHEN to use procedural generation.
 * 
 * Trigger when scene is:
 * - conceptual, process-driven, data-heavy
 * - comparative, system-based, educational, abstract
 * 
 * Avoid procedural for:
 * - emotional storytelling
 * - human subjects
 * - cinematic atmosphere
 * - nature
 * 
 * Humans beat diagrams for emotion. Always.
 */

import { VisualIntent, VisualCategory } from '../asset-intelligence/visual-intent-extractor';

/**
 * Procedural Trigger
 */
export type ProceduralTrigger =
  | 'conceptual'
  | 'process-driven'
  | 'data-heavy'
  | 'comparative'
  | 'system-based'
  | 'educational'
  | 'abstract';

/**
 * Procedural Strategy
 */
export class ProceduralStrategy {
  /**
   * Determine if procedural should be used
   */
  static shouldUseProcedural(intent: VisualIntent): boolean {
    // Avoid for emotional/human/nature content
    if (this.shouldAvoidProcedural(intent)) {
      return false;
    }
    
    // Trigger for specific categories
    return this.matchesTrigger(intent);
  }
  
  /**
   * Check if procedural should be avoided
   */
  private static shouldAvoidProcedural(intent: VisualIntent): boolean {
    // Avoid for emotional storytelling
    if (intent.emotionalTone === 'inspiring' && intent.visualCategory === 'real_world') {
      return true;
    }
    
    // Avoid for human subjects (implied by real_world + high emotion)
    if (intent.visualCategory === 'real_world' && intent.abstractionLevel === 'concrete') {
      return true;
    }
    
    // Avoid for cinematic atmosphere
    if (intent.location === 'nature' || intent.location === 'space') {
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if intent matches procedural triggers
   */
  private static matchesTrigger(intent: VisualIntent): boolean {
    const triggers: Record<VisualCategory, boolean> = {
      'real_world': false,
      'abstract': true,        // ✅ abstract
      'data': true,            // ✅ data-heavy
      'historical': false,
      'conceptual': true,      // ✅ conceptual
      'process': true,         // ✅ process-driven
      'ui/tech': true,         // ✅ system-based
    };
    
    return triggers[intent.visualCategory] || false;
  }
  
  /**
   * Get trigger reason
   */
  static getTriggerReason(intent: VisualIntent): ProceduralTrigger | null {
    if (!this.shouldUseProcedural(intent)) {
      return null;
    }
    
    const categoryMap: Record<VisualCategory, ProceduralTrigger | null> = {
      'real_world': null,
      'abstract': 'abstract',
      'data': 'data-heavy',
      'historical': null,
      'conceptual': 'conceptual',
      'process': 'process-driven',
      'ui/tech': 'system-based',
    };
    
    return categoryMap[intent.visualCategory];
  }
}
