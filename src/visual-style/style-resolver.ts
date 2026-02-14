/**
 * Style Resolver
 * 
 * Translates style profile → renderer tokens.
 * Style must respond to narrative — but gently. Never theatrically.
 * 
 * HARD RULES:
 * - Style is decoration — not direction
 * - Never override emphasis
 * - Never override camera
 * - Never change layout
 * - Never fight cognition
 */

import { getStyleProfile } from './style-profile';
import { getPalette, ColorPalette } from './palette';
import { EDITORIAL_FONTS, getFontForRole } from './font-pairing';
import { getSurfaceStyle, SurfaceRules } from './surface-system';
import { getDepthForContext } from './depth-system';
import { AccentGuard, AccentContext } from './accent-rules';
import { getBackgroundStyle } from './background-system';

/**
 * Style Context
 */
export interface StyleContext {
  // Scene properties
  emphasisLevel?: string;
  density?: number;
  emotionalWeight?: number;
  
  // Element properties
  isKeyStat?: boolean;
  isFocused?: boolean;
  isDiagramHighlight?: boolean;
}

/**
 * Resolved Style
 */
export interface ResolvedStyle {
  colors: ColorPalette & {
    allowAccent: boolean;
    contrastBoost?: number;
  };
  fonts: {
    primary: string;
    secondary?: string;
  };
  surfaces: SurfaceRules;
  depth: 'depth-0' | 'depth-1' | 'depth-2';
  background: string;
}

/**
 * Style Resolver
 */
export class StyleResolver {
  /**
   * Resolve style for context
   * 
   * Responds to:
   * - Emphasis (allow accent for strong)
   * - Density (reduce elevation for high)
   * - Emotion (slightly increase contrast for high)
   */
  static resolve(context: StyleContext): ResolvedStyle {
    const profile = getStyleProfile();
    const basePalette = getPalette();
    const fonts = EDITORIAL_FONTS;
    const surfaces = getSurfaceStyle({
      density: context.density,
      emphasis: context.emphasisLevel,
    });
    const depth = getDepthForContext({
      emphasis: context.emphasisLevel,
      isFocused: context.isFocused,
      density: context.density,
    });
    const background = getBackgroundStyle();
    
    // Resolve colors with context
    const colors = this.resolveColors(basePalette, context);
    
    return {
      colors,
      fonts: {
        primary: fonts.primary.family,
        secondary: fonts.secondary?.family,
      },
      surfaces,
      depth,
      background: background.primary,
    };
  }
  
  /**
   * Resolve colors with context
   */
  private static resolveColors(
    basePalette: ColorPalette,
    context: StyleContext
  ): ColorPalette & { allowAccent: boolean; contrastBoost?: number } {
    const colors = { ...basePalette, allowAccent: false };
    
    // Check if accent is allowed
    const accentContext: AccentContext = {
      emphasisLevel: context.emphasisLevel,
      isKeyStat: context.isKeyStat,
      isFocused: context.isFocused,
      isDiagramHighlight: context.isDiagramHighlight,
    };
    
    colors.allowAccent = AccentGuard.isAccentAllowed(accentContext);
    
    // Respond to emotion (slightly increase contrast)
    if (context.emotionalWeight && context.emotionalWeight >= 7) {
      return { ...colors, contrastBoost: 1.05 };
    }
    
    return colors;
  }
  
  /**
   * Get color for text
   */
  static getTextColor(isPrimary: boolean, useAccent: boolean, allowAccent: boolean): string {
    const palette = getPalette();
    
    if (useAccent && allowAccent) {
      return palette.accent;
    }
    
    return isPrimary ? palette.primaryText : palette.secondaryText;
  }
  
  /**
   * Get font family for role
   */
  static getFontFamily(role: 'display' | 'headline' | 'body' | 'data'): string {
    return getFontForRole(role);
  }
}
