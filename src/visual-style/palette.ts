/**
 * Palette System
 * 
 * Role-based colors ONLY.
 * Target: 5-7 colors max.
 * 
 * HARD RULES:
 * - ❌ No pure black (#000000)
 * - ❌ No pure white (#FFFFFF)
 * - ❌ No saturated accent
 * - ✅ Use softened values
 * 
 * This instantly increases perceived design maturity.
 */

/**
 * Color Palette
 */
export interface ColorPalette {
  background: string;
  surface: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  divider: string;
}

/**
 * Editorial Modern Palette
 * 
 * 6 colors total (within 5-7 target).
 * All values softened for maturity.
 */
export const EDITORIAL_PALETTE: ColorPalette = {
  // Background: Soft near-black (not pure black)
  background: '#0F1419',
  
  // Surface: Elevated surface (subtle difference from background)
  surface: '#1A1F26',
  
  // Primary text: Soft near-white (not pure white)
  primaryText: '#E8EAED',
  
  // Secondary text: Muted gray (readable but de-emphasized)
  secondaryText: '#9AA0A6',
  
  // Accent: Desaturated blue (not saturated)
  accent: '#5E8FD9',
  
  // Divider: Subtle separator (barely visible)
  divider: '#2D3339',
};

/**
 * Get active palette
 */
export function getPalette(): ColorPalette {
  return EDITORIAL_PALETTE;
}

/**
 * Validate palette rules
 */
export function validatePalette(palette: ColorPalette): void {
  // Check for pure black
  if (palette.background === '#000000' || palette.surface === '#000000') {
    throw new Error('Palette validation failed: Pure black detected');
  }
  
  // Check for pure white
  if (palette.primaryText === '#FFFFFF') {
    throw new Error('Palette validation failed: Pure white detected');
  }
  
  // Count colors
  const colors = Object.values(palette);
  if (colors.length > 7) {
    throw new Error(`Palette validation failed: ${colors.length} colors exceeds 7 color limit`);
  }
}
