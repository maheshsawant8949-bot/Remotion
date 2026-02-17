
import OpenAI from 'openai';

interface ThumbnailConcept {
  concept: string;
  textHook: string;
  visualComposition: string;
  colorStrategy: string;
  confidence: number;
}

export class ThumbnailGenerator {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  /**
   * Generate thumbnail ideas
   */
  static async generate(
    script: string,
    topic: string
  ): Promise<ThumbnailConcept[]> {
    if (!process.env.OPENAI_API_KEY) {
      return [];
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a YouTube Growth Expert. Suggest 3 high-CTR thumbnails.
            Focus on:
            - Curiosity gaps
            - High contrast
            - Minimal text
            - Emotional faces or strong graphical metaphors
            
            Return JSON: { "concepts": [ { "concept": "string", "textHook": "string", "visualComposition": "string", "colorStrategy": "string", "confidence": number } ] }`
          },
          {
            role: "user",
            content: `Topic: "${topic}"\nScript Snippet: "${script.slice(0, 500)}..."`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result.concepts || [];

    } catch (error) {
      console.error('❌ Thumbnail Gen failed:', error);
      return [];
    }
  }
}
