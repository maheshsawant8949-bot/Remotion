/**
 * Scene Archetypes
 * 
 * VERY IMPORTANT: Do NOT allow infinite designs. Constraint creates quality.
 * 
 * Create ONLY these 10 archetypes.
 * These cover ~85% of educational needs.
 * 
 * Most channels reuse the same structures — intentionally.
 * Viewers learn the visual language.
 */

/**
 * Scene Archetype
 */
export type SceneArchetype =
  | 'timeline'
  | 'flow'
  | 'comparison'
  | 'build-up'
  | 'stat-focus'
  | 'map'
  | 'network'
  | 'layered-explainer'
  | 'cause-effect'
  | 'before-after';

/**
 * Archetype Metadata
 */
export interface ArchetypeMetadata {
  name: SceneArchetype;
  description: string;
  useCase: string;
  maxElements: number;
  recommendedDuration: [number, number];  // [min, max] in seconds
}

/**
 * Archetype Definitions
 */
export const ARCHETYPE_DEFINITIONS: Record<SceneArchetype, ArchetypeMetadata> = {
  'timeline': {
    name: 'timeline',
    description: 'Chronological events displayed linearly',
    useCase: 'Historical progression, roadmaps, milestones',
    maxElements: 6,
    recommendedDuration: [3, 6],
  },
  'flow': {
    name: 'flow',
    description: 'Process steps with directional flow',
    useCase: 'Manufacturing pipeline, workflows, algorithms',
    maxElements: 6,
    recommendedDuration: [3, 7],
  },
  'comparison': {
    name: 'comparison',
    description: 'Side-by-side comparison of two items',
    useCase: 'Before vs After, Option A vs Option B',
    maxElements: 8,
    recommendedDuration: [2, 5],
  },
  'build-up': {
    name: 'build-up',
    description: 'Accumulation or growth over time',
    useCase: 'Revenue growth, user adoption, scaling',
    maxElements: 5,
    recommendedDuration: [2, 4],
  },
  'stat-focus': {
    name: 'stat-focus',
    description: 'Single metric or statistic emphasized',
    useCase: '85% increase, $1M revenue, 10x growth',
    maxElements: 3,
    recommendedDuration: [1.5, 3],
  },
  'map': {
    name: 'map',
    description: 'Geographic or spatial visualization',
    useCase: 'Global distribution, regional data, locations',
    maxElements: 8,
    recommendedDuration: [3, 6],
  },
  'network': {
    name: 'network',
    description: 'Interconnected nodes and relationships',
    useCase: 'Social graph, dependencies, connections',
    maxElements: 8,
    recommendedDuration: [3, 6],
  },
  'layered-explainer': {
    name: 'layered-explainer',
    description: 'Nested concepts revealed progressively',
    useCase: 'System architecture, hierarchies, components',
    maxElements: 7,
    recommendedDuration: [4, 8],
  },
  'cause-effect': {
    name: 'cause-effect',
    description: 'Causal relationships between elements',
    useCase: 'A leads to B, chain reactions, consequences',
    maxElements: 6,
    recommendedDuration: [2, 5],
  },
  'before-after': {
    name: 'before-after',
    description: 'Transformation or state change',
    useCase: 'Problem → Solution, Old → New, Improvement',
    maxElements: 6,
    recommendedDuration: [2, 4],
  },
};

/**
 * Archetype Selector
 */
export class ArchetypeSelector {
  /**
   * Select archetype based on intent
   */
  static select(intent: any, content: string): SceneArchetype {
    const lower = content.toLowerCase();
    
    // Timeline indicators
    if (lower.match(/\b(timeline|chronology|history|evolution|over time)\b/)) {
      return 'timeline';
    }
    
    // Flow indicators
    if (lower.match(/\b(process|workflow|steps|pipeline|flow|procedure)\b/)) {
      return 'flow';
    }
    
    // Comparison indicators
    if (lower.match(/\b(versus|vs|compared to|difference|contrast)\b/)) {
      return 'comparison';
    }
    
    // Build-up indicators
    if (lower.match(/\b(growth|increase|accumulation|scaling|expansion)\b/)) {
      return 'build-up';
    }
    
    // Stat-focus indicators
    if (lower.match(/\b(\d+%|\d+x|percentage|metric|statistic)\b/)) {
      return 'stat-focus';
    }
    
    // Map indicators
    if (lower.match(/\b(global|worldwide|regional|geographic|location)\b/)) {
      return 'map';
    }
    
    // Network indicators
    if (lower.match(/\b(network|connections|relationships|graph|linked)\b/)) {
      return 'network';
    }
    
    // Layered-explainer indicators
    if (lower.match(/\b(architecture|layers|components|structure|system)\b/)) {
      return 'layered-explainer';
    }
    
    // Cause-effect indicators
    if (lower.match(/\b(causes|leads to|results in|because|therefore)\b/)) {
      return 'cause-effect';
    }
    
    // Before-after indicators
    if (lower.match(/\b(before|after|transformation|change|improvement)\b/)) {
      return 'before-after';
    }
    
    // Default: flow (most versatile)
    return 'flow';
  }
  
  /**
   * Get archetype metadata
   */
  static getMetadata(archetype: SceneArchetype): ArchetypeMetadata {
    return ARCHETYPE_DEFINITIONS[archetype];
  }
  
  /**
   * Validate duration for archetype
   */
  static isValidDuration(archetype: SceneArchetype, duration: number): boolean {
    const metadata = this.getMetadata(archetype);
    const [min, max] = metadata.recommendedDuration;
    return duration >= min && duration <= max;
  }
}
