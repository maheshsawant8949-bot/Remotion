/**
 * Visual Style System
 * 
 * Defines the visual personality of the engine.
 * This is NOT a theme switcher. This is the system's default design language.
 * 
 * Style decorates decisions, never overrides intelligence.
 * Editorial styles age slowly.
 */

export {
  type StyleProfile,
  EDITORIAL_MODERN,
  getStyleProfile,
} from './style-profile';

export {
  type ColorPalette,
  EDITORIAL_PALETTE,
  getPalette,
  validatePalette,
} from './palette';

export {
  type FontPairing,
  EDITORIAL_FONTS,
  FONT_ROLE_MAPPING,
  getFontForRole,
  validateFontPairing,
} from './font-pairing';

export {
  type SurfaceRules,
  EDITORIAL_SURFACES,
  getSurfaceStyle,
  getBorderWidth,
  getSeparatorOpacity,
} from './surface-system';

export {
  type DepthLevel,
  DEPTH_LEVELS,
  getDepthLevel,
  getDepthForContext,
  validateDepthLevel,
} from './depth-system';

export {
  ACCENT_USAGE,
  type AccentContext,
  AccentGuard,
} from './accent-rules';

export {
  type BackgroundStyle,
  EDITORIAL_BACKGROUND,
  getBackgroundStyle,
  getBackgroundCSS,
  validateBackground,
} from './background-system';

export {
  StyleResolver,
  type StyleContext,
  type ResolvedStyle,
} from './style-resolver';
