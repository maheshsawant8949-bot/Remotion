import { CameraShot, ShotSignals, ShotType } from "./camera-types";
import { checkDensityRule, checkEmphasisRule, checkLayoutRule, checkMacroGate } from "./shot-rules";

export class ShotResolver {
  static resolve(signals: ShotSignals): CameraShot {
    const reasons: string[] = [];

    // 1. Density Override (Highest Priority for usability)
    const densityShot = checkDensityRule(signals.density);
    if (densityShot) {
      reasons.push("High density requires wide shot");
      return { type: "wide", reason: reasons };
    }

    // 2. Macro Gate (Rare Peak)
    if (checkMacroGate(signals)) {
      reasons.push("High emotion + Peak emphasis + Single Element enables macro");
      return { type: "macro", reason: reasons };
    }

    // 3. Emphasis Rule
    const emphasisShot = checkEmphasisRule(signals.emphasis);
    if (emphasisShot) {
      reasons.push("Strong emphasis requests focus");
      return { type: "focus", reason: reasons };
    }

    // 4. Layout Rules (Default for layout types if no emphasis override)
    const layoutShot = checkLayoutRule(signals.layout);
    if (layoutShot) {
      reasons.push(`Layout '${signals.layout}' defaults to wide`);
      return { type: "wide", reason: reasons };
    }

    // 5. Default
    reasons.push("Default standard framing");
    return { type: "standard", reason: reasons };
  }
}

