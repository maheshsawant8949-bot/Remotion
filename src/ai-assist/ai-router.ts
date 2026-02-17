
/**
 * AI Router
 * 
 * CRITICAL: Decide WHEN AI is needed.
 * 
 * Trigger only if:
 * - confidence < threshold
 * - semantic ambiguity detected
 * - asset match weak
 * - script highly abstract
 * 
 * Do NOT call AI blindly.
 */

export interface AiTriggerContext {
  script: string;
  confidenceScore?: number; // 0-1
  assetMatchCount?: number;
  isAbstract?: boolean;
}

export type AiServiceType = 
  | 'visual-suggestion'
  | 'asset-ranking'
  | 'segmentation'
  | 'quality-check'
  | 'thumbnail';

export class AiRouter {
  private static CONFIDENCE_THRESHOLD = 0.7;
  private static MIN_ASSET_MATCHES = 3;

  /**
   * Check if AI assistance is needed
   */
  static shouldTrigger(
    service: AiServiceType,
    context: AiTriggerContext
  ): boolean {
    // 1. Quality Check & Thumbnail: Always trigger (high ROI)
    if (service === 'quality-check' || service === 'thumbnail') {
      return true;
    }

    // 2. High Value / Complexity: Trigger for abstract content
    if (context.isAbstract) {
      return true;
    }

    // 3. Low Confidence: Trigger if system is unsure
    if (context.confidenceScore !== undefined && context.confidenceScore < this.CONFIDENCE_THRESHOLD) {
      console.log(`🤖 AI Triggered: Low confidence (${context.confidenceScore})`);
      return true;
    }

    // 4. Asset Scarcity: Trigger if few assets found
    if (context.assetMatchCount !== undefined && context.assetMatchCount < this.MIN_ASSET_MATCHES) {
      console.log(`🤖 AI Triggered: Low asset matches (${context.assetMatchCount})`);
      return true;
    }

    // Default: Save tokens
    return false;
  }
}
