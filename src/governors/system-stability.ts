/**
 * System Stability Governors
 * 
 * Global safety layer that runs AFTER all intelligence layer decisions.
 * Prevents inflation, normalizes distributions, and maintains system health.
 * 
 * PRINCIPLES:
 * 1. Bias, not override (unless safety violated)
 * 2. Preserve hierarchy
 * 3. Avoid robotic behavior
 * 4. Maintain natural variation
 */

import { CompiledScene } from '../scene-compiler/scene-factory';

// ============================================================================
// TYPES
// ============================================================================

export interface GlobalState {
  sceneIndex: number;
  totalScenes: number;
  
  // Emphasis tracking
  strongEmphasisCount: number;
  
  // Motion tracking
  previousMotion: string | null;
  kineticStreak: number; // consecutive assertive/energetic
  motionChanges: number;
  
  // Camera tracking
  previousCamera: string | null;
  tightShotStreak: number; // consecutive focus/macro
  
  // Transition tracking
  firmTransitionCount: number;
  previousTransition: string | null;
}

export interface GovernorAdjustment {
  layer: 'emphasis' | 'motion' | 'camera' | 'transition';
  original: string;
  adjusted: string;
  reason: string;
  wasHardOverride: boolean;
}

// ============================================================================
// THRESHOLDS
// ============================================================================

const THRESHOLDS = {
  STRONG_EMPHASIS_MAX_PERCENT: 15,
  KINETIC_STREAK_MAX: 2,
  TIGHT_SHOT_STREAK_MAX: 2,
  FIRM_TRANSITION_MAX_PERCENT: 18,
  MOTION_VOLATILITY_MIN: 0.25,
  MOTION_VOLATILITY_MAX: 0.40,
} as const;

// ============================================================================
// EMPHASIS INFLATION GOVERNOR
// ============================================================================

function applyEmphasisGovernor(
  scene: CompiledScene,
  state: GlobalState
): GovernorAdjustment | null {
  const currentEmphasis = scene.trace?.emphasis?.level;
  if (!currentEmphasis || currentEmphasis !== 'strong') return null;

  // Calculate current strong emphasis percentage
  const strongPercent = ((state.strongEmphasisCount + 1) / state.totalScenes) * 100;

  if (strongPercent > THRESHOLDS.STRONG_EMPHASIS_MAX_PERCENT) {
    // Downgrade to soft (bias toward low-emotion scenes)
    const emotionScore = scene.trace?.emotionalAnalysis?.score || 0;
    
    // Only downgrade if emotion is not critically high
    if (emotionScore < 8) {
      return {
        layer: 'emphasis',
        original: 'strong',
        adjusted: 'soft',
        reason: `Strong emphasis exceeds ${THRESHOLDS.STRONG_EMPHASIS_MAX_PERCENT}% threshold (${strongPercent.toFixed(1)}%)`,
        wasHardOverride: false, // Bias, not override
      };
    }
  }

  return null;
}

// ============================================================================
// MOTION CLUSTERING GOVERNOR
// ============================================================================

function applyMotionGovernor(
  scene: CompiledScene,
  state: GlobalState
): GovernorAdjustment | null {
  const currentMotion = scene.trace?.motionBehavior?.behavior;
  if (!currentMotion) return null;

  const isKinetic = currentMotion === 'assertive' || currentMotion === 'energetic';

  // HARD OVERRIDE: Prevent kinetic streak > 2
  if (isKinetic && state.kineticStreak >= THRESHOLDS.KINETIC_STREAK_MAX) {
    return {
      layer: 'motion',
      original: currentMotion,
      adjusted: 'calm',
      reason: `Kinetic streak exceeds ${THRESHOLDS.KINETIC_STREAK_MAX} (safety violation)`,
      wasHardOverride: true,
    };
  }

  // MOTION CONTINUITY BIAS: Reduce volatility
  // If previous motion was calm/technical, bias toward same motion
  if (state.previousMotion && (state.previousMotion === 'calm' || state.previousMotion === 'technical')) {
    const volatility = state.sceneIndex > 0 ? state.motionChanges / state.sceneIndex : 0;
    
    // If volatility is too high, bias toward previous motion
    if (volatility > THRESHOLDS.MOTION_VOLATILITY_MAX && currentMotion !== state.previousMotion) {
      // Only apply bias if current motion is not critical (e.g., high emotion)
      const emotionScore = scene.trace?.emotionalAnalysis?.score || 0;
      const densityScore = scene.trace?.densityAnalysis?.score || 0;
      
      // Don't override if scene has high emotion or density
      if (emotionScore < 7 && densityScore < 7) {
        return {
          layer: 'motion',
          original: currentMotion,
          adjusted: state.previousMotion,
          reason: `Motion volatility too high (${(volatility * 100).toFixed(1)}%), biasing toward continuity`,
          wasHardOverride: false,
        };
      }
    }
  }

  return null;
}

// ============================================================================
// CAMERA PRESSURE GOVERNOR
// ============================================================================

function applyCameraGovernor(
  scene: CompiledScene,
  state: GlobalState
): GovernorAdjustment | null {
  const currentCamera = scene.trace?.cameraShot?.type;
  if (!currentCamera) return null;

  const isTight = currentCamera === 'focus' || currentCamera === 'macro';

  // HARD OVERRIDE: Prevent tight shot streak > 2
  if (isTight && state.tightShotStreak >= THRESHOLDS.TIGHT_SHOT_STREAK_MAX) {
    return {
      layer: 'camera',
      original: currentCamera,
      adjusted: 'standard',
      reason: `Tight shot streak exceeds ${THRESHOLDS.TIGHT_SHOT_STREAK_MAX} (safety violation)`,
      wasHardOverride: true,
    };
  }

  return null;
}

