/**
 * Intensity Analyzer
 * 
 * Analyzes intensity distribution across scene sequence.
 * Detects flatlines, clustering, and imbalances.
 */

import { EmphasisLevelName } from '../emphasis-engine/emphasis-types';
import { IntensityLevel } from './rhythm-types';

export class IntensityAnalyzer {
  /**
   * Map emphasis level to intensity.
   */
  static mapToIntensity(emphasis: EmphasisLevelName): IntensityLevel {
    switch (emphasis) {
      case 'strong':
        return 'high';
      case 'soft':
        return 'medium';
      case 'none':
      default:
        return 'low';
    }
  }

  /**
   * Detect flatline: no strong emphasis across many scenes.
   * 
   * Rule: If 12+ consecutive scenes without strong, it's a flatline.
   */
  static detectFlatline(emphasisLevels: EmphasisLevelName[]): boolean {
    let consecutiveNonStrong = 0;
    const FLATLINE_THRESHOLD = 12;

    for (const level of emphasisLevels) {
      if (level === 'strong') {
        consecutiveNonStrong = 0;
      } else {
        consecutiveNonStrong++;
        if (consecutiveNonStrong >= FLATLINE_THRESHOLD) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Detect clustering: multiple strong emphasis in close proximity.
   * 
   * Rule: If 2+ strong within 4 scenes, it's clustering.
   */
  static detectClustering(emphasisLevels: EmphasisLevelName[]): boolean {
    const WINDOW_SIZE = 4;

    for (let i = 0; i <= emphasisLevels.length - WINDOW_SIZE; i++) {
      const window = emphasisLevels.slice(i, i + WINDOW_SIZE);
      const strongCount = window.filter(level => level === 'strong').length;

      if (strongCount >= 2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find strongest candidate in a range for elevation.
   * Returns index of scene with highest potential.
   */
  static findStrongestCandidate(
    startIndex: number,
    endIndex: number,
    emotionalWeights: number[],
    currentEmphasis: EmphasisLevelName[]
  ): number {
    let maxWeight = -1;
    let bestIndex = startIndex;

    for (let i = startIndex; i <= endIndex && i < emotionalWeights.length; i++) {
      // Only consider scenes that aren't already strong
      if (currentEmphasis[i] !== 'strong' && emotionalWeights[i] > maxWeight) {
        maxWeight = emotionalWeights[i];
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  /**
   * Calculate intensity variance across sequence.
   * Low variance = monotonous, high variance = dynamic.
   */
  static calculateVariance(emphasisLevels: EmphasisLevelName[]): number {
    const intensities = emphasisLevels.map(level => {
      switch (level) {
        case 'strong': return 3;
        case 'soft': return 2;
        case 'none': return 1;
      }
    });

    const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;

    return variance;
  }
}
