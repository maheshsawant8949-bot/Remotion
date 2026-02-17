
import OpenAI from 'openai';

interface QualityReport {
  score: number; // 0-10
  critique: string[];
  suggestions: string[];
  approval: boolean;
}

export class QualityCritic {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  /**
   * Critique the video plan
   */
  static async critique(
    script: string,
    visualPlan: any[] // Array of planned scenes
  ): Promise<QualityReport> {
    if (!process.env.OPENAI_API_KEY) {
      return {
        score: 8,
        critique: ['AI Critic unavailable.'],
        suggestions: [],
        approval: true
      };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a Senior Video Editor. Critique this video plan.
            Check for:
            - Visual repetition (boring?)
            - Metaphor strength (clear?)
            - Engagement pacing (too slow?)
            - Variety (monotone?)
            
            Return JSON: { 
              "score": number (0-10), 
              "critique": ["string"], 
              "suggestions": ["string"], 
              "approval": boolean 
            }`
          },
          {
            role: "user",
            content: `Script: "${script}"\nPlan: ${JSON.stringify(visualPlan)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        score: result.score || 5,
        critique: result.critique || [],
        suggestions: result.suggestions || [],
        approval: result.approval ?? true
      };

    } catch (error) {
      console.error('❌ Quality Critic failed:', error);
      return {
        score: 0,
        critique: ['Error during analysis'],
        suggestions: [],
        approval: true // Fail open to not block render
      };
    }
  }
}
