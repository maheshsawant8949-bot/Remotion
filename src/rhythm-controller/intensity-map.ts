/**
 * Intensity Map
 * 
 * Creates a sequence visualization for global reasoning.
 * 
 * We are NOT graphing it — just modeling.
 * This lets the engine reason globally.
 */

export type IntensityLevel = 1 | 2 | 3;

export interface IntensityMapEntry {
  sceneIndex: number;
  intensity: IntensityLevel;
  label: 'low' | 'medium' | 'high';
}

export class IntensityMap {
  /**
   * Build intensity map from scores.
   * 
   * Creates a sequence visualization: [1,1,2,2,3,2,1...]
   */
  static build(scores: Array<{ sceneIndex: number; composite: number }>): IntensityMapEntry[] {
    return scores.map(score => ({
      sceneIndex: score.sceneIndex,
      intensity: this.clampIntensity(score.composite),
      label: this.getLabel(score.composite),
    }));
  }

  /**
   * Get intensity sequence as array.
   * 
   * Example: [1,1,2,2,3,2,1...]
   */
  static getSequence(map: IntensityMapEntry[]): IntensityLevel[] {
    return map.map(entry => entry.intensity);
  }

  /**
   * Detect flatline in intensity map.
   * Returns true if too many consecutive scenes at same low intensity.
   */
  static detectFlatline(sequence: IntensityLevel[], threshold: number = 12): boolean {
    let consecutiveLow = 0;

    for (const intensity of sequence) {
      if (intensity <= 1) {
        consecutiveLow++;
        if (consecutiveLow >= threshold) return true;
      } else if (intensity >= 3) {
        consecutiveLow = 0;
      }
    }

    return false;
  }

  /**
   * Detect clustering in intensity map.
   * Returns true if too many high-intensity scenes in close proximity.
   */
  static detectClustering(sequence: IntensityLevel[], windowSize: number = 4): boolean {
    for (let i = 0; i <= sequence.length - windowSize; i++) {
      const window = sequence.slice(i, i + windowSize);
      const highCount = window.filter(intensity => intensity >= 3).length;
      if (highCount >= 2) return true;
    }

    return false;
  }

  /**
   * Get intensity distribution.
   * Returns count of low/medium/high scenes.
   */
  static getDistribution(sequence: IntensityLevel[]): {
    low: number;
    medium: number;
    high: number;
    total: number;
  } {
    const low = sequence.filter(i => i === 1).length;
    const medium = sequence.filter(i => i === 2).length;
    const high = sequence.filter(i => i === 3).length;

    return { low, medium, high, total: sequence.length };
  }

  /**
   * Get intensity summary for logging.
   */
  static getSummary(map: IntensityMapEntry[]): string {
    const sequence = this.getSequence(map);
    const dist = this.getDistribution(sequence);
    const flatline = this.detectFlatline(sequence);
    const clustering = this.detectClustering(sequence);

    return (
      `Intensity Map (${map.length} scenes):\n` +
      `  Sequence: [${sequence.join(',')}]\n` +
      `  Distribution: ${dist.low} low, ${dist.medium} medium, ${dist.high} high\n` +
      `  Flatline: ${flatline ? 'YES' : 'NO'}\n` +
      `  Clustering: ${clustering ? 'YES' : 'NO'}`
    );
  }

  /**
   * Clamp composite score to 1-3 range.
   */
  private static clampIntensity(score: number): IntensityLevel {
    if (score <= 1) return 1;
    if (score >= 3) return 3;
    return 2;
  }

  /**
   * Get label for intensity level.
   */
  private static getLabel(score: number): 'low' | 'medium' | 'high' {
    if (score <= 1) return 'low';
    if (score >= 3) return 'high';
    return 'medium';
  }
}
