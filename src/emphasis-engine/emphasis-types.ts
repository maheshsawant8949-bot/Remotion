/**
 * Emphasis Engine - Type Definitions
 * 
 * Defines perceptual hierarchy levels (NOT animation).
 * This layer determines which elements deserve priority attention.
 */

/**
 * Emphasis level names.
 * These define perceptual priority, not visual effects.
 */
export type EmphasisLevelName = "none" | "soft" | "strong";

/**
 * Emphasis level definition.
 * Describes the perceptual priority of an element.
 */
export type EmphasisLevel = {
  target: string;   // Primary element ID to emphasize
  level: EmphasisLevelName;
  reason: string;
};

/**
 * Priority tier mapping (internal use).
 * Future-proofs for camera logic, motion weighting, contrast systems.
 */
export type PriorityTier = "primary" | "secondary" | "background";

/**
 * Emphasis decision with reasoning.
 * Captures what was chosen and why, for explainability.
 */
export type EmphasisDecision = {
  level: EmphasisLevelName;
  primary?: string;      // ONE primary target (only for soft/strong)
  secondary?: string[];  // Supporting elements (optional)
  tier: PriorityTier;    // Internal priority tier mapping
  reason: string[];
  governorApplied?: boolean; // True if frequency governor downgraded
};

/**
 * Input signals for emphasis resolution.
 */
export type EmphasisSignals = {
  emotionalWeight: number; // 0-10 from emotional analyzer
  densityScore: number; // 0-10 from density controller
  revealStrategy: "instant" | "stagger" | "spotlight" | "build"; // From reveal engine
  strategy: string; // Layout/template from visual reasoner
  recentHistory: EmphasisLevelName[]; // Last 3 scenes' emphasis levels
};
