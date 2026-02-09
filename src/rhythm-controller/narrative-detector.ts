/**
 * Narrative Arc Detector
 * 
 * Heuristically detects narrative phases based on SIGNALS, not rigid templates.
 * 
 * CRITICAL: This is NOT a Hollywood story structure enforcer.
 * We detect candidate peaks and elevate the best - we don't force structure.
 */

import { NarrativePhase, RhythmInput } from './rhythm-types';

export class NarrativeDetector {
  /**
   * Detect narrative phase for a scene based on SIGNALS.
   * 
   * NO RIGID TEMPLATES like "peak at scene 8" or "first 20% is setup".
   * 
   * Instead: Use intent types and emotional signals to detect likely phases.
   * Position is used ONLY as a weak tiebreaker, never as a hard rule.
   */
  static detectPhase(
    sceneIndex: number,
    totalScenes: number,
    input: RhythmInput
  ): NarrativePhase {
    // SIGNAL-BASED DETECTION (strong signals override everything)
    
    // 1. Intent-based detection (strongest signal)
    if (input.intentType) {
      const intentPhase = this.detectPhaseFromIntent(input.intentType);
      if (intentPhase) {
        return intentPhase;
      }
    }
    
    // 2. Emotional weight detection (medium signal)
    // High emotion suggests peak or escalation
    if (input.emotionalWeight >= 7) {
      // Could be peak or escalation - use position as weak tiebreaker
      const position = sceneIndex / totalScenes;
      return position > 0.5 ? 'peak' : 'escalation';
    }
    
    // 3. Low emotion suggests setup or resolution
    if (input.emotionalWeight <= 3) {
      // Could be setup or resolution - use position as weak tiebreaker
      const position = sceneIndex / totalScenes;
      return position < 0.3 ? 'setup' : 'resolution';
    }
    
    // 4. Medium emotion is expansion or escalation
    // Default to expansion (most common)
    return 'expansion';
  }

  /**
   * Detect phase from intent type.
   * Returns null if intent doesn't strongly indicate a phase.
   */
  private static detectPhaseFromIntent(intentType: string): NarrativePhase | null {
    // Setup signals
    if (intentType === 'context_setting' || intentType === 'introduction') {
      return 'setup';
    }
    
    // Resolution signals
    if (intentType === 'reflective_closure' || intentType === 'philosophical_contrast' || intentType === 'conclusion') {
      return 'resolution';
    }
    
    // Escalation signals
    if (intentType === 'tension_build' || intentType === 'risk_escalation' || intentType === 'problem_reveal') {
      return 'escalation';
    }
    
    // Peak signals
    if (intentType === 'awe_scale' || intentType === 'scenario_visualization' || intentType === 'climax') {
      return 'peak';
    }
    
    // No strong signal
    return null;
  }

  /**
   * Detect narrative arc for entire sequence.
   * Returns array of phases matching scene count.
   * 
   * NOTE: This is heuristic detection, not forced structure.
   */
  static detectArc(inputs: RhythmInput[]): NarrativePhase[] {
    return inputs.map((input, index) => 
      this.detectPhase(index, inputs.length, input)
    );
  }

  /**
   * Find candidate peak scenes based on signals.
   * Returns indices of scenes that could be peaks.
   * 
   * This is the CORRECT approach: detect candidates, don't force structure.
   */
  static findPeakCandidates(inputs: RhythmInput[]): number[] {
    const candidates: number[] = [];
    
    inputs.forEach((input, index) => {
      // Peak candidates have:
      // - High emotional weight (>= 6)
      // - OR peak-indicating intent
      // - OR already marked as peak phase
      
      const hasHighEmotion = input.emotionalWeight >= 6;
      const hasPeakIntent = input.intentType === 'awe_scale' || 
                           input.intentType === 'scenario_visualization' ||
                           input.intentType === 'climax';
      
      if (hasHighEmotion || hasPeakIntent) {
        candidates.push(index);
      }
    });
    
    return candidates;
  }

  /**
   * Select best peak from candidates.
   * Returns index of scene that should be elevated.
   * 
   * This respects the principle: "elevate the best, don't force structure"
   */
  static selectBestPeak(inputs: RhythmInput[], candidates: number[]): number | null {
    if (candidates.length === 0) {
      return null;
    }
    
    // Find candidate with highest emotional weight
    let bestIndex = candidates[0];
    let bestWeight = inputs[candidates[0]].emotionalWeight;
    
    for (const candidateIndex of candidates) {
      if (inputs[candidateIndex].emotionalWeight > bestWeight) {
        bestWeight = inputs[candidateIndex].emotionalWeight;
        bestIndex = candidateIndex;
      }
    }
    
    return bestIndex;
  }

  /**
   * Get expected intensity for a narrative phase.
   * 
   * NOTE: This is a SUGGESTION, not a mandate.
   * Used to guide rhythm adjustments, not force them.
   */
  static getExpectedIntensity(phase: NarrativePhase): 'low' | 'medium' | 'high' {
    switch (phase) {
      case 'setup':
        return 'low';
      case 'expansion':
        return 'medium';
      case 'escalation':
        return 'medium'; // Can be high, but default medium
      case 'peak':
        return 'high';
      case 'resolution':
        return 'low'; // Wind down
      default:
        return 'medium';
    }
  }
}
