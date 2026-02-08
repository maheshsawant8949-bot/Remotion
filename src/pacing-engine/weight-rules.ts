export interface WeightRule {
    category: string;
    words: string[];
    weight: number;
}

export const EMOTIONAL_WEIGHT_RULES: WeightRule[] = [
    {
        category: 'Scale',
        words: ['million', 'billion', 'thousands', 'every second', 'per day', 'global'],
        weight: 1.5
    },
    {
        category: 'Contrast',
        words: ['but', 'however', 'instead', 'yet', 'despite', 'although'],
        weight: 1.2
    },
    {
        category: 'Scarcity / Shock',
        words: ['only', 'just', 'less than', 'merely', 'rare', 'unique'],
        weight: 2.0  // Increased from 1.5 (33% boost) - scarcity signals are powerful
    },
    {
        category: 'Human Impact',
        words: ['people', 'lives', 'children', 'families', 'death', 'killed', 'saved', 'human'],
        weight: 2.2
    },
    {
        category: 'Irreversibility',
        words: ['never', 'cannot be undone', 'permanent', 'forever', 'extinct', 'irreversible'],
        weight: 2.5
    },
    {
        category: 'Urgency',
        words: ['now', 'immediately', 'crisis', 'emergency', 'urgent', 'tipping point'],
        weight: 2.0
    },
    {
        category: 'Awe',
        words: ['universe', 'billion years', 'billions of years', 'earliest', 'vast', 'more than all', 'countless', 'infinite', 'cosmos'],
        weight: 1.8
    },
    {
        category: 'Consequence',
        words: ['crisis', 'survival', 'fear', 'damage'],
        weight: 2.0
    },
    {
        category: 'Planetary',
        words: ['atmosphere', 'planet', 'global'],
        weight: 1.5
    }
];
