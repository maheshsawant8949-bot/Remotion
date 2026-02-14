/**
 * Shape Language
 * 
 * Consistent shape direction for cohesive visual identity.
 * 
 * Direction: ROUNDED (modern, approachable)
 * 
 * HARD RULE: Never mix rounded and sharp shapes.
 * All shapes must use these border radii.
 */

export type ShapeDirection = 'rounded' | 'sharp' | 'minimal';

export const SHAPE_DIRECTION: ShapeDirection = 'rounded';

/**
 * Border radius scale for rounded direction
 */
export const BORDER_RADIUS = {
  none: 0,
  sm: 8,      // Buttons, chips, small elements
  md: 16,     // Cards, panels, medium containers
  lg: 24,     // Modals, large containers
  xl: 32,     // Extra large containers
  full: 9999, // Pills, avatars, circular elements
} as const;

export type RadiusLevel = keyof typeof BORDER_RADIUS;

/**
 * Get border radius value
 */
export function getBorderRadius(level: RadiusLevel): number {
  return BORDER_RADIUS[level];
}

/**
 * Get border radius style object
 */
export function getBorderRadiusStyle(level: RadiusLevel) {
  return {
    borderRadius: BORDER_RADIUS[level],
  };
}

/**
 * Get border radius for specific corners
 */
export function getBorderRadiusCorners(
  topLeft: RadiusLevel,
  topRight: RadiusLevel,
  bottomRight: RadiusLevel,
  bottomLeft: RadiusLevel
) {
  return {
    borderTopLeftRadius: BORDER_RADIUS[topLeft],
    borderTopRightRadius: BORDER_RADIUS[topRight],
    borderBottomRightRadius: BORDER_RADIUS[bottomRight],
    borderBottomLeftRadius: BORDER_RADIUS[bottomLeft],
  };
}

/**
 * Common shape patterns
 */
export const SHAPE_PATTERNS = {
  // Button shapes
  button: {
    primary: { borderRadius: BORDER_RADIUS.sm },
    secondary: { borderRadius: BORDER_RADIUS.sm },
    pill: { borderRadius: BORDER_RADIUS.full },
  },

  // Container shapes
  container: {
    card: { borderRadius: BORDER_RADIUS.md },
    panel: { borderRadius: BORDER_RADIUS.md },
    modal: { borderRadius: BORDER_RADIUS.lg },
  },

  // Element shapes
  element: {
    chip: { borderRadius: BORDER_RADIUS.sm },
    badge: { borderRadius: BORDER_RADIUS.full },
    avatar: { borderRadius: BORDER_RADIUS.full },
    image: { borderRadius: BORDER_RADIUS.md },
  },
} as const;

/**
 * Validate that a border radius matches the shape language
 */
export function validateBorderRadius(radius: number): boolean {
  return Object.values(BORDER_RADIUS).includes(radius);
}

/**
 * Shape direction guidelines
 */
export const SHAPE_GUIDELINES = {
  rounded: {
    direction: 'rounded' as ShapeDirection,
    description: 'Modern, approachable, friendly',
    usage: 'Use for consumer-facing, creative, or approachable content',
    avoid: 'Mixing with sharp corners creates visual inconsistency',
  },
  sharp: {
    direction: 'sharp' as ShapeDirection,
    description: 'Professional, technical, precise',
    usage: 'Use for technical, corporate, or formal content',
    avoid: 'Can feel cold or uninviting if overused',
  },
  minimal: {
    direction: 'minimal' as ShapeDirection,
    description: 'Clean, understated, elegant',
    usage: 'Use for minimalist, editorial, or sophisticated content',
    avoid: 'Can lack visual interest if not balanced with other elements',
  },
} as const;

/**
 * Get current shape direction
 */
export function getShapeDirection(): ShapeDirection {
  return SHAPE_DIRECTION;
}

/**
 * Check if shape direction is consistent
 */
export function isShapeDirectionConsistent(direction: ShapeDirection): boolean {
  return direction === SHAPE_DIRECTION;
}
