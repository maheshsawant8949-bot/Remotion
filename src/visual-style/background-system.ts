/**
 * Background System
 * 
 * Background must disappear. Foreground tells the story.
 * 
 * Avoid:
 * - ❌ Loud gradients
 * - ❌ Color shifts
 * - ❌ Animated backgrounds
 */

/**
 * Background Style
 */
export interface BackgroundStyle {
  type: 'solid' | 'subtle-gradient';
  primary: string;
  secondary?: string;
}

/**
 * Editorial Modern Background
 * 
 * Calm neutral background.
 * Optional subtle gradient (not implemented yet).
 */
export const EDITORIAL_BACKGROUND: BackgroundStyle = {
  type: 'solid',
  primary: '#0F1419',
};

/**
 * Get background style
 */
export function getBackgroundStyle(): BackgroundStyle {
  return EDITORIAL_BACKGROUND;
}

/**
 * Get background CSS
 */
export function getBackgroundCSS(style: BackgroundStyle): string {
  if (style.type === 'solid') {
    return style.primary;
  }
  
  if (style.type === 'subtle-gradient' && style.secondary) {
    // Subtle gradient (very subtle, almost imperceptible)
    return `linear-gradient(180deg, ${style.primary} 0%, ${style.secondary} 100%)`;
  }
  
  return style.primary;
}

/**
 * Validate background
 */
export function validateBackground(style: BackgroundStyle): void {
  // Ban loud gradients (check if colors are too different)
  if (style.type === 'subtle-gradient' && style.secondary) {
    const primary = parseInt(style.primary.replace('#', ''), 16);
    const secondary = parseInt(style.secondary.replace('#', ''), 16);
    
    const diff = Math.abs(primary - secondary);
    
    // If difference is too large, it's a loud gradient
    if (diff > 0x111111) {  // Arbitrary threshold for "subtle"
      throw new Error('Background validation failed: Gradient too loud (background must disappear)');
    }
  }
}
