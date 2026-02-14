/**
 * Motion Mapper
 * 
 * Translates motion curves into easing + duration.
 * Emotion may extend duration slightly — but never past cap.
 */

import { SCENE_MOTION_DURATIONS, TRANSITION_DURATIONS, DURATION_LIMITS } from './duration-system';
import { EASING_CURVES, EasingType } from './easing-library';

/**
 * Motion Polish
 */
export interface MotionPolish {
  duration: number;
  easing: string;
}

/**
 * Motion Context
 */
export interface MotionContext {
  emotionalWeight?: number;
  emphasis?: string;
  density?: number;
}

/**
 * Motion Mapper
 */
export class MotionMapper {
  /**
   * Map scene motion curve to easing + duration
   * 
   * Mapping:
   * - gentle → 320ms + gentleEase
   * - confident → 420ms + confidentEase
   * - swift → 240ms + swiftEase
   * - deliberate → 700ms + deliberateEase
   */
  static mapSceneMotion(
    curve: 'gentle' | 'confident' | 'swift' | 'deliberate',
    context?: MotionContext
  ): MotionPolish {
    // Base mapping
    const baseMapping = {
      gentle: { duration: 320, easing: EASING_CURVES.gentleEase },
      confident: { duration: 420, easing: EASING_CURVES.confidentEase },
      swift: { duration: 240, easing: EASING_CURVES.swiftEase },
      deliberate: { duration: 700, easing: EASING_CURVES.deliberateEase },
    };
    
    let polish = { ...baseMapping[curve] };
    
    // Emotion may extend duration slightly (max 10%)
    if (context?.emotionalWeight && context.emotionalWeight >= 7) {
      polish.duration = Math.min(
        Math.round(polish.duration * 1.1),
        DURATION_LIMITS.maxSceneMotion
      );
    }
    
    // High density → compress duration slightly
    if (context?.density && context.density >= 7) {
      polish.duration = Math.max(
        Math.round(polish.duration * 0.9),
        DURATION_LIMITS.minDuration
      );
    }
    
    return polish;
  }
  
  /**
   * Map transition to easing + duration
   */
  static mapTransition(
    transition: 'cut' | 'soft-cut' | 'match-cut' | 'ease-through' | 'hold-cut'
  ): MotionPolish {
    const mapping = {
      cut: { duration: 80, easing: 'linear' },
      'soft-cut': { duration: 220, easing: EASING_CURVES.gentleEase },
      'match-cut': { duration: 270, easing: EASING_CURVES.confidentEase },
      'ease-through': { duration: 270, easing: EASING_CURVES.confidentEase },
      'hold-cut': { duration: 380, easing: EASING_CURVES.deliberateEase },
    };
    
    return mapping[transition];
  }
  
  /**
   * Get duration range for curve
   */
  static getDurationRange(curve: 'gentle' | 'confident' | 'swift' | 'deliberate'): {
    min: number;
    max: number;
  } {
    const mapping = {
      gentle: SCENE_MOTION_DURATIONS.standard,
      confident: SCENE_MOTION_DURATIONS.emphasis,
      swift: SCENE_MOTION_DURATIONS.micro,
      deliberate: SCENE_MOTION_DURATIONS.deliberate,
    };
    
    return mapping[curve];
  }
}
