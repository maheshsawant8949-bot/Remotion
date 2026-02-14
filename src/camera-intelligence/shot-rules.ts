import { ShotType, ShotSignals } from "./camera-types";

// Rule 1: High Density Override
// If density is high (>= 7), limit viewer cognitive load by using wide shot
export const checkDensityRule = (density: number): ShotType | null => {
  if (density >= 7) {
    return "wide";
  }
  return null;
};

// Rule 2: Strong Emphasis (Focus)
// If emphasis is strong, upgrade to focus (unless density prevented it)
export const checkEmphasisRule = (emphasis: "none" | "soft" | "strong"): ShotType | null => {
  if (emphasis === "strong") {
    return "focus";
  }
  return null;
};

// Rule 3: Macro Gate
// Allow macro ONLY when logic allows: High emotion + Peak + Single element context (implied by layout/focus)
// We'll trust the resolver to check layout/context if needed, but here we check signals
export const checkMacroGate = (signals: ShotSignals): boolean => {
  // emotionalWeight >= 8 (High)
  // emphasis == "strong"
  // rhythmPeak == true (Narrative peak)
  return signals.emotionalWeight >= 8 && signals.emphasis === "strong" && signals.rhythmPeak;
};

// Rule 4: Layout Specifics (Diagrams)
// Diagrams usually need space
export const checkLayoutRule = (layout: string): ShotType | null => {
  if (layout === "diagram" || layout === "process") {
    return "wide";
  }
  return null;
};
