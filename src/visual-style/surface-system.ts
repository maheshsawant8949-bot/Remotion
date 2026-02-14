/**
 * Surface System
 * 
 * Avoid card-heavy UI look.
 * You are not building a dashboard.
 * Prefer editorial composition.
 */

/**
 * Surface Rules
 */
export interface SurfaceRules {
  elevation: 'flat' | 'subtle' | 'elevated';
  borderStyle: 'none' | 'minimal' | 'soft';
  separatorStyle: 'none' | 'soft' | 'defined';
}

/**
 * Editorial Modern Surfaces
 * 
 * - Flat with subtle elevation
 * - Low border usage
 * - Soft separators instead
 */
export const EDITORIAL_SURFACES: SurfaceRules = {
  elevation: 'subtle',
  borderStyle: 'minimal',
  separatorStyle: 'soft',
};

/**
 * Get surface style
 */
export function getSurfaceStyle(context?: {
  density?: number;
  emphasis?: string;
}): SurfaceRules {
  const base = { ...EDITORIAL_SURFACES };
  
  // High density → flatten surfaces
  if (context?.density && context.density >= 7) {
    base.elevation = 'flat';
  }
  
  // Strong emphasis → subtle elevation
  if (context?.emphasis === 'strong') {
    base.elevation = 'subtle';
  }
  
  return base;
}

/**
 * Get border width
 */
export function getBorderWidth(style: 'none' | 'minimal' | 'soft'): number {
  switch (style) {
    case 'none': return 0;
    case 'minimal': return 1;
    case 'soft': return 1;
    default: return 0;
  }
}

/**
 * Get separator opacity
 */
export function getSeparatorOpacity(style: 'none' | 'soft' | 'defined'): number {
  switch (style) {
    case 'none': return 0;
    case 'soft': return 0.1;
    case 'defined': return 0.2;
    default: return 0.1;
  }
}
