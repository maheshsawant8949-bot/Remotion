import { EMOTIONAL_WEIGHT_RULES } from './weight-rules';

export interface EmotionalSignals {
  // Deprecated in favor of generic triggers, but kept for compatibility if needed internally
  matches: string[];
}

export type EmotionalWeight = {
  score: number; // 0-10
  level: "low" | "medium" | "high";
  triggers: string[]; // describe why the score is what it is
}

export class EmotionalAnalyzer {
  
  analyze(script: string): EmotionalWeight {
    // const tokens = script.toLowerCase().match(/\b\w+\b/g) || []; (Removed as we use phrase matching now)
    const punctuation = script.match(/[?!]/g) || [];
    
    // Flattened triggers collection
    const triggers: string[] = [];
    let score = 0;

    // 1. Check Heuristic Rules
    const normalizedScript = script.toLowerCase();
    const triggeredCategories = new Set<string>();
    
    for (const rule of EMOTIONAL_WEIGHT_RULES) {
        for (const wordOrPhrase of rule.words) {
            // Check if the phrase exists in the script as a whole word/phrase
            // We use a regex with word boundaries to avoid partial matches (e.g. "hero" in "heroic")
            // Escape special regex characters if needed (simple approximation here)
            const escaped = wordOrPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'g');
            
            const matches = normalizedScript.match(regex);
            if (matches) {
                // Add weight for EACH occurrence
                for (const match of matches) {
                    triggers.push(`${rule.category}(${match})`);
                    score += rule.weight;
                    triggeredCategories.add(rule.category);
                }
            }
        }
    }

    // 2. Punctuation Boost (+1 per ! or ?)
    for (const p of punctuation) {
        triggers.push(`Punctuation(${p})`);
        score += 1;
    }

    // 3. Signal Synergy (Amplifier)
    // If multiple FAMILIES are present, apply a multiplier
    // Rule: +10% per additional family beyond the first.
    // Cap: Max 1.5x multiplier.
    const uniqueFamilies = triggeredCategories.size;
    if (uniqueFamilies > 1) {
        const bonus = (uniqueFamilies - 1) * 0.1;
        const multiplier = Math.min(1.0 + bonus, 1.5); // Cap at 1.5x
        
        triggers.push(`Synergy(x${multiplier.toFixed(1)})`);
        score *= multiplier;
    }

    // HARD RULE: Clamp score to 0-10. Never exceed 10.
    const finalScore = Math.min(Math.max(score, 0), 10);
    
    // Determine Level based on bounded score
    // 0-3 → low
    // 4-6 → medium
    // 7-10 → high
    let level: EmotionalWeight['level'] = 'low';
    if (finalScore >= 7) {
        level = 'high';
    } else if (finalScore >= 4) {
        level = 'medium';
    } else {
        level = 'low';
    }

    if (finalScore === 0) {
        triggers.push("Neutral:NoSignals");
    }

    return {
        score: finalScore,
        level,
        triggers
    };
  }
}
