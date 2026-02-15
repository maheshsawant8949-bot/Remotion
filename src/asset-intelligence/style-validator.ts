/**
 * Style Validator
 * 
 * EXTREMELY IMPORTANT: Most automation dies here.
 * 
 * Your Visual Style system must act as a gatekeeper.
 * If style mismatches → video feels stitched.
 */

import { AssetResult } from './multi-source-resolver';

/**
 * Style Criteria
 */
export interface StyleCriteria {
  colorTemperature: 'warm' | 'neutral' | 'cool';
  contrastLevel: 'low' | 'medium' | 'high';
  grainLevel: 'none' | 'subtle' | 'heavy';
  realism: 'photorealistic' | 'stylized' | 'abstract';
  lightingStyle: 'natural' | 'studio' | 'dramatic';
  compositionDensity: 'minimal' | 'balanced' | 'busy';
}

/**
 * Style Validation Result
 */
export interface StyleValidationResult {
  isValid: boolean;
  score: number;  // 0-1
  issues: string[];
  breakdown: {
    colorTemperature: number;
    contrast: number;
    grain: number;
    realism: number;
    lighting: number;
    composition: number;
  };
}

/**
 * Style Validator
 */
export class StyleValidator {
  /**
   * Validate asset against style criteria
   */
  static validate(
    asset: AssetResult,
    criteria: StyleCriteria
  ): StyleValidationResult {
    const issues: string[] = [];
    const breakdown = {
      colorTemperature: 1.0,
      contrast: 1.0,
      grain: 1.0,
      realism: 1.0,
      lighting: 1.0,
      composition: 1.0,
    };

    // 1. Resolution Check (Critical for premium feel)
    const minWidth = 1920; 
    if (asset.metadata.width && asset.metadata.width < minWidth) {
      issues.push(`Low resolution: ${asset.metadata.width}px (min ${minWidth}px)`);
      breakdown.realism = 0.5; // Low res kills realism
    }

    // 2. Aspect Ratio Check (Context dependent)
    if (asset.metadata.width && asset.metadata.height) {
      const ratio = asset.metadata.width / asset.metadata.height;
      const isLandscape = ratio > 1.3;
      if (!isLandscape && asset.metadata.type === 'footage') {
        issues.push('Invalid orientation: Footage should be landscape');
        breakdown.composition = 0.6;
      }
    }

    // 3. Metadata/Tag Analysis (Heuristic proxy for CV)
    const tags = (asset.metadata.tags || []).join(' ').toLowerCase();
    
    // Check Realism
    if (criteria.realism === 'photorealistic') {
      if (tags.includes('illustration') || tags.includes('vector') || tags.includes('cartoon') || tags.includes('3d render')) {
         // Allow 3d render if high quality, but flag cartoons
         if (tags.includes('cartoon') || tags.includes('vector')) {
            issues.push('Style mismatch: Detected illustrative content for photorealistic requirement');
            breakdown.realism = 0.4;
         }
      }
    }

    // Check Lighting
    if (criteria.lightingStyle === 'dramatic') {
      if (!tags.includes('dark') && !tags.includes('shadow') && !tags.includes('contrast')) {
        // Not a hard fail, but lowers score
        breakdown.lighting = 0.8; 
      }
    }

    // 4. Computer Vision Placeholder (Future integration)
    // const cvAnalysis = await this.analyzeImage(asset.url); 
    // This would update breakdown.colorTemperature, breakdown.grain, etc.

    // Calculate final score
    const score = Object.values(breakdown).reduce((a, b) => a + b, 0) / 6;

    return {
      isValid: issues.length === 0 && score >= 0.7,
      score,
      issues,
      breakdown,
    };
  }
  
  /**
   * Batch validate multiple assets
   */
  static validateBatch(
    assets: AssetResult[],
    criteria: StyleCriteria
  ): Map<AssetResult, StyleValidationResult> {
    const results = new Map<AssetResult, StyleValidationResult>();
    
    assets.forEach(asset => {
      results.set(asset, this.validate(asset, criteria)); // Now synchronous
    });
    
    return results;
  }
  
  /**
   * Get default style criteria from visual style system
   */
  static getDefaultCriteria(): StyleCriteria {
    // Based on editorial-modern style profile
    return {
      colorTemperature: 'cool',
      contrastLevel: 'medium',
      grainLevel: 'subtle',
      realism: 'photorealistic',
      lightingStyle: 'natural',
      compositionDensity: 'balanced',
    };
  }
}
