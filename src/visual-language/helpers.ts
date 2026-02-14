/**
 * Visual Language Helper Functions
 * 
 * Convenience functions for applying visual tokens in components.
 * These helpers prevent common mistakes and ensure consistent usage.
 */

import React from 'react';
import { getTypographyStyles, TypographyLevel } from './typography-scale';
import { spacing as spacingFn } from './spacing-system';
import { validateTextContrast, suggestAccessibleColor } from './contrast-rules';

// ============================================================================
// TYPOGRAPHY HELPER
// ============================================================================

/**
 * Apply complete typography styles for a level
 * Prevents size drift and ensures consistent hierarchy
 * 
 * @example
 * <div style={{ ...applyTypography('headline'), fontWeight: 600 }}>
 */
export function applyTypography(level: TypographyLevel): React.CSSProperties {
  const styles = getTypographyStyles(level);
  return {
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
  };
}

// ============================================================================
// SPACING HELPER
// ============================================================================

/**
 * Spacing helper - returns multiples of 8px base unit
 * 
 * @example
 * space(1) = 8px
 * space(2) = 16px
 * space(5) = 40px
 */
export function space(multiplier: number): number {
  return spacingFn(multiplier);
}

// ============================================================================
// CONTRAST HELPER
// ============================================================================

/**
 * Ensure contrast between foreground and background
 * Auto-swaps to safe color if contrast fails WCAG AA
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param fontSize - Font size in pixels (default: 16)
 * @param isBold - Whether text is bold (default: false)
 * @returns Safe foreground color that meets contrast requirements
 * 
 * @example
 * const safeColor = ensureContrast('#666', '#fff', 16, false);
 */
export function ensureContrast(
  foreground: string,
  background: string,
  fontSize: number = 16,
  isBold: boolean = false
): string {
  const result = validateTextContrast(foreground, background, fontSize, isBold);
  
  if (!result.passes) {
    // Determine target ratio based on text size
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && isBold);
    const targetRatio = isLargeText ? 3 : 4.5;
    
    // Return suggested accessible color
    return suggestAccessibleColor(foreground, background, targetRatio);
  }
  
  return foreground;
}
