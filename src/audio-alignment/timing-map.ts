/**
 * Timing Map
 * 
 * Master structure - timeline spine for the entire video.
 * Everything attaches to this.
 */

import { Phrase } from './phrase-segmentation';

/**
 * Timing Map
 */
export interface TimingMap {
  phrases: Phrase[];
  totalDuration: number;
}

/**
 * Timing Map Builder
 */
export class TimingMapBuilder {
  /**
   * Build timing map from phrases
   */
  static build(phrases: Phrase[]): TimingMap {
    return {
      phrases,
      totalDuration: phrases.length > 0 ? phrases[phrases.length - 1].end : 0,
    };
  }
  
  /**
   * Get phrase at time
   */
  static getPhraseAtTime(map: TimingMap, time: number): Phrase | undefined {
    return map.phrases.find(p => time >= p.start && time <= p.end);
  }
  
  /**
   * Get phrase by index
   */
  static getPhraseByIndex(map: TimingMap, index: number): Phrase | undefined {
    return map.phrases[index];
  }
  
  /**
   * Get all phrases in time range
   */
  static getPhrasesInRange(map: TimingMap, startTime: number, endTime: number): Phrase[] {
    return map.phrases.filter(p => {
      return (p.start >= startTime && p.start <= endTime) ||
             (p.end >= startTime && p.end <= endTime) ||
             (p.start <= startTime && p.end >= endTime);
    });
  }
  
  /**
   * Validate timing map
   */
  static validate(map: TimingMap): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check for gaps between phrases
    for (let i = 0; i < map.phrases.length - 1; i++) {
      const current = map.phrases[i];
      const next = map.phrases[i + 1];
      
      const gap = next.start - current.end;
      if (gap > 0.5) {
        issues.push(`Large gap (${gap.toFixed(2)}s) between phrase ${i} and ${i + 1}`);
      }
      
      if (gap < 0) {
        issues.push(`Overlap detected between phrase ${i} and ${i + 1}`);
      }
    }
    
    // Check for zero-duration phrases
    map.phrases.forEach((phrase, i) => {
      if (phrase.duration < 0.1) {
        issues.push(`Phrase ${i} has very short duration: ${phrase.duration.toFixed(2)}s`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }
  
  /**
   * Print timing map summary
   */
  static printSummary(map: TimingMap): void {
    console.log('\n=== TIMING MAP SUMMARY ===\n');
    console.log(`Total Phrases: ${map.phrases.length}`);
    console.log(`Total Duration: ${map.totalDuration.toFixed(2)}s\n`);
    
    map.phrases.forEach((phrase, i) => {
      console.log(`[${i}] ${phrase.start.toFixed(2)}s - ${phrase.end.toFixed(2)}s (${phrase.duration.toFixed(2)}s)`);
      console.log(`    "${phrase.text}"\n`);
    });
  }
}
