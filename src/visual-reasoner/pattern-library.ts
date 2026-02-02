/**
 * Represents the specific pattern or intent detected in the input.
 */
export type Pattern = 
  | 'shocking_stat' 
  | 'spatial_explanation' 
  | 'progressive_steps' 
  | 'credibility_stat'
  | 'emotional_impact'
  | 'quantify' 
  | 'introduce' 
  | 'explain' 
  | 'compare'
  | 'unknown';

/**
 * Represents the concrete visual behavior (Layout ID).
 */
export type SceneBehavior = 
  | 'hero' 
  | 'diagram' 
  | 'timeline' 
  | 'data'
  | 'title'
  | 'split_screen'
  | 'default_view';

/**
 * Mapping of patterns to their primary scene behaviors.
 */
export const PATTERN_TO_BEHAVIOR_MAP: Record<Pattern, SceneBehavior> = {
  shocking_stat: 'hero',
  spatial_explanation: 'diagram',
  progressive_steps: 'timeline',
  credibility_stat: 'data',
  emotional_impact: 'hero', // Emphasize emotional moments with hero layout
  
  // Legacy/General mappings
  quantify: 'hero',
  introduce: 'title',
  explain: 'diagram',
  compare: 'split_screen',
  unknown: 'default_view'
};

/**
 * List of known patterns for validation.
 */
export const KNOWN_PATTERNS: Pattern[] = Object.keys(PATTERN_TO_BEHAVIOR_MAP) as Pattern[];

// Re-exporting legacy types for backward compatibility if needed, 
// but aliasing them to the new types.
export type Intent = Pattern;
export type Strategy = SceneBehavior;
export const INTENT_TO_STRATEGY_MAP = PATTERN_TO_BEHAVIOR_MAP;
