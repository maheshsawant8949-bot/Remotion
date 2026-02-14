/**
 * Font Pairing
 * 
 * DO NOT use more than two fonts.
 * Avoid trendy fonts. Pick neutral longevity.
 * 
 * No freestyle font usage allowed.
 */

/**
 * Font Pairing
 */
export interface FontPairing {
  primary: {
    family: string;
    weights: number[];
  };
  secondary?: {
    family: string;
    weights: number[];
  };
}

/**
 * Editorial Modern Fonts
 * 
 * Primary: Inter (modern grotesk, neutral longevity)
 * Secondary: JetBrains Mono (data/code, optional)
 */
export const EDITORIAL_FONTS: FontPairing = {
  primary: {
    family: 'Inter',
    weights: [400, 500, 600],
  },
  secondary: {
    family: 'JetBrains Mono',
    weights: [400, 500],
  },
};

/**
 * Font Role Mapping
 * 
 * Enforce roles - map fonts to tokens.
 */
export const FONT_ROLE_MAPPING = {
  display: 'primary',
  headline: 'primary',
  body: 'primary',
  data: 'secondary',
} as const;

/**
 * Get font for role
 */
export function getFontForRole(role: keyof typeof FONT_ROLE_MAPPING): string {
  const fontType = FONT_ROLE_MAPPING[role];
  
  if (fontType === 'primary') {
    return EDITORIAL_FONTS.primary.family;
  } else if (fontType === 'secondary' && EDITORIAL_FONTS.secondary) {
    return EDITORIAL_FONTS.secondary.family;
  }
  
  return EDITORIAL_FONTS.primary.family;
}

/**
 * Validate font pairing
 */
export function validateFontPairing(pairing: FontPairing): void {
  const fontCount = pairing.secondary ? 2 : 1;
  
  if (fontCount > 2) {
    throw new Error(`Font pairing validation failed: ${fontCount} fonts exceeds 2 font limit`);
  }
}
