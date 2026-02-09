/**
 * Rhythm Controller - Type Definitions
 * 
 * Post-compilation layer that analyzes scene sequences and nudges emphasis
 * to create better narrative flow and prevent intensity clustering.
 */

import { EmphasisLevelName } from '../emphasis-engine/emphasis-types';

/**
 * Narrative arc phases (heuristic detection)
 */
export type NarrativePhase = 
  | 'setup'       // Opening, context-setting
  | 'expansion'   // Building understanding
  | 'escalation'  // Rising tension/complexity
  | 'peak'        // Climax, key revelation
  | 'resolution'; // Conclusion, synthesis

/**
 * Intensity level for rhythm analysis
 */
export type IntensityLevel = 'low' | 'medium' | 'high';

/**
 * Scene rhythm metadata
 */
export interface SceneRhythm {
  sceneIndex: number;
  originalEmphasis: EmphasisLevelName;
  suggestedEmphasis: EmphasisLevelName;
  intensity: IntensityLevel;
  narrativePhase: NarrativePhase;
  adjustmentReason?: string;
}

/**
 * Rhythm analysis result for entire sequence
 */
export interface RhythmAnalysis {
  scenes: SceneRhythm[];
  adjustmentsMade: number;
  flatlineDetected: boolean;
  clusteringDetected: boolean;
  narrativeArc: NarrativePhase[];
}

/**
 * Input for rhythm controller
 */
export interface RhythmInput {
  sceneIndex: number;
  emphasis: EmphasisLevelName;
  emotionalWeight: number;
  strategy: string;
  intentType?: string;
}

/**
 * Rhythm adjustment decision
 */
export interface RhythmAdjustment {
  originalLevel: EmphasisLevelName;
  adjustedLevel: EmphasisLevelName;
  reason: string;
  confidence: number; // 0-1, how confident we are in this adjustment
}
