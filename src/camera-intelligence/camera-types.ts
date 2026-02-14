export type ShotType = "wide" | "standard" | "focus" | "macro";

export interface CameraShot {
  type: ShotType;
  reason: string[];
  governorApplied?: boolean;
}

export interface ShotSignals {
  emotionalWeight: number;
  emphasis: "none" | "soft" | "strong";
  density: number;
  layout: string;
  rhythmPeak: boolean;
  motionBehavior?: string; // "calm" | "assertive" | "energetic" | "technical" (using string to avoid circular dependency)
  recentShots: ShotType[];
}
