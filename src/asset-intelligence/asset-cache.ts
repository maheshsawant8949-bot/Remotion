/**
 * Asset Cache
 * 
 * VERY HIGH ROI: Store previously validated assets.
 * 
 * Benefits:
 * - Consistency across videos
 * - Faster generation
 * - Lower API costs
 * - Recognizable visual identity
 * 
 * Over time this becomes your secret weapon.
 */

import { AssetResult } from './multi-source-resolver';
import { VisualIntent } from './visual-intent-extractor';

/**
 * Cached Asset
 */
export interface CachedAsset {
  intent: VisualIntent;
  asset: AssetResult;
  score: number;
  timestamp: number;
  usageCount: number;
}

/**
 * Asset Cache
 */
export class AssetCache {
  private static cache: Map<string, CachedAsset> = new Map();
  private static maxAge = 30 * 24 * 60 * 60 * 1000;  // 30 days
  
  /**
   * Get cached asset
   */
  static get(intent: VisualIntent): CachedAsset | undefined {
    const key = this.generateKey(intent);
    const cached = this.cache.get(key);
    
    if (!cached) return undefined;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Increment usage count
    cached.usageCount++;
    
    return cached;
  }
  
  /**
   * Set cached asset
   */
  static set(intent: VisualIntent, asset: AssetResult, score: number): void {
    const key = this.generateKey(intent);
    this.cache.set(key, {
      intent,
      asset,
      score,
      timestamp: Date.now(),
      usageCount: 1,
    });
  }
  
  /**
   * Generate cache key
   */
  private static generateKey(intent: VisualIntent): string {
    return [
      intent.visualCategory,
      intent.primaryConcept.toLowerCase().replace(/\s+/g, '-'),
      intent.era || 'any',
      intent.location || 'any',
    ].join(':');
  }
  
  /**
   * Clear expired entries
   */
  static clearExpired(): number {
    let cleared = 0;
    const now = Date.now();
    
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.maxAge) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    return cleared;
  }
  
  /**
   * Get cache statistics
   */
  static getStats(): {
    totalEntries: number;
    totalUsage: number;
    avgUsagePerAsset: number;
    mostUsed: CachedAsset | undefined;
  } {
    const entries = Array.from(this.cache.values());
    const totalUsage = entries.reduce((sum, e) => sum + e.usageCount, 0);
    const mostUsed = entries.sort((a, b) => b.usageCount - a.usageCount)[0];
    
    return {
      totalEntries: this.cache.size,
      totalUsage,
      avgUsagePerAsset: this.cache.size > 0 ? totalUsage / this.cache.size : 0,
      mostUsed,
    };
  }
  
  /**
   * Export cache for persistence
   */
  static export(): string {
    const data = Array.from(this.cache.entries());
    return JSON.stringify(data);
  }
  
  /**
   * Import cache from persistence
   */
  static import(data: string): void {
    try {
      const entries = JSON.parse(data);
      this.cache = new Map(entries);
    } catch (error) {
      console.error('Failed to import asset cache:', error);
    }
  }
}
