/**
 * Rhythm Conductor
 * 
 * Post-compilation layer that analyzes scene sequences and nudges emphasis
 * to create better narrative flow.
 * 
 * ARCHITECTURAL RULES:
 * - NEVER override grammar
 * - NEVER rewrite strategy
 * - NEVER change layout
 * - NEVER change density
 * - ONLY nudge emphasis strength
 * 
 * Think conductor — not composer.
 */

import { EmphasisLevelName } from '../emphasis-engine/emphasis-types';
import { RhythmInput, RhythmAnalysis, SceneRhythm, RhythmAdjustment } from './rhythm-types';
import { NarrativeDetector } from './narrative-detector';
import { IntensityAnalyzer } from './intensity-analyzer';
import { RhythmBoundary } from './rhythm-boundary';
import { ScarcityProtector } from './scarcity-protector';
import { CognitiveRecoveryDetector } from './cognitive-recovery';

export class RhythmConductor {
  /**
   * Analyze and adjust emphasis across scene sequence.
   * 
   * This is the main entry point for rhythm control.
   * Call AFTER all scenes are compiled.
   * 
   * CRITICAL: This method ONLY adjusts emphasis levels.
   * It NEVER touches strategy, layout, or density.
   * 
   * @param inputs - Scene data for rhythm analysis
   * @returns Rhythm analysis with suggested adjustments
   */
  static conduct(inputs: RhythmInput[]): RhythmAnalysis {
    // BOUNDARY ENFORCEMENT: Validate inputs are read-only
    inputs.forEach(input => RhythmBoundary.validateInput(input));
    // Step 1: Detect narrative arc
    const narrativeArc = NarrativeDetector.detectArc(inputs);

    // Step 2: Extract current emphasis levels
    const emphasisLevels = inputs.map(input => input.emphasis);
    const emotionalWeights = inputs.map(input => input.emotionalWeight);

    // Step 3: Detect issues
    const flatlineDetected = IntensityAnalyzer.detectFlatline(emphasisLevels);
    const clusteringDetected = IntensityAnalyzer.detectClustering(emphasisLevels);

    // Step 4: Build scene rhythm metadata
    const scenes: SceneRhythm[] = inputs.map((input, index) => ({
      sceneIndex: index,
      originalEmphasis: input.emphasis,
      suggestedEmphasis: input.emphasis, // Will be adjusted
      intensity: IntensityAnalyzer.mapToIntensity(input.emphasis),
      narrativePhase: narrativeArc[index],
    }));

    let adjustmentsMade = 0;

    // Step 5: Apply rhythm adjustments

    // 5a. Fix flatlines (no strong emphasis for 12+ scenes)
    if (flatlineDetected) {
      adjustmentsMade += this.fixFlatline(scenes, emotionalWeights, emphasisLevels);
    }

    // 5b. Fix clustering (multiple strong in close proximity)
    if (clusteringDetected) {
      adjustmentsMade += this.fixClustering(scenes);
    }

    // 5c. Ensure narrative peaks have appropriate intensity
    adjustmentsMade += this.alignWithNarrativeArc(scenes, emotionalWeights);

    // 5d. COGNITIVE RECOVERY: Ensure tension/relief alternation
    // Provide breathing room after strong emphasis
    const recoveryResult = CognitiveRecoveryDetector.enforceRecovery(scenes, emotionalWeights);
    adjustmentsMade += recoveryResult.adjustments;

    // 5e. SCARCITY PROTECTION: Enforce 10-15% rule
    // This is the final pass - ensures we never exceed safe limits
    const scarcityResult = ScarcityProtector.enforceScarcity(scenes, emotionalWeights);
    adjustmentsMade += scarcityResult.adjustments;

    // Step 6: Build final analysis
    const analysis: RhythmAnalysis = {
      scenes,
      adjustmentsMade,
      flatlineDetected,
      clusteringDetected,
      narrativeArc,
    };

    // BOUNDARY ENFORCEMENT: Validate output contains only emphasis adjustments
    RhythmBoundary.validateOutput(analysis);
    
    // SCARCITY VALIDATION: Log warnings if scarcity is violated
    ScarcityProtector.validateScarcity(scenes, inputs.length);
    
    // COGNITIVE RECOVERY VALIDATION: Log warnings if recovery is missed
    CognitiveRecoveryDetector.validateRecovery(scenes, emotionalWeights);

    // Step 7: Return analysis
    return analysis;
  }

