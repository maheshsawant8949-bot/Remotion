/**
 * Asset Intelligence Layer
 * 
 * Production-grade asset orchestration system that selects high-quality visuals
 * aligned with narrative intent, style constraints, and cinematic pacing.
 * 
 * This is a core production engine, not a helper module.
 * 
 * Pipeline order:
 * 1. Scene compilation
 * 2. Audio timing
 * 3. 👉 ASSET INTELLIGENCE (this module)
 * 4. Render preparation
 * 
 * Elite Rule: 1 GREAT visual beats 5 average ones.
 * Don't flood scenes. Let visuals breathe.
 */

export {
  type VisualCategory,
  type VisualIntent,
  VisualIntentExtractor,
} from './visual-intent-extractor';

export {
  type AssetPath,
  type AssetStrategy,
  AssetStrategyEngine,
} from './asset-strategy';

export {
  type AssetSource,
  type AssetResult,
  MultiSourceResolver,
} from './multi-source-resolver';

export {
  type StyleCriteria,
  type StyleValidationResult,
  StyleValidator,
} from './style-validator';

export {
  type AssetScore,
  AssetRanker,
} from './asset-ranker';

export {
  type CachedAsset,
  AssetCache,
} from './asset-cache';

export {
  type FallbackType,
  type FallbackConfig,
  FallbackGenerator,
} from './fallback-generator';
