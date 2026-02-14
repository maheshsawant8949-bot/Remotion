/**
 * Style Profile: Editorial Modern
 * 
 * CRITICAL: Do NOT build multiple styles yet. Create ONE.
 * Editorial styles age slowly.
 * 
 * Avoid styles like: cinematic, futuristic, neon, glass.
 * Those age badly.
 */

/**
 * Style Profile
 */
export interface StyleProfile {
  name: string;
  tone: 'calm' | 'intelligent' | 'modern';
  contrast: 'low' | 'medium' | 'medium-high' | 'high';
  density: 'compact' | 'breathable' | 'spacious';
  rounding: 'none' | 'minimal' | 'moderate' | 'heavy';
  depth: 'flat' | 'subtle' | 'moderate' | 'pronounced';
}

/**
 * Editorial Modern Profile
 * 
 * Guiding constraints:
 * - tone: intelligent (calm, modern, professional)
 * - contrast: medium-high (strong hierarchy)
 * - density: breathable (not cramped)
 * - rounding: minimal (editorial, not playful)
 * - depth: subtle (no heavy shadows)
 * 
 * Every visual decision must align with these constraints.
 */
export const EDITORIAL_MODERN: StyleProfile = {
  name: 'editorial-modern',
  tone: 'intelligent',
  contrast: 'medium-high',
  density: 'breathable',
  rounding: 'minimal',
  depth: 'subtle',
};

/**
 * Get active style profile
 */
export function getStyleProfile(): StyleProfile {
  return EDITORIAL_MODERN;
}
