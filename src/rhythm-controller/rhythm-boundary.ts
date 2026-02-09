/**
 * Rhythm Controller - Boundary Enforcement
 * 
 * CRITICAL: Rhythm Controller has strict boundaries.
 * 
 * ALLOWED:
 * ✅ Upgrade emphasis (none → soft → strong)
 * ✅ Downgrade emphasis (strong → soft → none)
 * ✅ Spread intensity across sequence
 * 
 * FORBIDDEN:
 * ❌ Change layouts
 * ❌ Change strategy
 * ❌ Change density
 * ❌ Rewrite any scene content
 * 
 * Think: Conductor — not composer.
 */

import { EmphasisLevelName } from '../emphasis-engine/emphasis-types';
import { RhythmAdjustment } from './rhythm-types';

export class RhythmBoundary {
  /**
   * Validate that a rhythm adjustment only touches emphasis.
   * Throws if attempting to modify forbidden properties.
   */
  static validateAdjustment(adjustment: RhythmAdjustment): void {
    // Rhythm can ONLY change emphasis level
    // Nothing else is allowed
    
    const allowedLevels: EmphasisLevelName[] = ['none', 'soft', 'strong'];
    
    if (!allowedLevels.includes(adjustment.originalLevel)) {
      throw new Error(
        `[RHYTHM BOUNDARY VIOLATION] Invalid original emphasis level: ${adjustment.originalLevel}`
      );
    }
    
    if (!allowedLevels.includes(adjustment.adjustedLevel)) {
      throw new Error(
        `[RHYTHM BOUNDARY VIOLATION] Invalid adjusted emphasis level: ${adjustment.adjustedLevel}`
      );
    }
  }

  /**
   * Ensure rhythm input contains ONLY read-only data.
   * Rhythm should never receive mutable scene references.
   */
  static validateInput(input: any): void {
    // Rhythm should only receive:
    // - sceneIndex (number)
    // - emphasis (EmphasisLevelName)
    // - emotionalWeight (number)
    // - strategy (string, READ-ONLY)
    // - intentType (string, READ-ONLY)
    
    const allowedKeys = ['sceneIndex', 'emphasis', 'emotionalWeight', 'strategy', 'intentType'];
    const inputKeys = Object.keys(input);
    
    const forbiddenKeys = inputKeys.filter(key => !allowedKeys.includes(key));
    
    if (forbiddenKeys.length > 0) {
      console.warn(
        `[RHYTHM BOUNDARY WARNING] Unexpected input keys: ${forbiddenKeys.join(', ')}. ` +
        `Rhythm should only receive read-only metadata, not mutable scene references.`
      );
    }
  }

  /**
   * Create a safe read-only copy of scene data for rhythm analysis.
   * Prevents accidental mutation of source scenes.
   */
  static createSafeInput(scene: any, index: number): {
    sceneIndex: number;
    emphasis: EmphasisLevelName;
    emotionalWeight: number;
    strategy: string;
    intentType?: string;
  } {
    return {
      sceneIndex: index,
      emphasis: scene.trace?.emphasis?.level || scene.emphasis?.level || 'none',
      emotionalWeight: scene.emotionalWeight || 0,
      strategy: scene.strategy || scene.layout || 'unknown',
      intentType: scene.intent?.type || scene.intentType,
    };
  }

  /**
   * Log forbidden operation attempt.
   * Used for debugging and preventing catastrophic mistakes.
   */
  static logForbiddenOperation(operation: string, details: string): void {
    console.error(
      `\n❌ [RHYTHM BOUNDARY VIOLATION]\n` +
      `   Operation: ${operation}\n` +
      `   Details: ${details}\n` +
      `   Reminder: Rhythm can ONLY adjust emphasis levels.\n` +
      `   It CANNOT change strategy, layout, or density.\n` +
      `   Think: Conductor — not composer.\n`
    );
    
    throw new Error(`Rhythm boundary violation: ${operation}`);
  }

  /**
   * Verify that rhythm output only contains emphasis adjustments.
   */
  static validateOutput(output: any): void {
    if (!output.scenes || !Array.isArray(output.scenes)) {
      throw new Error('[RHYTHM BOUNDARY] Output must contain scenes array');
    }

    output.scenes.forEach((scene: any, index: number) => {
      // Check that only emphasis-related fields are present
      const allowedFields = [
        'sceneIndex',
        'originalEmphasis',
        'suggestedEmphasis',
        'intensity',
        'narrativePhase',
        'adjustmentReason',
      ];

      const sceneKeys = Object.keys(scene);
      const forbiddenFields = sceneKeys.filter(key => !allowedFields.includes(key));

      if (forbiddenFields.length > 0) {
        this.logForbiddenOperation(
          'Invalid output fields',
          `Scene ${index} contains forbidden fields: ${forbiddenFields.join(', ')}`
        );
      }

      // Verify no strategy/layout/density modifications
      if ('strategy' in scene || 'layout' in scene || 'density' in scene) {
        this.logForbiddenOperation(
          'Attempted to modify forbidden properties',
          `Scene ${index} contains strategy/layout/density modifications`
        );
      }
    });
  }
}
