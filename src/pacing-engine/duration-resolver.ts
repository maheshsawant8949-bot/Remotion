import { PacingProfile, PACING_CONSTANTS } from './pacing-model';

export interface DurationInput {
  wordCount: number;
  conceptDensity: number; // 1 to 10
  pacingProfile: PacingProfile;
  emphasisLevel?: "low" | "medium" | "high";
  overrideLimits?: {
    min?: number;
    max?: number;
  };
}

export function calculateDuration(input: DurationInput): number {
  const { wordCount, conceptDensity, pacingProfile } = input;
  const emphasis = input.emphasisLevel || pacingProfile.emphasisAllowance;

  // 1. Base Duration from Word Count
  const wps = PACING_CONSTANTS.WPS[pacingProfile.tempo];
  const baseTime = wordCount / wps;

  // 2. Adjust for Concept Density (Complexity Penalty)
  // Density 1-5: Minimal impact
  // Density 6-10: Adds 5% per point over 5
  let densityMultiplier = 1.0;
  if (conceptDensity > 5) {
      densityMultiplier += (conceptDensity - 5) * 0.05;
  }

  // 3. Adjust for Emphasis (Importance)
  const emphasisMultiplier = PACING_CONSTANTS.EMPHASIS_MULTIPLIER[emphasis] || 1.0;

  // 4. Calculate Total
  let totalDuration = baseTime * densityMultiplier * emphasisMultiplier;

  // 5. Apply Clamping with Overrides
  const minDuration = input.overrideLimits?.min ?? PACING_CONSTANTS.MIN_DURATION_SECONDS;
  const maxDuration = input.overrideLimits?.max ?? PACING_CONSTANTS.MAX_DURATION_SECONDS;

  return Math.min(Math.max(totalDuration, minDuration), maxDuration);
}
