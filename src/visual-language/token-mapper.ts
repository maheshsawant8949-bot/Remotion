/**
 * Token Mapper
 * 
 * Maps semantic intents to visual tokens.
 * Provides helper functions for components to consume tokens without making styling decisions.
 */

import { getFontSize, TypographyLevel } from './typography-scale';
import { getSpacing, SpacingLevel } from './spacing-system';
import { colorRef, ColorRole } from './color-roles';
import { getBorderRadius, RadiusLevel } from './shape-language';

// ============================================================================
// TYPOGRAPHY MAPPING
// ============================================================================

export type TypographyIntent = 'hero' | 'title' | 'body' | 'caption' | 'label' | 'debug';

/**
 * Map semantic intent to typography level
 * 
 * @example
 * getTypographyForIntent('hero') // Returns display font size (80px)
 * getTypographyForIntent('title') // Returns title font size (48px)
 */
export function getTypographyForIntent(intent: TypographyIntent): number {
  const mapping: Record<TypographyIntent, TypographyLevel> = {
    hero: 'display',
    title: 'title',
    body: 'body',
    caption: 'caption',
    label: 'micro',
    debug: 'micro',
  };
  return getFontSize(mapping[intent]);
}

// ============================================================================
// SPACING MAPPING
// ============================================================================

export type SpacingIntent = 'tight' | 'normal' | 'comfortable' | 'spacious';

/**
 * Map semantic intent to spacing level
 * 
 * @example
 * getSpacingForIntent('tight') // Returns 8px
 * getSpacingForIntent('spacious') // Returns 40px
 */
export function getSpacingForIntent(intent: SpacingIntent): number {
  const mapping: Record<SpacingIntent, SpacingLevel> = {
    tight: 'sm',
    normal: 'md',
    comfortable: 'lg',
    spacious: 'xl',
  };
  return getSpacing(mapping[intent]);
}

// ============================================================================
// COLOR MAPPING
// ============================================================================

export type ColorIntent = 'primary' | 'secondary' | 'accent' | 'neutral' | 'background' | 'surface' | 'danger' | 'success' | 'warning';

/**
 * Map semantic intent to color role
 * 
 * @example
 * getColorForIntent('primary') // Returns colorRef('primary')
 */
export function getColorForIntent(intent: ColorIntent): string {
  return colorRef(intent as ColorRole);
}

// ============================================================================
// SHAPE MAPPING
// ============================================================================

export type ShapeIntent = 'subtle' | 'normal' | 'prominent' | 'full';

/**
 * Map semantic intent to border radius
 * 
 * @example
 * getShapeForIntent('subtle') // Returns 8px
 * getShapeForIntent('full') // Returns 9999px
 */
export function getShapeForIntent(intent: ShapeIntent): number {
  const mapping: Record<ShapeIntent, RadiusLevel> = {
    subtle: 'sm',
    normal: 'md',
    prominent: 'lg',
    full: 'full',
  };
  return getBorderRadius(mapping[intent]);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const tokens = {
  typography: {
    getForIntent: getTypographyForIntent,
    get: getFontSize,
  },
  spacing: {
    getForIntent: getSpacingForIntent,
    get: getSpacing,
  },
  colors: {
    getForIntent: getColorForIntent,
    ref: colorRef,
  },
  shapes: {
    getForIntent: getShapeForIntent,
    get: getBorderRadius,
  },
};
