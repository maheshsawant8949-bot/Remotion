/**
 * Easing Library
 * 
 * Define ONLY 4 curves.
 * Avoid exotic curves.
 * 
 * NO bounce, elastic, overshoot.
 * Those kill professional tone instantly.
 * 
 * If someone notices easing → it's too aggressive.
 */

/**
 * Easing Curves
 * 
 * Keep curves subtle.
 */
export const EASING_CURVES = {
  // Soft ease-out (gentle, calm)
  gentleEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  
  // Ease-in-out (confident, balanced)
  confidentEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Fast ease-out (swift, snappy)
  swiftEase: 'cubic-bezier(0.4, 0, 0.6, 1)',
  
  // Slow ease-in-out (deliberate, thoughtful)
  deliberateEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Easing Type
 */
export type EasingType = keyof typeof EASING_CURVES;

/**
 * Get easing curve
 */
export function getEasingCurve(type: EasingType): string {
  return EASING_CURVES[type];
}

/**
 * Validate easing curve
 */
export function validateEasingCurve(curve: string): void {
  const allowedCurves = Object.values(EASING_CURVES);
  
  if (!allowedCurves.includes(curve) && curve !== 'linear') {
    // Check for exotic curves
    const exoticPatterns = [
      /bounce/i,
      /elastic/i,
      /back/i,  // overshoot
      /spring/i,
    ];
    
    for (const pattern of exoticPatterns) {
      if (pattern.test(curve)) {
        throw new Error(
          `Easing validation failed: Exotic curve "${curve}" detected (kills professional tone)`
        );
      }
    }
  }
}

/**
 * Easing Characteristics
 */
export const EASING_CHARACTERISTICS = {
  gentleEase: {
    description: 'Soft ease-out',
    usage: 'Calm, gentle motion',
    feel: 'Smooth, natural',
  },
  confidentEase: {
    description: 'Ease-in-out',
    usage: 'Confident, balanced motion',
    feel: 'Professional, controlled',
  },
  swiftEase: {
    description: 'Fast ease-out',
    usage: 'Swift, snappy motion',
    feel: 'Quick, responsive',
  },
  deliberateEase: {
    description: 'Slow ease-in-out',
    usage: 'Deliberate, thoughtful motion',
    feel: 'Intentional, measured',
  },
} as const;
