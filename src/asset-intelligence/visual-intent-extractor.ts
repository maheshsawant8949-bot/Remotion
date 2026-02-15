import OpenAI from 'openai';

/**
 * Visual Intent Extractor
 * 
 * CRITICAL: Stop thinking in keywords. Extract visual intent.
 * Uses LLM to understand semantic meaning, falls back to heuristics.
 */

// ... (keep VisualCategory and VisualIntent interfaces same as before) ...
export type VisualCategory =
  | 'real_world'    // Physical places, people, objects
  | 'abstract'      // Conceptual, non-literal
  | 'data'          // Charts, graphs, statistics
  | 'historical'    // Past events, eras
  | 'conceptual'    // Ideas, theories
  | 'process'       // Workflows, systems
  | 'ui/tech';      // Interfaces, technology

export interface VisualIntent {
  primaryConcept: string;
  secondaryConcepts: string[];
  visualCategory: VisualCategory;
  abstractionLevel: 'concrete' | 'semi-abstract' | 'abstract';
  emotionalTone?: 'calm' | 'energetic' | 'serious' | 'inspiring';
  era?: string;
  location?: string;
}

export class VisualIntentExtractor {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // For local dev integration
  });

  /**
   * Extract visual intent from scene content
   */
  static async extract(sceneContent: string, context?: {
    emotionalWeight?: number;
    emphasis?: string;
  }): Promise<VisualIntent> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️  OPENAI_API_KEY not found. Using heuristic fallback.');
        return this.extractFallback(sceneContent, context);
      }

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Fast & cheap
        messages: [
          {
            role: "system",
            content: `You are a Visual Director for high-end video production. 
            Analyze the scene script and extract the visual intent.
            Return JSON matching this schema:
            {
              "primaryConcept": "string (main visual subject)",
              "secondaryConcepts": ["string (related visual themes)"],
              "visualCategory": "real_world" | "abstract" | "data" | "historical" | "conceptual" | "process" | "ui/tech",
              "abstractionLevel": "concrete" | "semi-abstract" | "abstract",
              "emotionalTone": "calm" | "energetic" | "serious" | "inspiring",
              "era": "string (optional)",
              "location": "string (optional)"
            }`
          },
          {
            role: "user",
            content: `Script: "${sceneContent}"\nContext: Emphasis on "${context?.emphasis || 'none'}", Emotional Weight: ${context?.emotionalWeight || 5}/10`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Validate and return
      return {
        primaryConcept: result.primaryConcept || this.extractPrimaryConcept(sceneContent),
        secondaryConcepts: result.secondaryConcepts || [],
        visualCategory: result.visualCategory || 'real_world',
        abstractionLevel: result.abstractionLevel || 'concrete',
        emotionalTone: result.emotionalTone,
        era: result.era,
        location: result.location
      };

    } catch (error) {
      console.warn('❌ LLM Extraction failed:', error);
      return this.extractFallback(sceneContent, context);
    }
  }

  /**
   * Fallback heuristic extraction (Legacy logic)
   */
  private static extractFallback(sceneContent: string, context?: {
    emotionalWeight?: number;
    emphasis?: string;
  }): VisualIntent {
    const intent: VisualIntent = {
      primaryConcept: this.extractPrimaryConcept(sceneContent),
      secondaryConcepts: this.extractSecondaryConcepts(sceneContent),
      visualCategory: this.classifyCategory(sceneContent),
      abstractionLevel: this.determineAbstractionLevel(sceneContent),
    };
    
    if (context?.emotionalWeight) {
      intent.emotionalTone = this.mapEmotionalTone(context.emotionalWeight);
    }
    
    intent.era = this.extractEra(sceneContent);
    intent.location = this.extractLocation(sceneContent);
    
    return intent;
  }
  
  // ... (Keep existing heuristic helper methods below as private static) ...

  private static extractPrimaryConcept(content: string): string {
    return content.split(' ').slice(0, 3).join(' '); // Simple fallback
  }
  
  private static extractSecondaryConcepts(content: string): string[] {
    return [];
  }
  
  private static classifyCategory(content: string): VisualCategory {
    const lower = content.toLowerCase();
    if (lower.match(/\b(revolution|century|era|ancient|medieval|war|empire)\b/)) return 'historical';
    if (lower.match(/\b(data|statistics|chart|graph|percentage|metric)\b/)) return 'data';
    if (lower.match(/\b(process|workflow|system|pipeline|flow|step)\b/)) return 'process';
    if (lower.match(/\b(software|app|interface|ui|technology|digital)\b/)) return 'ui/tech';
    if (lower.match(/\b(concept|idea|theory|philosophy|abstract)\b/)) return 'abstract';
    if (lower.match(/\b(innovation|transformation|evolution|change)\b/)) return 'conceptual';
    return 'real_world';
  }
  
  private static determineAbstractionLevel(content: string): 'concrete' | 'semi-abstract' | 'abstract' {
    const category = this.classifyCategory(content);
    if (category === 'abstract' || category === 'conceptual') return 'abstract';
    if (category === 'data' || category === 'process') return 'semi-abstract';
    return 'concrete';
  }
  
  private static mapEmotionalTone(weight: number): 'calm' | 'energetic' | 'serious' | 'inspiring' {
    if (weight < 4) return 'calm';
    if (weight < 7) return 'serious';
    return 'inspiring';
  }
  
  private static extractEra(content: string): string | undefined {
    const lower = content.toLowerCase();
    if (lower.match(/\b(future|tomorrow|next|upcoming)\b/)) return 'future';
    if (lower.match(/\b(1800s|industrial revolution|victorian)\b/)) return '1800s';
    if (lower.match(/\b(1900s|20th century)\b/)) return '1900s';
    if (lower.match(/\b(ancient|medieval|renaissance)\b/)) return 'historical';
    if (lower.match(/\b(modern|today|current|contemporary)\b/)) return 'modern';
    return undefined;
  }
  
  private static extractLocation(content: string): string | undefined {
    const lower = content.toLowerCase();
    if (lower.match(/\b(city|urban|downtown|metropolitan)\b/)) return 'urban';
    if (lower.match(/\b(nature|forest|mountain|ocean|wilderness)\b/)) return 'nature';
    if (lower.match(/\b(space|cosmic|universe|galaxy|planet)\b/)) return 'space';
    if (lower.match(/\b(office|workplace|corporate)\b/)) return 'workplace';
    return undefined;
  }
}

