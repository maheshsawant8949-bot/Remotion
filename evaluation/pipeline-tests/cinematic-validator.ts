/**
 * Cinematic Baseline Validator
 * 
 * Validates reveal strategy distribution against frozen baseline.
 * FAILS if spotlight/build frequency increases unexpectedly.
 */

import * as fs from 'fs';
import * as path from 'path';

type RevealStrategyName = "instant" | "stagger" | "spotlight" | "build";

type CinematicBaseline = {
  _metadata: {
    version: string;
    totalScripts: number;
    frequencyDistribution: Record<RevealStrategyName, number>;
    percentages: Record<RevealStrategyName, number>;
    regressionConstraints: {
      maxSpotlight: number;
      maxBuild: number;
      minInstant: number;
      description: string;
    };
    governorDowngrades: number;
  };
  [scriptId: string]: any;
};

type ValidationResult = {
  pass: boolean;
  errors: string[];
  warnings: string[];
  distribution: Record<RevealStrategyName, number>;
};

export class CinematicValidator {
  /**
   * Validate current reveal distribution against cinematic baseline.
   * 
   * @param actualResults - Current test results with reveal strategies
   * @param baselinePath - Path to cinematic baseline JSON
   * @returns Validation result with pass/fail and details
   */
  static validate(
    actualResults: Record<string, any>,
    baselinePath: string
  ): ValidationResult {
    const baseline: CinematicBaseline = JSON.parse(
      fs.readFileSync(baselinePath, 'utf-8')
    );

    const errors: string[] = [];
    const warnings: string[] = [];

    // Calculate current distribution
    const distribution: Record<RevealStrategyName, number> = {
      instant: 0,
      stagger: 0,
      spotlight: 0,
      build: 0,
    };

    Object.values(actualResults).forEach((result: any) => {
      const strategy = result.revealStrategy as RevealStrategyName;
      if (strategy) {
        distribution[strategy]++;
      }
    });

    const constraints = baseline._metadata.regressionConstraints;

    // REGRESSION CHECKS (FAIL conditions)
    
    // 1. Spotlight frequency must not increase
    if (distribution.spotlight > constraints.maxSpotlight) {
      errors.push(
        `❌ SPOTLIGHT OVERUSE: Found ${distribution.spotlight}, max allowed ${constraints.maxSpotlight}. ` +
        `Spotlight is rare and dramatic - this increase suggests over-triggering.`
      );
    }

    // 2. Build frequency must not increase significantly
    if (distribution.build > constraints.maxBuild) {
      errors.push(
        `❌ BUILD OVERUSE: Found ${distribution.build}, max allowed ${constraints.maxBuild}. ` +
        `Build is for system explanations - this increase suggests over-triggering.`
      );
    }

    // 3. Instant frequency must remain dominant
    if (distribution.instant < constraints.minInstant) {
      errors.push(
        `❌ INSTANT UNDERUSE: Found ${distribution.instant}, min required ${constraints.minInstant}. ` +
        `Instant should be the most common strategy (scarcity principle violated).`
      );
    }

    // WARNINGS (informational)
    
    // Warn if stagger appears (it didn't in baseline)
    if (distribution.stagger > 0) {
      warnings.push(
        `⚠️  STAGGER INTRODUCED: Found ${distribution.stagger} stagger reveals (baseline had 0). ` +
        `Verify this is intentional for cognitive protection.`
      );
    }

    // Warn if distribution changed significantly
    const baselineDistribution = baseline._metadata.frequencyDistribution;
    Object.keys(distribution).forEach((strategy) => {
      const key = strategy as RevealStrategyName;
      const current = distribution[key];
      const expected = baselineDistribution[key];
      const diff = current - expected;
      
      if (diff !== 0 && key !== 'spotlight' && key !== 'build') {
        warnings.push(
          `⚠️  ${key.toUpperCase()} CHANGED: ${expected} → ${current} (${diff > 0 ? '+' : ''}${diff})`
        );
      }
    });

    return {
      pass: errors.length === 0,
      errors,
      warnings,
      distribution,
    };
  }

  /**
   * Print validation results to console.
   */
  static printResults(result: ValidationResult): void {
    console.log("\n🎬 CINEMATIC BASELINE VALIDATION");
    console.log("===================================");
    
    // Distribution
    console.log("\nCurrent Distribution:");
    Object.entries(result.distribution).forEach(([strategy, count]) => {
      const percentage = Math.round((count / 15) * 100);
      console.log(`  ${strategy}: ${count} (${percentage}%)`);
    });

    // Errors
    if (result.errors.length > 0) {
      console.log("\n❌ REGRESSION FAILURES:");
      result.errors.forEach(error => console.log(`  ${error}`));
    }

    // Warnings
    if (result.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      result.warnings.forEach(warning => console.log(`  ${warning}`));
    }

    // Result
    console.log(`\nRESULT: ${result.pass ? '✅ PASS' : '❌ FAIL'}`);
    console.log("===================================\n");
  }
}
