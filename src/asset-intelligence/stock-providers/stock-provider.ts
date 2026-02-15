
import { AssetResult } from '../multi-source-resolver';

export interface StockFilters {
  orientation?: 'landscape' | 'portrait' | 'square';
  minWidth?: number;
  minHeight?: number;
  duration?: {
    min?: number;
    max?: number;
  };
  excludeEditorial?: boolean;
}

export interface StockProvider {
  name: string;
  
  /**
   * Search for assets
   */
  search(query: string, filters?: StockFilters): Promise<AssetResult[]>;
  
  /**
   * Check if provider is configured (has API keys)
   */
  isConfigured(): boolean;
}
