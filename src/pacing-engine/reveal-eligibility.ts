import { Pattern } from '../visual-reasoner/pattern-library';

/**
 * Determines if a scene is eligible for gradual reveal animation.
 * 
 * GATED RULES (Not Universal):
 * - Reveal requires MULTIPLE qualifying factors, not just one
 * - High weight alone is NOT enough - must be paired with density OR sequence
 * - This makes reveals scarce and meaningful
 * 
 * @param emotionalWeight - Emotional weight score (0-10)
 * @param densityScore - Density score (0-10)
 * @param pattern - Detected pattern from heuristics
 * @returns true if eligible for gradual reveal, false for instant
 */
export function isRevealEligible(
    emotionalWeight: number,
    densityScore: number,
    pattern: Pattern
): boolean {
    const isHighEmotion = emotionalWeight >= 7;
    const isHighDensity = densityScore >= 7 && densityScore <= 10;
    const isSequence = pattern === 'progressive_steps';
    
    // GATED: Require BOTH high emotion AND (high density OR sequence)
    // This prevents medium-weight content from getting reveals universally
    if (isHighEmotion && (isHighDensity || isSequence)) {
        return true;
    }
    
    // Special case: Very high density + sequence (even without high emotion)
    // This is for complex procedural content that needs careful presentation
    if (isHighDensity && isSequence) {
        return true;
    }

    // Default: Instant (no reveal)
    // Medium weight alone, or single factors alone, don't qualify
    return false;
}

/**
 * Gets the reveal style based on eligibility.
 */
export function getRevealStyle(
    emotionalWeight: number,
    densityScore: number,
    pattern: Pattern
): 'gradual' | 'immediate' {
    return isRevealEligible(emotionalWeight, densityScore, pattern) 
        ? 'gradual' 
        : 'immediate';
}
