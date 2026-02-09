/**
 * Reveal Engine - Type Definitions
 * 
 * Defines narrative reveal strategies (NOT animation).
 * This layer determines HOW content should be presented to the viewer.
 */

/**
 * Reveal strategy names.
 * These define narrative behavior, not visual effects.
 */
export type RevealStrategyName = "instant" | "stagger" | "spotlight" | "build";

/**
 * Reveal strategy definition.
 * Describes the narrative purpose and constraints of each reveal approach.
 */
export type RevealStrategy = {
  name: RevealStrategyName;
  narrativePurpose: string;
  pacingModifier?: number; // Multiplier for duration (e.g., 1.2 = 20% slower)
  maxSteps?: number; // Max elements to reveal sequentially
};

/**
 * Reveal decision with reasoning.
 * Captures what was chosen and why, for explainability.
 */
export type RevealDecision = {
  chosen: RevealStrategyName;
  reason: string[];
  governorApplied?: boolean; // True if frequency governor downgraded strategy
};

/**
 * Input signals for reveal resolution.
 */
export type RevealSignals = {
  emotionalWeight: number; // 0-10 from emotional analyzer
  densityScore: number; // 0-10 from density controller
  pacing: 'slow' | 'normal' | 'fast'; // From pacing engine
  strategy: string; // Layout/template from visual reasoner
  recentHistory: RevealStrategyName[]; // Last 3 scenes' reveal strategies
};
