
import { AssetResult } from '../multi-source-resolver';
import { StockFilters, StockProvider } from './stock-provider';

export class UnsplashProvider implements StockProvider {
  name = 'Unsplash';
  private accessKey: string | undefined;

  constructor() {
    this.accessKey = process.env.UNSPLASH_ACCESS_KEY;
  }

  isConfigured(): boolean {
    return !!this.accessKey;
  }

  async search(query: string, filters?: StockFilters): Promise<AssetResult[]> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Unsplash Access Key not found. Skipping.');
      return [];
    }

    try {
      // Unsplash is photos only
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=${filters?.orientation || 'landscape'}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${this.accessKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assets: AssetResult[] = [];

      if (data.results) {
        data.results.forEach((photo: any) => {
          assets.push({
            url: photo.urls.regular, // or full, raw
            source: 'unsplash',
            tier: 2,
            metadata: {
              type: 'photo',
              width: photo.width,
              height: photo.height,
              tags: photo.tags?.map((t: any) => t.title) || [],
            },
          });
        });
      }

      return assets;
    } catch (error) {
      console.error('❌ Unsplash search failed:', error);
      return [];
    }
  }
}
