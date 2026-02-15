
import { AssetResult } from '../multi-source-resolver';
import { StockFilters, StockProvider } from './stock-provider';

export class PexelsProvider implements StockProvider {
  name = 'Pexels';
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async search(query: string, filters?: StockFilters): Promise<AssetResult[]> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Pexels API key not found. Skipping.');
      return [];
    }

    try {
      // Pexels supports both photos and videos
      // We'll search both and combine, or prioritize based on filter?
      // For now, let's search videos as primary for Remotion, photos secondary
      
      const searchVideos = true; // Default to videos for video generation
      
      const url = searchVideos 
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.apiKey!,
        },
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assets: AssetResult[] = [];

      if (searchVideos && data.videos) {
        data.videos.forEach((video: any) => {
          // Find best quality file (hd/1080p)
          const bestFile = video.video_files.find(
            (f: any) => f.height >= 720 && f.height <= 1080
          ) || video.video_files[0];

          assets.push({
            url: bestFile.link,
            source: 'pexels',
            tier: 2,
            metadata: {
              type: 'footage',
              width: bestFile.width,
              height: bestFile.height,
              duration: video.duration,
              tags: [], // Pexels doesn't always return tags in list view
            },
          });
        });
      }

      return assets;
    } catch (error) {
      console.error('❌ Pexels search failed:', error);
      return [];
    }
  }
}
