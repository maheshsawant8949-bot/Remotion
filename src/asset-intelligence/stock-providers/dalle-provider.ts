
import OpenAI from 'openai';
import { AssetResult } from '../multi-source-resolver';
import { StockFilters, StockProvider } from './stock-provider';

export class DalleProvider implements StockProvider {
  name = 'DALL-E 3';
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true 
      });
    }
  }

  isConfigured(): boolean {
    return !!this.openai;
  }

  async search(query: string, filters?: StockFilters): Promise<AssetResult[]> {
    if (!this.openai) {
      console.warn('⚠️ OpenAI API key not found. Skipping DALL-E generation.');
      return [];
    }

    try {
      console.log(`🎨 Generating AI image for: "${query}"`);
      
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: `High quality, photorealistic, cinematic shot of ${query}. Professional lighting, 4k resolution.`,
        n: 1,
        size: "1024x1024",
        quality: "standard", // "hd" costs more
        style: "natural" // or "vivid"
      });

      const url = response.data?.[0]?.url;
      
      if (!url) return [];

      return [{
        url: url,
        source: 'ai_generated',
        tier: 3,
        metadata: {
          type: 'ai', // Treated as photo
          width: 1024,
          height: 1024,
          tags: ['ai', 'generated', 'dall-e'],
        }
      }];

    } catch (error) {
      console.error('❌ DALL-E generation failed:', error);
      return [];
    }
  }
}
