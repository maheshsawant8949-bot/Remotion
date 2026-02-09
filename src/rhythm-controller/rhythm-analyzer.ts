/**
 * Rhythm Analyzer
 * 
 * Runtime integration for rhythm controller.
 * Executes AFTER scene compilation, BEFORE final emphasis lock.
 * 
 * CRITICAL: Simple systems are tunable systems.
 * Do NOT overcomplicate this.
 */

import { IntensityAnalyzer } from './intensity-analyzer';
import { NarrativeDetector } from './narrative-detector';
import { ScarcityProtector } from './scarcity-protector';
import { CognitiveRecoveryDetector } from './cognitive-recovery';
import { RhythmBoundary } from './rhythm-boundary';

export interface RhythmInput {
  sceneIndex: number;
  emotionalWeight: number;
  density: number;
  revealType: string;
  emphasisCandidate: 'none' | 'soft' | 'strong';
  currentEmphasis: 'none' | 'soft' | 'strong';
  strategy?: string;
  intentType?: string;
}

export interface RhythmAdjustment {
  action: 'elevated_to_peak' | 'downgraded_for_spacing' | 'downgraded_for_recovery' | 'downgraded_for_scarcity' | 'no_change';
  reason: string;
  originalEmphasis: 'none' | 'soft' | 'strong';
  adjustedEmphasis: 'none' | 'soft' | 'strong';
}

export interface RhythmOutput {
  sceneIndex: number;
  finalEmphasis: 'none' | 'soft' | 'strong';
  rhythmAdjustment?: RhythmAdjustment;
}

export class RhythmAnalyzer {
  /**
   * Main entry point for rhythm analysis.
   * 
   * Execution order:
   * 1. Generate intensity scores
   * 2. Build intensity map
   * 3. Detect flatlines
   * 4. Detect clusters
   * 5. Guarantee at least one peak
   * 6. Respect recovery windows
   * 7. Upgrade decision trace
   * 
   * @param inputs - Scene data after compilation
   * @returns Adjusted emphasis with rhythm trace
   */
  static analyze(inputs: RhythmInput[]): RhythmOutput[] {
    // BOUNDARY ENFORCEMENT: Validate inputs
    inputs.forEach(input => RhythmBoundary.validateInput(input));

    // Step 1: Generate intensity scores
    const intensityScores = this.generateIntensityScores(inputs);

    // Step 2: Build intensity map
    const intensityMap = intensityScores.map(score => score.composite);

    // Initialize outputs with current emphasis
    const outputs: RhythmOutput[] = inputs.map((input, index) => ({
      sceneIndex: index,
      finalEmphasis: input.currentEmphasis,
    }));

    // Step 3: Detect flatlines
    const flatlineAdjustments = this.detectFlatlines(intensityScores, outputs);

    // Step 4: Detect clusters
    const clusterAdjustments = this.detectClusters(outputs);

    // Step 5: Guarantee at least one peak
    const peakGuarantee = this.guaranteePeak(intensityScores, outputs);

    // Step 6: Respect recovery windows
    const recoveryAdjustments = this.respectRecovery(intensityScores, outputs);

    // Step 7: Apply scarcity protection (final pass)
    const scarcityAdjustments = this.enforceScarcity(intensityScores, outputs);

    // Validate output
    this.validateOutput(outputs);

    return outputs;
  }

  /**
   * Step 1: Generate intensity scores.
   * 
   * Simple composite score:
   * - Emotional weight: low=1, medium=2, high=3
   * - Density: low=1, medium=2, high=3
   * - Reveal type: none=0, soft=1, spotlight=2
   * - Emphasis candidate: none=0, soft=1, strong=2
   * 
   * Composite = average of all factors
   */
  private static generateIntensityScores(inputs: RhythmInput[]): Array<{
    sceneIndex: number;
    emotional: number;
    density: number;
    reveal: number;
    candidate: number;
    composite: number;
  }> {
    return inputs.map((input, index) => {
      // Emotional weight: 0-10 scale → 1-3 scale
      const emotional = input.emotionalWeight <= 3 ? 1 : input.emotionalWeight <= 6 ? 2 : 3;

      // Density: assume 0-10 scale → 1-3 scale
      const density = input.density <= 3 ? 1 : input.density <= 6 ? 2 : 3;

      // Reveal type
      const reveal = input.revealType === 'spotlight' ? 2 : input.revealType === 'soft' ? 1 : 0;

      // Emphasis candidate
      const candidate = input.emphasisCandidate === 'strong' ? 2 : input.emphasisCandidate === 'soft' ? 1 : 0;

      // Composite: simple average
      const composite = Math.round((emotional + density + reveal + candidate) / 4);

      return {
        sceneIndex: index,
        emotional,
        density,
        reveal,
        candidate,
        composite: Math.max(1, Math.min(3, composite)), // Clamp to 1-3
      };
    });
  }

