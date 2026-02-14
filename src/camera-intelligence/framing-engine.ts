import { CameraShot, ShotSignals, ShotType } from "./camera-types";
import { ShotResolver } from "./shot-resolver";

export class FramingEngine {
  // Governor Constants
  private static MAX_CONSECUTIVE_TIGHT = 2; // Focus/Macro streak limit

  static determineShot(signals: ShotSignals): CameraShot {
    // 1. Resolve intended shot based on rules
    let decision = ShotResolver.resolve(signals);

    // 2. Apply Governor (Streak Prevention)
    // Prevent viewer visual pressure from too many tight shots
    if (this.shouldGovern(decision.type, signals.recentShots)) {
      decision = {
        type: "standard",
        reason: [...decision.reason, "Governor: Max consecutive tight shots reached"],
        governorApplied: true
      };
    }

    return decision;
  }

  private static shouldGovern(proposed: ShotType, history: ShotType[]): boolean {
    if (proposed !== "focus" && proposed !== "macro") return false;

    // Check last N shots
    // If recent history shows a streak of tight shots, we might need to break it.
    // We look at the last MAX_CONSECUTIVE_TIGHT shots.
    // If they were ALL tight, and we propose another tight one, we block it.
    
    if (history.length < this.MAX_CONSECUTIVE_TIGHT) return false;

    const recentSegment = history.slice(-this.MAX_CONSECUTIVE_TIGHT);
    const allTight = recentSegment.every(shot => shot === "focus" || shot === "macro");

    return allTight;
  }
}
