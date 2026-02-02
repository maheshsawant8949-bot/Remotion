import { Pattern, KNOWN_PATTERNS } from './pattern-library';

export type HeuristicRule = {
    id: string;
    pattern: Pattern;
    matches: (text: string) => boolean;
    description: string;
};

export type IntentResult = {
    pattern: Pattern;
    reason: string;
};

export class Heuristics {
    /**
     * Rules are evaluated in order. First match wins.
     */
    static rules: HeuristicRule[] = [
        // 1. Large Numbers -> shocking_stat (Hero)
        {
            id: 'large_number',
            pattern: 'shocking_stat',
            matches: (text) => /\b\d{1,3}(,\d{3})*(\.\d+)?\b/g.test(text) && (text.includes('million') || text.includes('billion') || text.length > 50),
             description: 'Detects large numbers (millions/billions) implies shocking statistic'
        },
        
        // 2. Emotional Language -> emotional_impact (Hero)
        {
            id: 'emotional_impact',
            pattern: 'emotional_impact',
            matches: (text) => {
                const emotionalKeywords = ['amazing', 'danger', 'shocking', 'incredible', 'tragic', 'beautiful', 'fear', 'hope'];
                return emotionalKeywords.some(keyword => text.includes(keyword));
            },
            description: 'Detects emotional keywords implies emphasis'
        },

        // 3. Comparisons -> compare (Split Screen)
        {
            id: 'comparison',
            pattern: 'compare',
            matches: (text) => /\b(vs|versus|compared to|unlike|against)\b/i.test(text),
            description: 'Detects comparison logic implies split screen'
        },

        // 4. Sequences -> progressive_steps (Timeline)
        {
            id: 'sequence',
            pattern: 'progressive_steps',
            matches: (text) => {
                const sequenceKeywords = ['first', 'second', 'then', 'finally', 'next', 'step', 'timeline', 'history'];
                return sequenceKeywords.some(k => text.includes(k));
            },
            description: 'Detects sequence markers implies timeline'
        },

         // 5. Spatial -> spatial_explanation (Diagram)
         {
            id: 'spatial',
            pattern: 'spatial_explanation',
            matches: (text) => /\b(where|location|map|area|zone|region)\b/i.test(text),
            description: 'Detects spatial references implies map/diagram'
        },
        
        // 6. Generic Stats -> credibility_stat (Data)
        {
            id: 'generic_stat',
            pattern: 'credibility_stat',
            matches: (text) => text.includes('%') || text.includes('percent') || text.includes('rate'),
            description: 'Detects percentage/rates implies data visualization'
        },

        // Fallback: Keyword matching (Legacy)
        {
            id: 'keyword_quantify',
            pattern: 'quantify',
            matches: (text) => text.includes('number') || text.includes('stat') || text.includes('data'),
            description: 'Fallback keyword match for quantify'
        },
        {
            id: 'keyword_introduce',
            pattern: 'introduce',
            matches: (text) => text.includes('title') || text.includes('intro'),
            description: 'Fallback keyword match for introduce'
        }
    ];

    /**
     * normalizeIntent now runs through the rules engine.
     */
    static normalizeIntent(rawIntent: string): IntentResult {
        const normalized = rawIntent.toLowerCase().trim();

        // 0. Direct Match
        if (KNOWN_PATTERNS.includes(normalized as Pattern)) {
            return {
                pattern: normalized as Pattern,
                reason: 'Direct exact match with known pattern'
            };
        }

        // 1. Run Rules
        for (const rule of this.rules) {
            if (rule.matches(normalized)) {
                return {
                    pattern: rule.pattern,
                    reason: `Matched rule '${rule.id}': ${rule.description}`
                };
            }
        }

        return {
            pattern: 'unknown',
            reason: 'No matching pattern or heuristic found'
        };
    }

    /**
     * Debugging method to see which rule triggers.
     */
    static debugMatches(rawIntent: string): string[] {
         const normalized = rawIntent.toLowerCase().trim();
         return this.rules.filter(r => r.matches(normalized)).map(r => r.id);
    }
}
