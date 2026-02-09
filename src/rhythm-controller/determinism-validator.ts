/**
 * Determinism Validator
 * 
 * Ensures rhythm controller remains deterministic.
 * 
 * CRITICAL: Random intensity destroys editorial trust.
 * Same input MUST produce same output, always.
 */

import { RhythmInput, RhythmAnalysis } from './rhythm-types';
import { RhythmConductor } from './rhythm-conductor';

export class DeterminismValidator {
  /**
   * Validate that rhythm conductor is deterministic.
   * Runs the same input multiple times and ensures identical output.
   * 
   * Throws error if non-determinism detected.
   */
  static validate(inputs: RhythmInput[]): void {
    const VALIDATION_RUNS = 3;
    const results: RhythmAnalysis[] = [];
    
    // Run multiple times
    for (let i = 0; i < VALIDATION_RUNS; i++) {
      results.push(RhythmConductor.conduct(inputs));
    }
    
    // Compare all results
    const baseline = results[0];
    for (let i = 1; i < results.length; i++) {
      this.assertIdentical(baseline, results[i], i);
    }
  }

  /**
   * Assert that two rhythm analyses are identical.
   * Throws detailed error if they differ.
   */
  private static assertIdentical(
    baseline: RhythmAnalysis,
    comparison: RhythmAnalysis,
    runNumber: number
  ): void {
    // Check scene count
    if (baseline.scenes.length !== comparison.scenes.length) {
      throw new Error(
        `[DETERMINISM VIOLATION] Scene count differs:\n` +
        `  Baseline: ${baseline.scenes.length}\n` +
        `  Run ${runNumber}: ${comparison.scenes.length}`
      );
    }
    
    // Check each scene
    for (let i = 0; i < baseline.scenes.length; i++) {
      const baseScene = baseline.scenes[i];
      const compScene = comparison.scenes[i];
      
      if (baseScene.suggestedEmphasis !== compScene.suggestedEmphasis) {
        throw new Error(
          `[DETERMINISM VIOLATION] Scene ${i} emphasis differs:\n` +
          `  Baseline: ${baseScene.suggestedEmphasis}\n` +
          `  Run ${runNumber}: ${compScene.suggestedEmphasis}\n` +
          `  This indicates non-deterministic behavior (randomness or time-based logic).\n` +
          `  Rhythm controller MUST be deterministic.`
        );
      }
      
      if (baseScene.narrativePhase !== compScene.narrativePhase) {
        throw new Error(
          `[DETERMINISM VIOLATION] Scene ${i} narrative phase differs:\n` +
          `  Baseline: ${baseScene.narrativePhase}\n` +
          `  Run ${runNumber}: ${compScene.narrativePhase}`
        );
      }
    }
    
    // Check adjustment count
    if (baseline.adjustmentsMade !== comparison.adjustmentsMade) {
      throw new Error(
        `[DETERMINISM VIOLATION] Adjustment count differs:\n` +
        `  Baseline: ${baseline.adjustmentsMade}\n` +
        `  Run ${runNumber}: ${comparison.adjustmentsMade}`
      );
    }
  }

  /**
   * Get determinism report.
   * Useful for debugging and validation.
   */
  static getReport(inputs: RhythmInput[]): {
    isDeterministic: boolean;
    runs: number;
    identicalOutputs: boolean;
    error?: string;
  } {
    try {
      this.validate(inputs);
      return {
        isDeterministic: true,
        runs: 3,
        identicalOutputs: true,
      };
    } catch (error) {
      return {
        isDeterministic: false,
        runs: 3,
        identicalOutputs: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Check for forbidden operations in code.
   * This is a static analysis helper.
   */
  static getForbiddenPatterns(): string[] {
    return [
      'Math.random()',
      'Date.now()',
      'new Date()',
      'performance.now()',
      '_.sample(',
      '_.shuffle(',
      'crypto.randomBytes(',
      'Math.floor(Math.random(',
    ];
  }
}
