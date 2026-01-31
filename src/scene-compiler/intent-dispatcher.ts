import { SceneIntent, IntentType } from './grammar-rules';

// Intent Dispatcher
// Purpose: Receive high-level user intent (e.g., "Show me the growth of X") 
// and map it to specific Scene Primitives.

export type UserRequest = {
  description: string;
  emotionalGoal?: 'inform' | 'inspire' | 'clarify';
};

const DENSITY_THRESHOLD = 8; // Tuned for "One Primary Thought" per scene

// Quality Scoring Dimensions
type QualityReport = {
  score: number;
  breakdown: {
    visualDensity: number;
    conceptCount: number;
    readabilityRisk: number;
    templateFitPenalty: number;
  };
};

const assessQuality = (text: string, roughIntent: string): QualityReport => {
  const breakdown = {
    visualDensity: 0,
    conceptCount: 0,
    readabilityRisk: 0,
    templateFitPenalty: 0
  };

  // 1. Visual Density (Numbers, comparison markers - things that need visualization)
  const numbers = text.match(/\d+|percent/g);
  if (numbers) breakdown.visualDensity += numbers.length * 2;
  if (text.match(/vs|versus|compare|difference|than/i)) breakdown.visualDensity += 3;

  // 2. Concept Count (Conjunctions, Period-separated thoughts)
  const conjunctions = text.match(/ and | also | plus | but /ig);
  if (conjunctions) breakdown.conceptCount += conjunctions.length;
  
  const sentences = text.match(/[.!?]/g);
  if (sentences && sentences.length > 1) {
    breakdown.conceptCount += (sentences.length - 1) * 2;
  }

  // 3. Readability Risk (Length, complex words)
  if (text.length > 120) breakdown.readabilityRisk += 2;
  if (text.length > 180) breakdown.readabilityRisk += 4; // Penalty for very long chunks
  
  const complexWords = text.match(/\b\w{12,}\b/g); // Words > 12 chars
  if (complexWords) breakdown.readabilityRisk += complexWords.length;

  // 4. Template Fit (Heuristic Penalty)
  // Logic: Quantify intent with huge text is bad fit. Explain intent with no text is bad fit.
  if (roughIntent === 'quantify' && text.length > 80) breakdown.templateFitPenalty += 3; // Data scenes should be concise
  if (roughIntent === 'emotional' && numbers && numbers.length > 1) breakdown.templateFitPenalty += 3; // Emotional scenes shouldn't be math-heavy

  // Total Score
  const score = 
    breakdown.visualDensity + 
    breakdown.conceptCount + 
    breakdown.readabilityRisk + 
    breakdown.templateFitPenalty;

  return { score, breakdown };
};


export type ScriptClassification = {
  text: string;
  intent: 'quantify' | 'chronology' | 'explain' | 'emotional' | 'context';
};

const classifySegment = (text: string): ScriptClassification => {
    // 1. Quantify: Numbers, stats
    if (text.match(/\d+|percent|increase|decrease/i)) {
        return { text, intent: 'quantify' };
    }
    // 2. Chronology: Time, sequence
    if (text.match(/before|after|then|timeline|process|history/i)) {
        return { text, intent: 'chronology' };
    }
    // 3. Explain: Structure, location, how
    if (text.match(/structure|how|where|diagram|architecture/i)) {
        return { text, intent: 'explain' };
    }
    // 4. Emotional: Hook keywords
    if (text.match(/imagine|believe|amazing|stunning/i)) {
        return { text, intent: 'emotional' };
    }

    // Default: Context
    return { text, intent: 'context' };
};

const mapClassificationToIntentType = (cls: ScriptClassification['intent']): IntentType => {
    switch (cls) {
        case 'quantify': return 'quantitative_proof';
        case 'chronology': return 'chronological_sequence';
        case 'explain': return 'spatial_explanation';
        case 'emotional': return 'emotional_anchor';
        case 'context': default: return 'context_setting';
    }
};

export const dispatchIntent = (request: UserRequest): SceneIntent[] => {
  const density = calculateDensity(request.description);
  
  // HEURISTIC: AUTO-SPLIT on DENSITY
  // Logic: If a chunk is too dense, we MUST peel off the context into its own scene.
  // "Never overload a single scene."
  if (density > DENSITY_THRESHOLD) {
     // ... (Existing split logic, adapted to use classification if needed, but keeping simple for now as per previous task)
      return [
        {
            type: 'context_setting',
            role: 'context',
            intensity: 'low',
            pacing: 'normal'
        },
        {
            type: mapClassificationToIntentType(classifySegment(request.description).intent),
            role: 'explain',
            intensity: 'high',
            pacing: 'slow'
        }
    ];
  }

  // Simple Case: Classify -> Map
  const classification = classifySegment(request.description);
  
  return [{
      type: mapClassificationToIntentType(classification.intent),
      role: 'explain',
      intensity: 'medium',
      pacing: 'normal'
  }];
};
