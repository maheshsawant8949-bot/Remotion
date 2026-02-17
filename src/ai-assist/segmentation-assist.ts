
import OpenAI from 'openai';

interface PhraseSuggestion {
  text: string;
  estimatedDuration: number;
}

export class SegmentationAssist {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  /**
   * Suggest better segmentation for complex scripts
   */
  static async suggestSegmentation(
    script: string,
    targetPace: 'slow' | 'medium' | 'fast' = 'medium'
  ): Promise<PhraseSuggestion[]> {
    if (!process.env.OPENAI_API_KEY) {
      return []; // Fallback to heuristic splitter
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Segment the text into natural spoken phrases for a video.
            Constraints:
            - Max duration per phrase: 4-5 seconds (~10-12 words).
            - Min duration: 1.5 seconds (~3-4 words).
            - Break at logical semantic pauses.
            - Pace: ${targetPace}.
            
            Return JSON: { "phrases": [ { "text": "string", "estimatedDuration": number } ] }`
          },
          {
            role: "user",
            content: `Script: "${script}"`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return this.validate(result.phrases || []);

    } catch (error) {
      console.error('❌ Segmentation Assist failed:', error);
      return [];
    }
  }

  /**
   * Enforce constraints
   */
  private static validate(phrases: PhraseSuggestion[]): PhraseSuggestion[] {
    return phrases.map(p => {
      // Hard cap duration for safety
      if (p.estimatedDuration > 7) p.estimatedDuration = 7;
      if (p.estimatedDuration < 1) p.estimatedDuration = 1.5;
      return p;
    });
  }
}
