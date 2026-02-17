
import OpenAI from 'openai';
import { AssetResult } from '../asset-intelligence/multi-source-resolver';

export interface VisionScore {
  semanticMatch: number;
  focusClarity: number;
  visualNoise: number;
  overallQuality: number;
  reasoning: string;
}

export class AssetRankerAI {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  /**
   * Deep Analysis using Vision Language Model (VLM)
   * Expensive! Use sparingly.
   */
  static async analyze(
    asset: AssetResult,
    context: string
  ): Promise<VisionScore> {
    if (!process.env.OPENAI_API_KEY || !asset.url) {
      return {
        semanticMatch: 0.5,
        focusClarity: 0.5,
        visualNoise: 0.5,
        overallQuality: 0.5,
        reasoning: 'Vision API unavailable or asset has no URL.'
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // Vision capable
        messages: [
          {
            role: "system",
            content: `You are an expert Art Director. Analyze the image for a high-end video production.
            Context: "${context}"
            
            Return JSON:
            {
              "semanticMatch": 0.0-1.0,
              "focusClarity": 0.0-1.0,
              "visualNoise": 0.0-1.0 (0=clean, 1=busy),
              "overallQuality": 0.0-1.0,
              "reasoning": "string"
            }`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image:" },
              {
                type: "image_url",
                image_url: {
                  "url": asset.url,
                  "detail": "low" // Save tokens, sufficient for composition check
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        semanticMatch: result.semanticMatch || 0.5,
        focusClarity: result.focusClarity || 0.5,
        visualNoise: result.visualNoise || 0.5,
        overallQuality: result.overallQuality || 0.5,
        reasoning: result.reasoning || 'No reasoning provided.'
      };

    } catch (error) {
      console.error('❌ AI Asset Ranking failed:', error);
      return {
        semanticMatch: 0.5,
        focusClarity: 0.5,
        visualNoise: 0.5,
        overallQuality: 0.5,
        reasoning: 'Analysis failed.'
      };
    }
  }
}
