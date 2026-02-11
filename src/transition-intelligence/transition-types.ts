/**
 * Transition Types
 * 
 * Defines the 4 transition archetypes.
 * 
 * CONSTRAINT:
 * Only 4 types allowed.
 * - soft: Default, low interruption
 * - firm: Noticeable, energy increase
 * - release: Energy drop, breathe
 * - minimal: Almost invisible, technical chains
 */

import { MotionBehaviorName } from '../motion-behavior/behavior-types';

export type TransitionType = 
  | 'soft'
  | 'firm'
  | 'release'
  | 'minimal';

export interface TransitionBehavior {
  type: TransitionType;
  philosophy: string;
  whenToUse: string[];
  visualCharacteristics: string[];
}

export interface TransitionDecision {
  type: TransitionType;
  reason: string[];
  firmnessCapApplied?: boolean; // If firm was requested but capped
  consecutiveFirmPrevented?: boolean; // If prev was firm, prevent next firm
}

export interface TransitionSignals {
  previousMotion: MotionBehaviorName;
  currentMotion: MotionBehaviorName;
  density: number; // Current scene density
  isPeak: boolean; // Is current scene a peak?
  previousTransition?: TransitionType;
  recentTransitions: TransitionType[]; // For frequency capping
}

/**
 * Transition 1: Soft (Default)
 * 
 * Low visual interruption.
 * Use when energy is stable or undefined.
 */
export const SOFT_TRANSITION: TransitionBehavior = {
  type: 'soft',
  philosophy: 'Invisible continuity',
  whenToUse: [
    'calm → calm',
    'technical → technical (default)',
    'High density scenes',
    'Peak scenes (let content carry intensity)',
  ],
  visualCharacteristics: [
    'Smooth',
    'Low attention',
    'Follows motion flow',
  ],
};

/**
 * Transition 2: Firm (Controlled Intensity)
 * 
 * Noticeable but controlled.
 * Use when energy increases.
 */
export const FIRM_TRANSITION: TransitionBehavior = {
  type: 'firm',
  philosophy: 'Intentional step up',
  whenToUse: [
    'calm → assertive',
    'Significant energy increase',
  ],
  visualCharacteristics: [
    'Definitive',
    'Visual marker',
    'Controlled snappiness',
  ],
};

/**
 * Transition 3: Release (Breathe)
 * 
 * Lets the viewer breathe.
 * Use when energy drops.
 */
export const RELEASE_TRANSITION: TransitionBehavior = {
  type: 'release',
  philosophy: 'Exhale tension',
  whenToUse: [
    'assertive → calm',
    'energetic → calm',
    'Energy drop',
  ],
  visualCharacteristics: [
    'Ease out',
    'Expansion',
    'Relaxing',
  ],
};

/**
 * Transition 4: Minimal (Technical Flow)
 * 
 * Almost invisible.
 * Use for dense technical chains.
 */
export const MINIMAL_TRANSITION: TransitionBehavior = {
  type: 'minimal',
  philosophy: 'Data continuity',
  whenToUse: [
    'technical → technical (dense)',
    'Rapid sequence',
  ],
  visualCharacteristics: [
    'Cut-like',
    'Immediate',
    'Zero friction',
  ],
};

export const TRANSITION_BEHAVIORS: Record<TransitionType, TransitionBehavior> = {
  soft: SOFT_TRANSITION,
  firm: FIRM_TRANSITION,
  release: RELEASE_TRANSITION,
  minimal: MINIMAL_TRANSITION,
};
