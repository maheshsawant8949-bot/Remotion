/**
 * Typography Scale
 * 
 * Strict typographic hierarchy for consistent visual communication.
 * 
 * HARD RULE: Never use arbitrary font sizes.
 * All text must use these exact tokens.
 */

export const TYPOGRAPHY_SCALE = {
  display: {
    size: 96,
    lineHeight: 1.1,
    weight: 700,
    letterSpacing: -0.02,
    usage: 'Hero moments, maximum impact',
  },
  headline: {
    size: 72,
    lineHeight: 1.2,
    weight: 700,
    letterSpacing: -0.01,
    usage: 'Section headers, major divisions',
  },
  title: {
    size: 56,
    lineHeight: 1.3,
    weight: 600,
    letterSpacing: 0,
    usage: 'Scene titles, primary content',
  },
  body: {
    size: 40,
    lineHeight: 1.5,
    weight: 400,
    letterSpacing: 0,
    usage: 'Main content, paragraphs',
  },
  caption: {
    size: 32,
    lineHeight: 1.4,
    weight: 400,
    letterSpacing: 0.01,
    usage: 'Supporting text, descriptions',
  },
  micro: {
    size: 24,
    lineHeight: 1.3,
    weight: 500,
    letterSpacing: 0.02,
    usage: 'Metadata, timestamps, labels',
  },
} as const;

export type TypographyLevel = keyof typeof TYPOGRAPHY_SCALE;

/**
 * Get font size for a typography level
 */
export function getFontSize(level: TypographyLevel): number {
  return TYPOGRAPHY_SCALE[level].size;
}

/**
 * Get complete typography styles for a level
 */
export function getTypographyStyles(level: TypographyLevel) {
  const scale = TYPOGRAPHY_SCALE[level];
  return {
    fontSize: scale.size,
    lineHeight: scale.lineHeight,
    fontWeight: scale.weight,
    letterSpacing: `${scale.letterSpacing}em`,
  };
}

/**
 * Validate that a font size matches a typography level
 * Returns the matching level or null if invalid
 */
export function validateFontSize(size: number): TypographyLevel | null {
  for (const [level, config] of Object.entries(TYPOGRAPHY_SCALE)) {
    if (config.size === size) {
      return level as TypographyLevel;
    }
  }
  return null;
}
