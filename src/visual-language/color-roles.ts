/**
 * Color Roles
 * 
 * Semantic color roles, NOT specific colors.
 * Components reference roles, renderer maps to actual colors.
 * 
 * HARD RULE: Never use hex codes directly.
 * Always reference semantic roles.
 */

export type ColorRole = 
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'background'
  | 'surface'
  | 'danger'
  | 'success'
  | 'warning';

export type ColorVariant = 'default' | 'light' | 'dark' | 'contrast';

/**
 * Color role definitions with semantic meaning
 */
export const COLOR_ROLES = {
  primary: {
    role: 'primary',
    usage: 'Main brand color, primary actions, key elements',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
  secondary: {
    role: 'secondary',
    usage: 'Supporting color, secondary actions, complementary elements',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
  accent: {
    role: 'accent',
    usage: 'Highlight color, emphasis, call-to-action',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
  neutral: {
    role: 'neutral',
    usage: 'Text, borders, dividers, neutral UI elements',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
  background: {
    role: 'background',
    usage: 'Page background, canvas, base layer',
    variants: ['default', 'light', 'dark'] as ColorVariant[],
  },
  surface: {
    role: 'surface',
    usage: 'Cards, panels, elevated surfaces',
    variants: ['default', 'light', 'dark'] as ColorVariant[],
  },
  danger: {
    role: 'danger',
    usage: 'Errors, destructive actions, warnings',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
  success: {
    role: 'success',
    usage: 'Success states, confirmations, positive feedback',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
  warning: {
    role: 'warning',
    usage: 'Warnings, cautions, important notices',
    variants: ['default', 'light', 'dark', 'contrast'] as ColorVariant[],
  },
} as const;

/**
 * Get color role definition
 */
export function getColorRole(role: ColorRole) {
  return COLOR_ROLES[role];
}

/**
 * Create a color reference (to be resolved by renderer)
 */
export function colorRef(role: ColorRole, variant: ColorVariant = 'default'): string {
  return `var(--color-${role}-${variant})`;
}

/**
 * Common color combinations for accessibility
 */
export const COLOR_COMBINATIONS = {
  // Text on background
  textOnBackground: {
    foreground: 'neutral' as ColorRole,
    background: 'background' as ColorRole,
  },
  
  // Text on surface
  textOnSurface: {
    foreground: 'neutral' as ColorRole,
    background: 'surface' as ColorRole,
  },
  
  // Primary action
  primaryAction: {
    foreground: 'primary' as ColorRole,
    background: 'background' as ColorRole,
  },
  
  // Accent highlight
  accentHighlight: {
    foreground: 'accent' as ColorRole,
    background: 'surface' as ColorRole,
  },
  
  // Danger alert
  dangerAlert: {
    foreground: 'danger' as ColorRole,
    background: 'background' as ColorRole,
  },
} as const;

/**
 * Validate that a color role exists
 */
export function validateColorRole(role: string): role is ColorRole {
  return role in COLOR_ROLES;
}