  /**
   * Step 3: Detect flatlines.
   * 
   * If many scenes cluster at the same intensity:
   * - Identify the strongest candidate
   * - Elevate ONE to strong emphasis
   * - Never multiple
   */
  private static detectFlatlines(
    intensityScores: Array<{ sceneIndex: number; composite: number; emotional: number }>,
    outputs: RhythmOutput[]
  ): number {
    const FLATLINE_THRESHOLD = 12; // 12+ scenes without strong
    let consecutiveNonStrong = 0;
    let flatlineStart = 0;
    let adjustments = 0;

    for (let i = 0; i < outputs.length; i++) {
      if (outputs[i].finalEmphasis === 'strong') {
        // Check if we just exited a flatline
        if (consecutiveNonStrong >= FLATLINE_THRESHOLD) {
          // Find strongest candidate in flatline region
          let strongestIndex = flatlineStart;
          let strongestScore = intensityScores[flatlineStart].composite;

          for (let j = flatlineStart + 1; j < i; j++) {
            if (intensityScores[j].composite > strongestScore) {
              strongestScore = intensityScores[j].composite;
              strongestIndex = j;
            }
          }

          // Elevate if it has decent emotion (earned peak)
          if (intensityScores[strongestIndex].emotional >= 2) {
            outputs[strongestIndex].finalEmphasis = 'strong';
            outputs[strongestIndex].rhythmAdjustment = {
              action: 'elevated_to_peak',
              reason: 'intensity_flatline',
              originalEmphasis: outputs[strongestIndex].finalEmphasis,
              adjustedEmphasis: 'strong',
            };
            adjustments++;
          }
        }

        consecutiveNonStrong = 0;
      } else {
        if (consecutiveNonStrong === 0) {
          flatlineStart = i;
        }
        consecutiveNonStrong++;
      }
    }

    // Handle trailing flatline
    if (consecutiveNonStrong >= FLATLINE_THRESHOLD) {
      let strongestIndex = flatlineStart;
      let strongestScore = intensityScores[flatlineStart].composite;

      for (let j = flatlineStart + 1; j < outputs.length; j++) {
        if (intensityScores[j].composite > strongestScore) {
          strongestScore = intensityScores[j].composite;
          strongestIndex = j;
        }
      }

      if (intensityScores[strongestIndex].emotional >= 2) {
        outputs[strongestIndex].finalEmphasis = 'strong';
        outputs[strongestIndex].rhythmAdjustment = {
          action: 'elevated_to_peak',
          reason: 'intensity_flatline',
          originalEmphasis: outputs[strongestIndex].finalEmphasis,
          adjustedEmphasis: 'strong',
        };
        adjustments++;
      }
    }

    return adjustments;
  }

  /**
   * Step 4: Detect clusters.
   * 
   * If strong scenes appear too close:
   * - Downgrade later ones unless signals are overwhelming
   * - Spacing creates drama
   */
  private static detectClusters(outputs: RhythmOutput[]): number {
    const WINDOW_SIZE = 4;
    let adjustments = 0;

    for (let i = 0; i <= outputs.length - WINDOW_SIZE; i++) {
      const window = outputs.slice(i, i + WINDOW_SIZE);
      const strongIndices = window
        .map((output, idx) => ({ output, idx: i + idx }))
        .filter(({ output }) => output.finalEmphasis === 'strong')
        .map(({ idx }) => idx);

      // If 2+ strong in window, downgrade all but the first
      if (strongIndices.length >= 2) {
        for (let j = 1; j < strongIndices.length; j++) {
          const sceneIndex = strongIndices[j];
          outputs[sceneIndex].finalEmphasis = 'soft';
          outputs[sceneIndex].rhythmAdjustment = {
            action: 'downgraded_for_spacing',
            reason: 'cluster_prevention',
            originalEmphasis: 'strong',
            adjustedEmphasis: 'soft',
          };
          adjustments++;
        }
      }
    }

    return adjustments;
  }

