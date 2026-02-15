/**
 * Asset Ranking Engine
 * 
 * Pick the BEST — not the first.
 * 
 * Score assets based on:
 * - Semantic match
 * - Style match
 * - Composition clarity
 * - Cinematic potential
 * - Focus strength
 * - Distraction risk
 */

import OpenAI from 'openai';
import { AssetResult } from './multi-source-resolver';
import { VisualIntent } from './visual-intent-extractor';
import { StyleCriteria, StyleValidator } from './style-validator';

/**
 * Asset Score
 */
export interface AssetScore {
  asset: AssetResult;
  totalScore: number;  // 0-1
  breakdown: {
    semanticMatch: number;      // 0-1
    styleMatch: number;          // 0-1
    compositionClarity: number;  // 0-1
    cinematicPotential: number;  // 0-1
    focusStrength: number;       // 0-1
    distractionRisk: number;     // 0-1 (inverted, lower is better)
  };
}

/**
 * Asset Ranker
 */
export class AssetRanker {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  /**
   * Score and rank assets
   */
  static async rank(
    assets: AssetResult[],
    intent: VisualIntent,
    criteria: StyleCriteria
  ): Promise<AssetScore[]> {
    // Generate intent embedding once
    let intentEmbedding: number[] | null = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await this.openai.embeddings.create({
          model: "text-embedding-3-small",
          input: `${intent.primaryConcept} ${intent.visualCategory} ${intent.emotionalTone || ''}`
        });
        intentEmbedding = response.data[0].embedding;
      } catch (e) {
        console.warn('Failed to generate intent embedding:', e);
      }
    }

    const scored = await Promise.all(
      assets.map(asset => this.scoreAsset(asset, intent, criteria, intentEmbedding))
    );
    
    return scored.sort((a, b) => b.totalScore - a.totalScore);
  }
  
  /**
   * Score individual asset
   */
  private static async scoreAsset(
    asset: AssetResult,
    intent: VisualIntent,
    criteria: StyleCriteria,
    intentEmbedding: number[] | null
  ): Promise<AssetScore> {
    const semanticMatch = await this.scoreSemanticMatch(asset, intent, intentEmbedding);
    
    const breakdown = {
      semanticMatch,
      styleMatch: this.scoreStyleMatch(asset, criteria),
      compositionClarity: this.scoreCompositionClarity(asset),
      cinematicPotential: this.scoreCinematicPotential(asset),
      focusStrength: this.scoreFocusStrength(asset),
      distractionRisk: this.scoreDistractionRisk(asset),
    };
    
    // Weighted average (style match is most important)
    const weights = {
      semanticMatch: 0.30, // Increased weight
      styleMatch: 0.25,
      compositionClarity: 0.15,
      cinematicPotential: 0.15,
      focusStrength: 0.10,
      distractionRisk: 0.05,
    };
    
    const totalScore = Object.entries(breakdown).reduce((sum, [key, value]) => {
      return sum + value * weights[key as keyof typeof weights];
    }, 0);
    
    return { asset, totalScore, breakdown };
  }
  
  /**
   * Score semantic match
   */
  private static async scoreSemanticMatch(
    asset: AssetResult, 
    intent: VisualIntent,
    intentEmbedding: number[] | null
  ): Promise<number> {
    // 1. Embedding Match (High accuracy)
    if (intentEmbedding && process.env.OPENAI_API_KEY && asset.metadata.tags?.length) {
      try {
        const tagsString = asset.metadata.tags.join(' ');
        const response = await this.openai.embeddings.create({
          model: "text-embedding-3-small",
          input: tagsString
        });
        const assetEmbedding = response.data[0].embedding;
        return this.cosineSimilarity(intentEmbedding, assetEmbedding);
      } catch (e) {
        // Fallback to keyword match
      }
    }

    // 2. Keyword Match Fallback
    const tags = (asset.metadata.tags || []).map(t => t.toLowerCase());
    const concepts = [intent.primaryConcept, ...intent.secondaryConcepts].map(c => c.toLowerCase());
    
    let matches = 0;
    concepts.forEach(concept => {
      // Check partial matches
      if (tags.some(tag => tag.includes(concept) || concept.includes(tag))) {
        matches++;
      }
    });
    
    if (concepts.length === 0) return 0.5;
    return Math.min(matches / concepts.length, 1.0); // Normalize 0-1
  }

  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
  
  /**
   * Score style match
   */
  private static scoreStyleMatch(asset: AssetResult, criteria: StyleCriteria): number {
    const validation = StyleValidator.validate(asset, criteria);
    return validation.score;
  }
  
  /**
   * Score composition clarity
   */
  private static scoreCompositionClarity(asset: AssetResult): number {
    const tags = (asset.metadata.tags || []).join(' ').toLowerCase();
    
    if (tags.includes('minimal') || tags.includes('clean') || tags.includes('isolated')) {
      return 0.9;
    }
    if (tags.includes('busy') || tags.includes('crowd') || tags.includes('cluttered')) {
      return 0.4;
    }
    
    return 0.7; // Neutral
  }
  
  /**
   * Score cinematic potential
   */
  private static scoreCinematicPotential(asset: AssetResult): number {
    // Footage has higher cinematic potential
    if (asset.metadata.type === 'footage') {
       if (asset.metadata.width && asset.metadata.width >= 3840) return 1.0; // 4K
       return 0.9;
    }
    
    const tags = (asset.metadata.tags || []).join(' ').toLowerCase();
    if (tags.includes('cinematic') || tags.includes('dramatic lighting') || tags.includes('bokeh')) {
      return 0.9;
    }
    
    return 0.7;
  }
  
  /**
   * Score focus strength
   */
  private static scoreFocusStrength(asset: AssetResult): number {
    const tags = (asset.metadata.tags || []).join(' ').toLowerCase();
    
    if (tags.includes('macro') || tags.includes('close-up') || tags.includes('selective focus')) {
      return 0.9;
    }
    
    return 0.75;
  }
  
  /**
   * Score distraction risk (inverted)
   */
  private static scoreDistractionRisk(asset: AssetResult): number {
    const tags = (asset.metadata.tags || []).join(' ').toLowerCase();
    
    if (tags.includes('text') || tags.includes('signage') || tags.includes('watermark')) {
      return 0.3; // High risk
    }
    
    return 0.9; // Low risk
  }
  
  /**
   * Get top N assets
   */
  static getTopN(scored: AssetScore[], n: number): AssetScore[] {
    return scored.slice(0, n);
  }
  
  /**
   * Filter by minimum score
   */
  static filterByMinScore(scored: AssetScore[], minScore: number): AssetScore[] {
    return scored.filter(s => s.totalScore >= minScore);
  }
}
