
import { AssetResult } from '../multi-source-resolver';
import { StockFilters, StockProvider } from './stock-provider';

export class ShutterstockProvider implements StockProvider {
  name = 'Shutterstock';
  private apiKey: string | undefined;
  private apiSecret: string | undefined;

  constructor() {
    this.apiKey = process.env.SHUTTERSTOCK_API_KEY;
    this.apiSecret = process.env.SHUTTERSTOCK_API_SECRET;
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.apiSecret;
  }

  async search(query: string, filters?: StockFilters): Promise<AssetResult[]> {
    if (!this.isConfigured()) {
      // Silent skip for paid API unless explicitly enabled
      return [];
    }

    try {
      console.log('TODO: Implement Shutterstock API call');
      // Requires Base64 auth (ConsumerKey:ConsumerSecret)
      // Endpoint: https://api.shutterstock.com/v2/videos/search
      return [];
    } catch (error) {
      console.error('❌ Shutterstock search failed:', error);
      return [];
    }
  }
}