  /**
   * Fix flatline: elevate strongest candidate in flat region.
   * 
   * CRITICAL: Peaks must be EARNED.
   * Only elevate scenes that already have strong signals.
   * Never create artificial drama.
   */
  private static fixFlatline(
    scenes: SceneRhythm[],
    emotionalWeights: number[],
    emphasisLevels: EmphasisLevelName[]
  ): number {
    let adjustments = 0;
    let consecutiveNonStrong = 0;
    let flatlineStart = 0;
    const FLATLINE_THRESHOLD = 12;
    
    // MINIMUM THRESHOLDS FOR ELEVATION
    // These ensure peaks are earned, not artificially created
    const MIN_EMOTION_FOR_STRONG = 6;  // Must have genuine high emotion
    const MIN_EMOTION_FOR_SOFT = 4;    // Must have at least medium emotion

    for (let i = 0; i < emphasisLevels.length; i++) {
      if (emphasisLevels[i] === 'strong') {
        // Check if we just exited a flatline
        if (consecutiveNonStrong >= FLATLINE_THRESHOLD) {
          // Find strongest candidate in flatline region
          const candidateIndex = IntensityAnalyzer.findStrongestCandidate(
            flatlineStart,
            i - 1,
            emotionalWeights,
            emphasisLevels
          );

          const candidateEmotion = emotionalWeights[candidateIndex];

          // EARNED PEAK RULE: Only elevate if signals are strong enough
          if (candidateEmotion >= MIN_EMOTION_FOR_STRONG) {
            // Strong signals present - elevation is earned
            scenes[candidateIndex].suggestedEmphasis = 'strong';
            scenes[candidateIndex].adjustmentReason = 
              `[RHYTHM] Elevated to strong (flatline fix, emotion: ${candidateEmotion} - EARNED)`;
            adjustments++;
          } else if (candidateEmotion >= MIN_EMOTION_FOR_SOFT) {
            // Medium signals - elevate to soft only
            scenes[candidateIndex].suggestedEmphasis = 'soft';
            scenes[candidateIndex].adjustmentReason = 
              `[RHYTHM] Elevated to soft (flatline fix, emotion: ${candidateEmotion} - insufficient for strong)`;
            adjustments++;
          }
          // else: emotion < 4 - NO ELEVATION
          // This prevents artificial drama - if no scene has decent emotion, don't fake it
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
      const candidateIndex = IntensityAnalyzer.findStrongestCandidate(
        flatlineStart,
        emphasisLevels.length - 1,
        emotionalWeights,
        emphasisLevels
      );

      const candidateEmotion = emotionalWeights[candidateIndex];

      // EARNED PEAK RULE: Same thresholds apply
      if (candidateEmotion >= MIN_EMOTION_FOR_STRONG) {
        scenes[candidateIndex].suggestedEmphasis = 'strong';
        scenes[candidateIndex].adjustmentReason = 
          `[RHYTHM] Elevated to strong (trailing flatline, emotion: ${candidateEmotion} - EARNED)`;
        adjustments++;
      } else if (candidateEmotion >= MIN_EMOTION_FOR_SOFT) {
        scenes[candidateIndex].suggestedEmphasis = 'soft';
        scenes[candidateIndex].adjustmentReason = 
          `[RHYTHM] Elevated to soft (trailing flatline, emotion: ${candidateEmotion} - insufficient for strong)`;
        adjustments++;
      }
      // else: No elevation - accept the flatline rather than create fake drama
    }

    return adjustments;
  }

  /**
   * Fix clustering: downgrade later strong emphasis in clusters.
   */
  private static fixClustering(scenes: SceneRhythm[]): number {
    let adjustments = 0;
    const WINDOW_SIZE = 4;

    for (let i = 0; i <= scenes.length - WINDOW_SIZE; i++) {
      const window = scenes.slice(i, i + WINDOW_SIZE);
      const strongIndices = window
        .map((scene, idx) => ({ scene, idx: i + idx }))
        .filter(({ scene }) => scene.suggestedEmphasis === 'strong')
        .map(({ idx }) => idx);

      // If 2+ strong in window, downgrade all but the first
      if (strongIndices.length >= 2) {
        for (let j = 1; j < strongIndices.length; j++) {
          const sceneIndex = strongIndices[j];
          scenes[sceneIndex].suggestedEmphasis = 'soft';
          scenes[sceneIndex].adjustmentReason = `[RHYTHM] Downgraded to prevent clustering (${strongIndices.length} strong in ${WINDOW_SIZE} scenes)`;
          adjustments++;
        }
      }
    }

    return adjustments;
  }

  /**
   * Align emphasis with narrative arc expectations.
   * Ensure peaks have appropriate intensity.
   * 
   * CRITICAL: Peaks must be EARNED.
   * Only elevate if emotional signals support it.
   */
  private static alignWithNarrativeArc(
    scenes: SceneRhythm[],
    emotionalWeights: number[]
  ): number {
    let adjustments = 0;
    
    // MINIMUM THRESHOLDS FOR ELEVATION
    const MIN_EMOTION_FOR_PEAK_SOFT = 5;   // Peak phase needs at least medium-high emotion
    const MIN_EMOTION_FOR_STRONG_KEEP = 7; // Resolution can keep strong if emotion is genuinely high

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];

      // If we're at a peak phase but emphasis is low, consider elevation
      // BUT ONLY if emotion supports it (earned peak)
      if (scene.narrativePhase === 'peak' && scene.suggestedEmphasis === 'none') {
        // EARNED PEAK RULE: Must have at least medium-high emotion
        if (emotionalWeights[i] >= MIN_EMOTION_FOR_PEAK_SOFT) {
          scene.suggestedEmphasis = 'soft';
          scene.adjustmentReason = 
            `[RHYTHM] Elevated for narrative peak (emotion: ${emotionalWeights[i]} - EARNED)`;
          adjustments++;
        }
        // else: emotion < 5 - NO ELEVATION
        // Peak phase without strong emotion = not a real peak, don't fake it
      }

      // If we're in resolution but emphasis is strong, consider downgrade
      // UNLESS emotion genuinely justifies it (earned intensity)
      if (scene.narrativePhase === 'resolution' && scene.suggestedEmphasis === 'strong') {
        // Only downgrade if emotion doesn't strongly justify it
        if (emotionalWeights[i] < MIN_EMOTION_FOR_STRONG_KEEP) {
          scene.suggestedEmphasis = 'soft';
          scene.adjustmentReason = 
            `[RHYTHM] Downgraded for narrative resolution (emotion: ${emotionalWeights[i]} - insufficient for strong)`;
          adjustments++;
        }
        // else: emotion >= 7 - KEEP strong, it's earned even in resolution
      }
    }

    return adjustments;
  }

  /**
   * Get adjustment for a specific scene.
   * Returns null if no adjustment needed.
   */
  static getAdjustment(
    sceneIndex: number,
    analysis: RhythmAnalysis
  ): RhythmAdjustment | null {
    const scene = analysis.scenes[sceneIndex];

    if (scene.originalEmphasis === scene.suggestedEmphasis) {
      return null;
    }

    return {
      originalLevel: scene.originalEmphasis,
      adjustedLevel: scene.suggestedEmphasis,
      reason: scene.adjustmentReason || 'Rhythm adjustment',
      confidence: 0.7, // Medium confidence - these are heuristic adjustments
    };
  }
}
