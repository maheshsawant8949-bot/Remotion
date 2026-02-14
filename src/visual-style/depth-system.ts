/**
 * Depth System
 * 
 * Depth must be subtle and rare.
 * Ban heavy shadows. Heavy shadows = amateur signal.
 */

/**
 * Depth Level
 */
export interface DepthLevel {
  shadow: string;
  elevation: number;
}

/**
 * Depth Levels
 * 
 * Only 3 levels:
 * - depth-0: flat (no shadow)
 * - depth-1: mild elevation (subtle shadow)
 * - depth-2: focus surfaces only (slightly stronger)
 */
export const DEPTH_LEVELS = {
  'depth-0': {
    shadow: 'none',
    elevation: 0,
  },
  'depth-1': {
    shadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
    elevation: 1,
  },
  'depth-2': {
    shadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
    elevation: 2,
  },
} as const;

/**
 * Get depth level
 */
export function getDepthLevel(level: keyof typeof DEPTH_LEVELS): DepthLevel {
  return DEPTH_LEVELS[level];
}

/**
 * Get depth for context
 */
export function getDepthForContext(context: {
  emphasis?: string;
  isFocused?: boolean;
  density?: number;
}): keyof typeof DEPTH_LEVELS {
  // High density → flat
  if (context.density && context.density >= 7) {
    return 'depth-0';
  }
  
  // Focused element → depth-2
  if (context.isFocused) {
    return 'depth-2';
  }
  
  // Strong emphasis → depth-1
  if (context.emphasis === 'strong') {
    return 'depth-1';
  }
  
  // Default: flat
  return 'depth-0';
}

/**
 * Validate depth level
 */
export function validateDepthLevel(shadow: string): void {
  // Ban heavy shadows
  const heavyShadowPatterns = [
    /rgba\(0,\s*0,\s*0,\s*[0-9.]+\).*rgba\(0,\s*0,\s*0,\s*[0-9.]+\)/,  // Multiple shadows
    /\d{2,}px/,  // Large blur radius (≥10px)
  ];
  
  for (const pattern of heavyShadowPatterns) {
    if (pattern.test(shadow)) {
      throw new Error('Depth validation failed: Heavy shadow detected (amateur signal)');
    }
  }
}
