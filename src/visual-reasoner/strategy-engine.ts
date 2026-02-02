import { 
  PATTERN_TO_BEHAVIOR_MAP 
} from './pattern-library';
import { Heuristics } from './heuristics';

export type VisualStrategy = {
  name: string;
  confidence: number;
  reason: string;
};

export class StrategyEngine {
  /**
   * Converts a raw intent string into a list of ranked visual strategies.
   * @param rawIntent The user's intent description.
   * @returns Array of VisualStrategy, sorted by confidence (descending).
   */
  static predictStrategy(rawIntent: string): VisualStrategy[] {
    const { pattern, reason } = Heuristics.normalizeIntent(rawIntent);
    const primaryBehavior = PATTERN_TO_BEHAVIOR_MAP[pattern];

    const results: VisualStrategy[] = [];

    // 1. Primary Match
    if (pattern !== 'unknown') {
       results.push({
         name: primaryBehavior,
         confidence: 0.85, // High confidence for rule-based match
         reason: `Primary Strategy: ${reason}`
       });
    } else {
       results.push({
         name: 'default_view',
         confidence: 0.1,
         reason: reason // "No matching pattern..."
       });
    }

    // 2. Secondary/Contextual Suggestions (Simulated intelligence for now)
    // In a real logic, we might see if "shocking_stat" could also work as "data".
    if (pattern === 'shocking_stat') {
        // A shocking stat is usually a Hero, but could be a Chart/Data view.
        results.push({ 
            name: 'data', 
            confidence: 0.45,
            reason: 'Secondary: Statistics can also be visualized as charts'
        });
    }
    
    if (pattern === 'spatial_explanation') {
        // A map could also be a split screen with info.
        results.push({ 
            name: 'split_screen', 
            confidence: 0.30,
            reason: 'Secondary: Spatial context often benefits from side-by-side comparison'
        });
    }

    if (pattern === 'compare') {
      // Comparision could be a data chart too
      results.push({ 
          name: 'data', 
          confidence: 0.55,
          reason: 'Secondary: Comparison data is naturally suited for bar charts' 
      });
    }

    // Always sort by confidence
    return results.sort((a, b) => b.confidence - a.confidence);
  }
}
