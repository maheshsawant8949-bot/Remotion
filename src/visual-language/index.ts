/**
 * Visual Language Layer
 * 
 * Central export for all design tokens.
 * 
 * This layer defines the visual language of the system:
 * - Typography: Strict hierarchy (display → micro)
 * - Spacing: 8px base unit multiples
 * - Colors: Semantic roles (not palettes)
 * - Contrast: WCAG AA accessibility
 * - Shapes: Rounded direction (modern, approachable)
 * 
 * HARD RULES:
 * 1. Never use arbitrary font sizes
 * 2. Never use random padding/margin
 * 3. Never use hex codes directly
 * 4. Never mix shape directions
 * 5. Always validate contrast
 */

// Typography
export {
  TYPOGRAPHY_SCALE,
  type TypographyLevel,
  getFontSize,
  getTypographyStyles,
  validateFontSize,
} from './typography-scale';

// Spacing
export {
  SPACING_SCALE,
  type SpacingLevel,
  getSpacing,
  getSpacingMultiple,
  spacing,
  validateSpacing,
  snapToGrid,
  SPACING_PATTERNS,
} from './spacing-system';

// Colors
export {
  type ColorRole,
  type ColorVariant,
  COLOR_ROLES,
  getColorRole,
  colorRef,
  COLOR_COMBINATIONS,
  validateColorRole,
} from './color-roles';

// Contrast
export {
  type ContrastLevel,
  type ContrastResult,
  getContrastRatio,
  validateTextContrast,
  validateInteractiveContrast,
  suggestAccessibleColor,
  CONTRAST_PRESETS,
} from './contrast-rules';

// Shapes
export {
  type ShapeDirection,
  type RadiusLevel,
  SHAPE_DIRECTION,
  BORDER_RADIUS,
  getBorderRadius,
  getBorderRadiusStyle,
  getBorderRadiusCorners,
  SHAPE_PATTERNS,
  validateBorderRadius,
  SHAPE_GUIDELINES,
  getShapeDirection,
  isShapeDirectionConsistent,
} from './shape-language';

// Helper Functions
export {
  applyTypography,
  space,
  ensureContrast,
} from './helpers';

// Runtime Validation (Development Only)
export {
  validateStyles,
  withStyleValidation,
} from './runtime-validator';