// ============================================================================
// TRANSITION AGGRESSION GOVERNOR
// ============================================================================

function applyTransitionGovernor(
  scene: CompiledScene,
  state: GlobalState
): GovernorAdjustment | null {
  const currentTransition = scene.trace?.transitionFromPrevious?.type;
  if (!currentTransition || currentTransition !== 'firm') return null;

  // Calculate current firm transition percentage
  const firmPercent = ((state.firmTransitionCount + 1) / state.totalScenes) * 100;

  if (firmPercent > THRESHOLDS.FIRM_TRANSITION_MAX_PERCENT) {
    // Downgrade to soft (bias toward non-peak transitions)
    const emotionScore = scene.trace?.emotionalAnalysis?.score || 0;
    const emphasisLevel = scene.trace?.emphasis?.level;
    
    // Only downgrade if not a peak moment
    if (emotionScore < 7 && emphasisLevel !== 'strong') {
      return {
        layer: 'transition',
        original: 'firm',
        adjusted: 'soft',
        reason: `Firm transitions exceed ${THRESHOLDS.FIRM_TRANSITION_MAX_PERCENT}% threshold (${firmPercent.toFixed(1)}%)`,
        wasHardOverride: false,
      };
    }
  }

  return null;
}

// ============================================================================
// MAIN GOVERNOR APPLICATION
// ============================================================================

export function applyStabilityGovernors(
  scene: CompiledScene,
  state: GlobalState
): GovernorAdjustment[] {
  const adjustments: GovernorAdjustment[] = [];

  // Apply governors in order
  const emphasisAdj = applyEmphasisGovernor(scene, state);
  if (emphasisAdj) adjustments.push(emphasisAdj);

  const motionAdj = applyMotionGovernor(scene, state);
  if (motionAdj) adjustments.push(motionAdj);

  const cameraAdj = applyCameraGovernor(scene, state);
  if (cameraAdj) adjustments.push(cameraAdj);

  const transitionAdj = applyTransitionGovernor(scene, state);
  if (transitionAdj) adjustments.push(transitionAdj);

  // Apply adjustments to scene
  adjustments.forEach((adj) => {
    if (!scene.trace) return;

    switch (adj.layer) {
      case 'emphasis':
        if (scene.trace.emphasis) {
          scene.trace.emphasis.level = adj.adjusted as 'strong' | 'soft' | 'none';
          scene.trace.emphasis.reason.push(`[GOVERNOR] ${adj.reason}`);
          if (adj.wasHardOverride) {
            scene.trace.emphasis.governorApplied = true;
          }
        }
        break;

      case 'motion':
        if (scene.trace.motionBehavior) {
          scene.trace.motionBehavior.behavior = adj.adjusted;
          scene.trace.motionBehavior.reason.push(`[GOVERNOR] ${adj.reason}`);
          if (adj.wasHardOverride) {
            scene.trace.motionBehavior.inflationPrevented = true;
          }
        }
        break;

      case 'camera':
        if (scene.trace.cameraShot) {
          scene.trace.cameraShot.type = adj.adjusted;
          scene.trace.cameraShot.reason.push(`[GOVERNOR] ${adj.reason}`);
          if (adj.wasHardOverride) {
            scene.trace.cameraShot.governorApplied = true;
          }
        }
        break;

      case 'transition':
        if (scene.trace.transitionFromPrevious) {
          scene.trace.transitionFromPrevious.type = adj.adjusted;
          scene.trace.transitionFromPrevious.reason.push(`[GOVERNOR] ${adj.reason}`);
          if (adj.wasHardOverride) {
            scene.trace.transitionFromPrevious.firmnessCapApplied = true;
          }
        }
        break;
    }
  });

  return adjustments;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

export function updateGlobalState(
  scene: CompiledScene,
  state: GlobalState
): void {
  // Update emphasis tracking
  if (scene.trace?.emphasis?.level === 'strong') {
    state.strongEmphasisCount++;
  }

  // Update motion tracking
  const currentMotion = scene.trace?.motionBehavior?.behavior;
  if (currentMotion) {
    const isKinetic = currentMotion === 'assertive' || currentMotion === 'energetic';
    
    if (isKinetic) {
      state.kineticStreak++;
    } else {
      state.kineticStreak = 0;
    }

    if (state.previousMotion && state.previousMotion !== currentMotion) {
      state.motionChanges++;
    }

    state.previousMotion = currentMotion;
  }

  // Update camera tracking
  const currentCamera = scene.trace?.cameraShot?.type;
  if (currentCamera) {
    const isTight = currentCamera === 'focus' || currentCamera === 'macro';
    
    if (isTight) {
      state.tightShotStreak++;
    } else {
      state.tightShotStreak = 0;
    }

    state.previousCamera = currentCamera;
  }

  // Update transition tracking
  const currentTransition = scene.trace?.transitionFromPrevious?.type;
  if (currentTransition) {
    if (currentTransition === 'firm') {
      state.firmTransitionCount++;
    }

    state.previousTransition = currentTransition;
  }

  // Increment scene index
  state.sceneIndex++;
}

export function createInitialState(totalScenes: number): GlobalState {
  return {
    sceneIndex: 0,
    totalScenes,
    strongEmphasisCount: 0,
    previousMotion: null,
    kineticStreak: 0,
    motionChanges: 0,
    previousCamera: null,
    tightShotStreak: 0,
    firmTransitionCount: 0,
    previousTransition: null,
  };
}
