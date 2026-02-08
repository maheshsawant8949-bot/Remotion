import { 
  Pattern,
  PATTERN_TO_BEHAVIOR_MAP 
} from './pattern-library';
import { Heuristics } from './heuristics';

export type VisualStrategy = {
  name: string;
  confidence: number;
  reason: string;
  // Structured Contract Fields
  purpose: string;
  pacingBias: 'fast' | 'medium' | 'slow';
  emphasisLevel: 'high' | 'medium' | 'low';
  preferredTemplates: string[];
};

const STRATEGY_DEFINITIONS: Record<Pattern | string, {
    purpose: string;
    pacingBias: 'fast' | 'medium' | 'slow';
    emphasisLevel: 'high' | 'medium' | 'low';
    preferredTemplates: string[];
}> = {
    'shocking_stat': {
        purpose: "Highlight a surprising statistic to grab attention",
        pacingBias: "slow",
        emphasisLevel: "high",
        preferredTemplates: ["hero", "diagram"]
    },
    'spatial_explanation': {
        purpose: "Clarify relationships in 2D or 3D space",
        pacingBias: "medium",
        emphasisLevel: "medium",
        preferredTemplates: ["diagram", "split_screen"]
    },
    'progressive_steps': {
        purpose: "Show evolution or sequence over time",
        pacingBias: "medium",
        emphasisLevel: "medium",
        preferredTemplates: ["timeline", "process"]
    },
    'credibility_stat': {
        purpose: "Build trust through data reinforcement",
        pacingBias: "medium",
        emphasisLevel: "medium",
        preferredTemplates: ["data", "hero"]
    },
    'emotional_impact': {
        purpose: "Evoke strong user sentiment",
        pacingBias: "slow",
        emphasisLevel: "high",
        preferredTemplates: ["hero", "diagram"]
    },
    'quantify': {
        purpose: "Represent numerical data clearly",
        pacingBias: "fast",
        emphasisLevel: "medium",
        preferredTemplates: ["data", "hero"]
    },
    'introduce': {
        purpose: "Set the context or introduce a topic",
        pacingBias: "slow",
        emphasisLevel: "high",
        preferredTemplates: ["diagram", "hero"]
    },
    'explain': {
        purpose: "Detailed breakdown of a concept",
        pacingBias: "medium",
        emphasisLevel: "medium",
        preferredTemplates: ["diagram", "process"]
    },
    'compare': {
        purpose: "Side-by-side comparison of entities",
        pacingBias: "medium",
        emphasisLevel: "medium",
        preferredTemplates: ["split_screen", "data"]
    },
    'unknown': {
        purpose: "Default fallback for unidentified intents",
        pacingBias: "medium",
        emphasisLevel: "low",
        preferredTemplates: ["default_view"]
    }
};

export class StrategyEngine {
  /**
   * Converts a raw intent string into a list of ranked visual strategies.
   * @param rawIntent The user's intent description.
   * @returns Array of VisualStrategy, sorted by confidence (descending).
   */
  /**
   * Converts a raw intent string into a list of ranked visual strategies.
   * @param rawIntent The user's intent description.
   * @param emotionalScore Optional emotional weight score (0-10). Default 0.
   * @returns Array of VisualStrategy, sorted by confidence (descending).
   */
  static predictStrategy(rawIntent: string, emotionalScore: number = 0): VisualStrategy[] {
    const { pattern, reason } = Heuristics.normalizeIntent(rawIntent);
    // Use the primary behavior from the map, but also pull contract details
    const primaryBehavior = PATTERN_TO_BEHAVIOR_MAP[pattern] || 'default_view';
    const contract = STRATEGY_DEFINITIONS[pattern] || STRATEGY_DEFINITIONS['unknown'];

    const results: VisualStrategy[] = [];

    // 1. Primary Match
    if (pattern !== 'unknown') {
       results.push({
         name: primaryBehavior,
         confidence: 0.85, 
         reason: `Primary Strategy: ${reason}`,
         ...contract
       });
    } else {
       results.push({
         name: 'default_view',
         confidence: 0.1,
         reason: reason, // "No matching pattern..."
         ...contract
       });
    }

    // 2. Secondary/Contextual Suggestions (Simulated intelligence for now)
    if (pattern === 'shocking_stat') {
        // Borrow 'quantify' or custom logic could go here
        results.push({ 
            name: 'data', 
            confidence: 0.45,
            reason: 'Secondary: Statistics can also be visualized as charts',
            purpose: "Alternative visualization for data",
            pacingBias: "medium",
            emphasisLevel: "medium",
            preferredTemplates: ["data"]
        });
    }
    
    // Boost confidence for progressive_steps when sequence detected
    if (pattern === 'progressive_steps') {
        // High confidence for timeline/staged strategies
        results[0].confidence = 0.90; // Boost primary confidence
        results[0].reason += ' [Sequence Boost: Strong sequential markers detected]';
    }
    
    if (pattern === 'spatial_explanation') {
        results.push({ 
            name: 'split_screen', 
            confidence: 0.30,
            reason: 'Secondary: Spatial context often benefits from side-by-side comparison',
            purpose: "Compare multiple spatial perspectives",
            pacingBias: "medium",
            emphasisLevel: "medium",
            preferredTemplates: ["split_screen"]
        });
    }

    if (pattern === 'compare') {
      results.push({ 
          name: 'data', 
          confidence: 0.55,
          reason: 'Secondary: Comparison data is naturally suited for bar charts',
          purpose: "Quantitative comparison",
          pacingBias: "fast",
          emphasisLevel: "medium",
          preferredTemplates: ["data"]
      });
    }

    // 3. Emotional Weight Influence (Confidence Modifier)
    // High Weight (7-10) -> Boost 'high' emphasis strategies
    // Low Weight (0-3) -> Boost 'low'/'medium' emphasis strategies (Logic: Info density usually correlates with lower emotional weight)
    
    const isHighWeight = emotionalScore >= 7;
    const isLowWeight = emotionalScore <= 3;

    results.forEach(strategy => {
        let modifier = 1.0;

        if (isHighWeight) {
            if (strategy.emphasisLevel === 'high') {
                modifier = 1.25; // 25% Boost
                strategy.reason += ` | High Emotion Boost`;
            } else if (strategy.emphasisLevel === 'low') {
                modifier = 0.8; // 20% Penalty
            }
        } else if (isLowWeight) {
            // Low weight often means we need to focus on information/clarity (diagrams/data) rather than "Hero" moments
            if (strategy.emphasisLevel === 'low' || strategy.emphasisLevel === 'medium') {
                modifier = 1.1; // 10% Boost for info-heavy strategies
                strategy.reason += ` | Low Emotion/Info Boost`;
            } else if (strategy.emphasisLevel === 'high') {
                modifier = 0.85; // Slight penalty for melodrama in neutral contexts
            }
        }

        strategy.confidence *= modifier;
        
        // Clamp confidence to 0-1 range
        strategy.confidence = Math.min(Math.max(strategy.confidence, 0), 1.0);
    });

    // Always sort by confidence
    return results.sort((a, b) => b.confidence - a.confidence);
  }
}
