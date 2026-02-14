/**
 * Spacing System
 * 
 * Base unit: 8px
 * All spacing must be multiples of the base unit.
 * 
 * HARD RULE: No random padding/margin values.
 * All spacing must use these tokens.
 */

const BASE_UNIT = 8;

export const SPACING_SCALE = {
  xs: BASE_UNIT * 1,      // 8px - tight spacing
  sm: BASE_UNIT * 2,      // 16px - compact
  md: BASE_UNIT * 3,      // 24px - standard
  lg: BASE_UNIT * 4,      // 32px - comfortable
  xl: BASE_UNIT * 6,      // 48px - spacious
  '2xl': BASE_UNIT * 8,   // 64px - dramatic
  '3xl': BASE_UNIT * 12,  // 96px - extra dramatic
  '4xl': BASE_UNIT * 16,  // 128px - maximum
} as const;

export type SpacingLevel = keyof typeof SPACING_SCALE;

/**
 * Get spacing value for a level
 */
export function getSpacing(level: SpacingLevel): number {
  return SPACING_SCALE[level];
}

/**
 * Get multiple spacing values at once
 * Useful for padding: [top, right, bottom, left]
 */
export function getSpacingMultiple(...levels: SpacingLevel[]): number[] {
  return levels.map(level => SPACING_SCALE[level]);
}

/**
 * Create spacing from base unit multiplier
 * Use this for custom spacing that still follows the grid
 */
export function spacing(multiplier: number): number {
  return BASE_UNIT * multiplier;
}

/**
 * Validate that a spacing value is on the grid
 * Returns true if valid, false otherwise
 */
export function validateSpacing(value: number): boolean {
  return value % BASE_UNIT === 0;
}

/**
 * Snap a value to the nearest grid unit
 * Use this to fix non-conforming values
 */
export function snapToGrid(value: number): number {
  return Math.round(value / BASE_UNIT) * BASE_UNIT;
}

/**
 * Common spacing patterns
 */
export const SPACING_PATTERNS = {
  // Padding patterns
  padding: {
    tight: { padding: SPACING_SCALE.sm },
    standard: { padding: SPACING_SCALE.md },
    comfortable: { padding: SPACING_SCALE.lg },
  },
  
  // Gap patterns (for flexbox/grid)
  gap: {
    compact: { gap: SPACING_SCALE.xs },
    standard: { gap: SPACING_SCALE.sm },
    spacious: { gap: SPACING_SCALE.md },
  },
  
  // Margin patterns
  margin: {
    section: { marginBottom: SPACING_SCALE.xl },
    element: { marginBottom: SPACING_SCALE.md },
    inline: { marginRight: SPACING_SCALE.sm },
  },
} as const;
