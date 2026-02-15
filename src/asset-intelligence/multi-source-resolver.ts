/**
 * Multi-Source Resolver
 * 
 * Search sources in priority order:
 * - Tier 1: Premium Stock APIs (quality difference is massive)
 * - Tier 2: Curated free sources (only if style-safe)
 * - Tier 3: AI Generation (only when necessary, never default)
 */

import { AssetStrategy } from './asset-strategy';
import { 
  StockProvider, 
  PexelsProvider, 
  UnsplashProvider, 
  ShutterstockProvider,
  DalleProvider, // New import
  StockFilters 
} from './stock-providers';

/**
 * Asset Source
 */
export type AssetSource =
  | 'shutterstock'
  | 'getty'
  | 'adobe_stock'
  | 'storyblocks'
  | 'pexels'
  | 'unsplash'
  | 'pixabay'
  | 'ai_generated';

/**
 * Asset Result
 */
export interface AssetResult {
  url: string;
  source: AssetSource;
  tier: 1 | 2 | 3;
  metadata: {
    type: 'photo' | 'footage' | 'vector' | 'ai';
    width?: number;
    height?: number;
    duration?: number;  // For footage
    tags?: string[];
  };
}

/**
 * Multi-Source Resolver
 */
export class MultiSourceResolver {
  private static providers: {
    tier1: StockProvider[];
    tier2: StockProvider[];
    tier3: StockProvider[]; // New tier
  } = {
    tier1: [new ShutterstockProvider()],
    tier2: [new PexelsProvider(), new UnsplashProvider()],
    tier3: [new DalleProvider()] // New instantiation
  };

  /**
   * Search sources in priority order
   */
  static async search(
    query: string,
    strategy: AssetStrategy,
    options?: {
      maxResults?: number;
      minQuality?: 'hd' | 'uhd' | '4k';
    }
  ): Promise<AssetResult[]> {
    const results: AssetResult[] = [];
    const maxResults = options?.maxResults || 10;
    
    const filters: StockFilters = {
      orientation: 'landscape', // Default for video
      minWidth: options?.minQuality === '4k' ? 3840 : 1920,
    };
    
    // Tier 1 — Premium Stock APIs (if budget allows)
    const tier1Results = await this.searchTier1(query, strategy, filters);
    results.push(...tier1Results);
    
    // Tier 2 — Curated free sources (only if style-safe)
    if (results.length < maxResults) {
      const tier2Results = await this.searchTier2(query, strategy, filters);
      results.push(...tier2Results);
    }
    
    // Tier 3 — AI Generation (only when necessary)
    if (results.length === 0 && strategy.path === 'ai_generated') {
      const tier3Results = await this.searchTier3(query, strategy, options);
      results.push(...tier3Results);
    }
    
    return results.slice(0, maxResults);
  }
  
  /**
   * Search Tier 1: Premium Stock APIs
   */
  private static async searchTier1(
    query: string,
    strategy: AssetStrategy,
    filters: StockFilters
  ): Promise<AssetResult[]> {
    const results: AssetResult[] = [];
    
    for (const provider of this.providers.tier1) {
      if (provider.isConfigured()) {
        try {
          const assets = await provider.search(query, filters);
          results.push(...assets);
        } catch (err) {
          console.warn(`Provider ${provider.name} failed:`, err);
        }
      }
    }
    
    return results;
  }
  
  /**
   * Search Tier 2: Curated free sources
   */
  private static async searchTier2(
    query: string,
    strategy: AssetStrategy,
    filters: StockFilters
  ): Promise<AssetResult[]> {
    const results: AssetResult[] = [];
    
    for (const provider of this.providers.tier2) {
      if (provider.isConfigured()) {
        try {
          const assets = await provider.search(query, filters);
          results.push(...assets);
        } catch (err) {
          console.warn(`Provider ${provider.name} failed:`, err);
        }
      }
    }
    
    return results;
  }
  
  /**
   * Search Tier 3: AI Generation
   */
  private static async searchTier3(
    query: string,
    strategy: AssetStrategy,
    options?: any
  ): Promise<AssetResult[]> {
    // TODO: Integrate with AI generation
    // - Stable Diffusion
    // - DALL-E 3
    // - Midjourney API (when available)
    
    console.log('[Tier 3] Generating AI asset:', query);
    
    // Placeholder: Return empty for now
    return [];
  }
  
  /**
   * Build optimized search query
   */
  static buildQuery(intent: any, strategy: AssetStrategy): string {
    // Build semantic query, not just keywords
    const parts: string[] = [intent.primaryConcept];
    
    // Add visual category context
    if (intent.visualCategory === 'historical' && intent.era) {
      parts.push(intent.era);
    }
    
    // Add location context
    if (intent.location) {
      parts.push(intent.location);
    }
    
    // Add emotional tone for footage
    if (strategy.path === 'stock_footage' && intent.emotionalTone) {
      parts.push(intent.emotionalTone);
    }
    
    // Add quality modifiers
    if (strategy.path === 'stock_footage') {
      parts.push('cinematic', 'professional');
    }
    
    return parts.join(' ');
  }
}