  /**
   * Step 5: Guarantee at least one peak.
   * 
   * If a long sequence contains ZERO strong candidates:
   * - Promote the highest scoring scene
   * - Otherwise the video feels informational — not directed
   */
  private static guaranteePeak(
    intensityScores: Array<{ sceneIndex: number; composite: number }>,
    outputs: RhythmOutput[]
  ): number {
    const hasStrong = outputs.some(output => output.finalEmphasis === 'strong');

    if (hasStrong) return 0;

    // Find highest scoring scene
    let highestIndex = 0;
    let highestScore = intensityScores[0].composite;

    for (let i = 1; i < intensityScores.length; i++) {
      if (intensityScores[i].composite > highestScore) {
        highestScore = intensityScores[i].composite;
        highestIndex = i;
      }
    }

    // Promote to strong
    outputs[highestIndex].finalEmphasis = 'strong';
    outputs[highestIndex].rhythmAdjustment = {
      action: 'elevated_to_peak',
      reason: 'guaranteed_peak',
      originalEmphasis: outputs[highestIndex].finalEmphasis,
      adjustedEmphasis: 'strong',
    };

    return 1;
  }

  /**
   * Step 6: Respect recovery windows.
   * 
   * After strong emphasis:
   * - Prefer softer emphasis for the next 1-2 scenes
   * - Unless overridden by extreme signals
   */
  private static respectRecovery(
    intensityScores: Array<{ sceneIndex: number; emotional: number }>,
    outputs: RhythmOutput[]
  ): number {
    let adjustments = 0;
    const OVERRIDE_THRESHOLD = 3; // Emotional level 3 = high

    for (let i = 1; i < outputs.length; i++) {
      const prevWasStrong = outputs[i - 1].finalEmphasis === 'strong';

      if (!prevWasStrong) continue;

      // Previous was strong - recovery is beneficial
      const currentEmotion = intensityScores[i].emotional;

      // Only override recovery if emotion is very high
      if (currentEmotion >= OVERRIDE_THRESHOLD) {
        continue; // Strong signals override recovery
      }

      // Downgrade to provide breathing room
      if (outputs[i].finalEmphasis !== 'none') {
        outputs[i].finalEmphasis = 'none';
        outputs[i].rhythmAdjustment = {
          action: 'downgraded_for_recovery',
          reason: 'cognitive_recovery',
          originalEmphasis: outputs[i].finalEmphasis,
          adjustedEmphasis: 'none',
        };
        adjustments++;
      }
    }

    return adjustments;
  }

  /**
   * Step 7: Enforce scarcity (final pass).
   * 
   * Ensure strong emphasis doesn't exceed 10-15% of scenes.
   */
  private static enforceScarcity(
    intensityScores: Array<{ sceneIndex: number; emotional: number }>,
    outputs: RhythmOutput[]
  ): number {
    const totalScenes = outputs.length;
    const maxStrong = Math.floor(totalScenes * 0.15); // 15% maximum

    const strongScenes = outputs
      .map((output, index) => ({ output, index, emotion: intensityScores[index].emotional }))
      .filter(({ output }) => output.finalEmphasis === 'strong');

    const strongCount = strongScenes.length;

    if (strongCount <= maxStrong) return 0;

    // Too many strong - downgrade weakest
    const excessCount = strongCount - maxStrong;
    const sortedByEmotion = [...strongScenes].sort((a, b) => {
      if (a.emotion !== b.emotion) return a.emotion - b.emotion;
      return a.index - b.index; // Deterministic tiebreaker
    });

    let adjustments = 0;
    for (let i = 0; i < excessCount; i++) {
      const { output, index } = sortedByEmotion[i];
      output.finalEmphasis = 'soft';
      output.rhythmAdjustment = {
        action: 'downgraded_for_scarcity',
        reason: 'scarcity_protection',
        originalEmphasis: 'strong',
        adjustedEmphasis: 'soft',
      };
      adjustments++;
    }

    return adjustments;
  }

  /**
   * Validate output.
   */
  private static validateOutput(outputs: RhythmOutput[]): void {
    // Ensure no forbidden modifications
    outputs.forEach((output, index) => {
      if (!['none', 'soft', 'strong'].includes(output.finalEmphasis)) {
        throw new Error(`[RHYTHM] Invalid emphasis at scene ${index}: ${output.finalEmphasis}`);
      }
    });
  }
}
