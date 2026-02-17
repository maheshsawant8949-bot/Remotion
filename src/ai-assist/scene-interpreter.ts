
import OpenAI from 'openai';

export interface InterpretedScene {
  originalScript: string;
  visualMetaphors: string[];
  emotionalDepth: string; // e.g. "anxious", "triumphant"
  abstractionLevel: 'literal' | 'metaphorical' | 'abstract';
  potentialConcepts: string[];
}

export class SceneInterpreter {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  /**
   * Translate script meaning into deeper visual possibilities
   */
  static async interpret(script: string): Promise<InterpretedScene> {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key missing. Returning literal interpretation.');
      return {
        originalScript: script,
        visualMetaphors: [],
        emotionalDepth: 'neutral',
        abstractionLevel: 'literal',
        potentialConcepts: []
      };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a Visual Director. 
            Translate the script into visual metaphors.
            Example: "Economy under pressure" -> ["tightening vice", "collapsing stacks", "red strain gauge"].
            Avoid literalism.`
          },
          {
            role: "user",
            content: `Script: "${script}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7, // Higher temp for creativity
      });
      
      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        originalScript: script,
        visualMetaphors: result.visualMetaphors || [],
        emotionalDepth: result.emotionalDepth || 'neutral',
        abstractionLevel: result.abstractionLevel || 'metaphorical',
        potentialConcepts: result.potentialConcepts || []
      };
      
    } catch (error) {
      console.error('❌ Scene Interpretation failed:', error);
      return {
        originalScript: script,
        visualMetaphors: [],
        emotionalDepth: 'neutral',
        abstractionLevel: 'literal',
        potentialConcepts: []
      };
    }
  }
}
