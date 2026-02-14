/**
 * Contrast Rules
 * 
 * Automated contrast validation for accessibility.
 * Prevents low-contrast text automatically.
 * 
 * WCAG 2.1 Guidelines:
 * - Normal text: 4.5:1 minimum (AA)
 * - Large text (18pt+): 3:1 minimum (AA)
 * - Interactive elements: 3:1 minimum
 */

export type ContrastLevel = 'AAA' | 'AA' | 'FAIL';

export interface ContrastResult {
  ratio: number;
  level: ContrastLevel;
  passes: boolean;
  recommendation?: string;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * Returns ratio (1-21)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    throw new Error('Invalid color format. Use hex colors (#RRGGBB)');
  }

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate text contrast
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param fontSize - Font size in pixels
 * @param isBold - Whether text is bold
 */
export function validateTextContrast(
  foreground: string,
  background: string,
  fontSize: number,
  isBold: boolean = false
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  // Large text: 18pt (24px) or 14pt (18.66px) bold
  const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && isBold);

  const minRatioAA = isLargeText ? 3 : 4.5;
  const minRatioAAA = isLargeText ? 4.5 : 7;

  let level: ContrastLevel;
  let passes: boolean;
  let recommendation: string | undefined;

  if (ratio >= minRatioAAA) {
    level = 'AAA';
    passes = true;
  } else if (ratio >= minRatioAA) {
    level = 'AA';
    passes = true;
  } else {
    level = 'FAIL';
    passes = false;
    recommendation = `Contrast ratio ${ratio.toFixed(2)}:1 is below minimum ${minRatioAA}:1. Increase contrast or use larger text.`;
  }

  return { ratio, level, passes, recommendation };
}

/**
 * Validate interactive element contrast
 * Minimum 3:1 ratio required
 */
export function validateInteractiveContrast(
  foreground: string,
  background: string
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const passes = ratio >= 3;

  return {
    ratio,
    level: passes ? 'AA' : 'FAIL',
    passes,
    recommendation: passes
      ? undefined
      : `Interactive element contrast ${ratio.toFixed(2)}:1 is below minimum 3:1.`,
  };
}

/**
 * Suggest accessible color by adjusting lightness
 * Returns a modified color that meets contrast requirements
 */
export function suggestAccessibleColor(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  // This is a simplified implementation
  // In production, you'd use a more sophisticated algorithm
  const fg = hexToRgb(foreground);
  if (!fg) return foreground;

  // Try darkening or lightening the foreground
  const currentRatio = getContrastRatio(foreground, background);

  if (currentRatio >= targetRatio) {
    return foreground; // Already passes
  }

  // Simple approach: darken if light, lighten if dark
  const luminance = getLuminance(fg.r, fg.g, fg.b);
  const factor = luminance > 0.5 ? 0.8 : 1.2;

  const adjusted = {
    r: Math.min(255, Math.max(0, Math.round(fg.r * factor))),
    g: Math.min(255, Math.max(0, Math.round(fg.g * factor))),
    b: Math.min(255, Math.max(0, Math.round(fg.b * factor))),
  };

  return `#${adjusted.r.toString(16).padStart(2, '0')}${adjusted.g.toString(16).padStart(2, '0')}${adjusted.b.toString(16).padStart(2, '0')}`;
}

/**
 * Contrast validation presets
 */
export const CONTRAST_PRESETS = {
  normalText: {
    minRatio: 4.5,
    level: 'AA' as ContrastLevel,
    description: 'Normal text (WCAG AA)',
  },
  largeText: {
    minRatio: 3,
    level: 'AA' as ContrastLevel,
    description: 'Large text 18pt+ or 14pt+ bold (WCAG AA)',
  },
  interactive: {
    minRatio: 3,
    level: 'AA' as ContrastLevel,
    description: 'Interactive elements (WCAG AA)',
  },
  enhanced: {
    minRatio: 7,
    level: 'AAA' as ContrastLevel,
    description: 'Enhanced contrast (WCAG AAA)',
  },
} as const;
