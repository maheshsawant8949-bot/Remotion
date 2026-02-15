/**
 * Visual Intent Extractor
 * 
 * CRITICAL: Stop thinking in keywords. Extract visual intent.
 * 
 * Example:
 * Script: "The Industrial Revolution reshaped society."
 * 
 * Intent:
 *   primaryConcept: "industrial transformation"
 *   visualCategory: "historical"
 *   era: "1800s"
 *   abstractionLevel: "concrete"
 * 
 * NOT: "factory" keyword
 * 
 * Huge difference.
 */

/**
 * Visual Category
 * 
 * Force classification into ONE.
 * Each category maps to different asset strategies.
 */
export type VisualCategory =
  | 'real_world'    // Physical places, people, objects
  | 'abstract'      // Conceptual, non-literal
  | 'data'          // Charts, graphs, statistics
  | 'historical'    // Past events, eras
  | 'conceptual'    // Ideas, theories
  | 'process'       // Workflows, systems
  | 'ui/tech';      // Interfaces, technology

/**
 * Visual Intent
 */
export interface VisualIntent {
  primaryConcept: string;
  secondaryConcepts: string[];
  visualCategory: VisualCategory;
  abstractionLevel: 'concrete' | 'semi-abstract' | 'abstract';
  emotionalTone?: 'calm' | 'energetic' | 'serious' | 'inspiring';
  era?: string;  // e.g., '1800s', 'modern', 'future'
  location?: string;  // e.g., 'urban', 'nature', 'space'
}

/**
 * Visual Intent Extractor
 */
export class VisualIntentExtractor {
  /**
   * Extract visual intent from scene content
   */
  static extract(sceneContent: string, context?: {
    emotionalWeight?: number;
    emphasis?: string;
  }): VisualIntent {
    // TODO: Implement intent extraction logic
    // This should use NLP/LLM to understand the semantic meaning
    // rather than just keyword matching
    
    const intent: VisualIntent = {
      primaryConcept: this.extractPrimaryConcept(sceneContent),
      secondaryConcepts: this.extractSecondaryConcepts(sceneContent),
      visualCategory: this.classifyCategory(sceneContent),
      abstractionLevel: this.determineAbstractionLevel(sceneContent),
    };
    
    // Add optional fields
    if (context?.emotionalWeight) {
      intent.emotionalTone = this.mapEmotionalTone(context.emotionalWeight);
    }
    
    intent.era = this.extractEra(sceneContent);
    intent.location = this.extractLocation(sceneContent);
    
    return intent;
  }
  
  /**
   * Extract primary concept (not just keywords)
   */
  private static extractPrimaryConcept(content: string): string {
    // TODO: Implement semantic extraction
    // For now, return simplified version
    return content.split(' ').slice(0, 3).join(' ');
  }
  
  /**
   * Extract secondary concepts
   */
  private static extractSecondaryConcepts(content: string): string[] {
    // TODO: Implement semantic extraction
    return [];
  }
  
  /**
   * Classify into visual category
   */
  private static classifyCategory(content: string): VisualCategory {
    const lower = content.toLowerCase();
    
    // Historical indicators
    if (lower.match(/\b(revolution|century|era|ancient|medieval|war|empire)\b/)) {
      return 'historical';
    }
    
    // Data indicators
    if (lower.match(/\b(data|statistics|chart|graph|percentage|metric)\b/)) {
      return 'data';
    }
    
    // Process indicators
    if (lower.match(/\b(process|workflow|system|pipeline|flow|step)\b/)) {
      return 'process';
    }
    
    // Tech indicators
    if (lower.match(/\b(software|app|interface|ui|technology|digital)\b/)) {
      return 'ui/tech';
    }
    
    // Abstract indicators
    if (lower.match(/\b(concept|idea|theory|philosophy|abstract)\b/)) {
      return 'abstract';
    }
    
    // Conceptual indicators
    if (lower.match(/\b(innovation|transformation|evolution|change)\b/)) {
      return 'conceptual';
    }
    
    // Default: real_world
    return 'real_world';
  }
  
  /**
   * Determine abstraction level
   */
  private static determineAbstractionLevel(content: string): 'concrete' | 'semi-abstract' | 'abstract' {
    const category = this.classifyCategory(content);
    
    if (category === 'abstract' || category === 'conceptual') {
      return 'abstract';
    }
    
    if (category === 'data' || category === 'process') {
      return 'semi-abstract';
    }
    
    return 'concrete';
  }
  
  /**
   * Map emotional weight to tone
   */
  private static mapEmotionalTone(weight: number): 'calm' | 'energetic' | 'serious' | 'inspiring' {
    if (weight < 4) return 'calm';
    if (weight < 7) return 'serious';
    return 'inspiring';
  }
  
  /**
   * Extract era from content
   */
  private static extractEra(content: string): string | undefined {
    const lower = content.toLowerCase();
    
    if (lower.match(/\b(future|tomorrow|next|upcoming)\b/)) return 'future';
    if (lower.match(/\b(1800s|industrial revolution|victorian)\b/)) return '1800s';
    if (lower.match(/\b(1900s|20th century)\b/)) return '1900s';
    if (lower.match(/\b(ancient|medieval|renaissance)\b/)) return 'historical';
    if (lower.match(/\b(modern|today|current|contemporary)\b/)) return 'modern';
    
    return undefined;
  }
  
  /**
   * Extract location from content
   */
  private static extractLocation(content: string): string | undefined {
    const lower = content.toLowerCase();
    
    if (lower.match(/\b(city|urban|downtown|metropolitan)\b/)) return 'urban';
    if (lower.match(/\b(nature|forest|mountain|ocean|wilderness)\b/)) return 'nature';
    if (lower.match(/\b(space|cosmic|universe|galaxy|planet)\b/)) return 'space';
    if (lower.match(/\b(office|workplace|corporate)\b/)) return 'workplace';
    
    return undefined;
  }
}
