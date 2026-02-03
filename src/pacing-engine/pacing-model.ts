export type PacingProfile = {
  tempo: "slow" | "medium" | "fast";
  emphasisAllowance: "low" | "medium" | "high";
  revealStyle?: "gradual" | "immediate";
};

export const PACING_PROFILES: Record<string, PacingProfile> = {
  slow: {
    tempo: "slow",
    emphasisAllowance: "low",
    revealStyle: "gradual",
  },
  medium: {
    tempo: "medium",
    emphasisAllowance: "medium",
    revealStyle: "gradual",
  },
  fast: {
    tempo: "fast",
    emphasisAllowance: "high",
    revealStyle: "immediate",
  },
};

export function getPacingProfile(name: string): PacingProfile {
  const profile = PACING_PROFILES[name];
  if (!profile) {
    throw new Error(`Pacing profile '${name}' not found.`);
  }
  return profile;
}

export const STRATEGY_PACING_MAP: Record<string, string> = {
  shocking_stat: "slow",
  spatial_explanation: "medium",
  progressive_steps: "medium",
  credibility_stat: "medium",
  emotional_impact: "slow",
  quantify: "fast",
  introduce: "slow",
  explain: "medium",
  compare: "medium",
  unknown: "medium",
};


export function getProfileForStrategy(strategy: string): PacingProfile {
  const profileName = STRATEGY_PACING_MAP[strategy] || "medium";
  return getPacingProfile(profileName);
}

export const PACING_CONSTANTS = {
  WPS: {
    slow: 2.0, // Words per second
    medium: 2.5,
    fast: 3.0,
  },
  EMPHASIS_MULTIPLIER: {
    low: 0.9,  // Slightly faster/shorter
    medium: 1.0, // Standard
    high: 1.2, // Give it room to breathe
  },
  MIN_DURATION_SECONDS: 2.0,
  MAX_DURATION_SECONDS: 8.0,
};

