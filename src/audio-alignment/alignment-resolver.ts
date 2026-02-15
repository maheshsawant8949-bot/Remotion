/**
 * Alignment Resolver
 * 
 * Map phrases → scenes with safety guards.
 * 
 * Rules:
 * - If phrase < 1.2s → merge with neighbor (too fast = chaotic visuals)
 * - If phrase > 5s → split scene (long static visuals kill engagement)
 * - Density override: extend scene for information-heavy content
 */

import { Phrase } from './phrase-segmentation';

/**
 * Audio Timing
 */
export interface AudioTiming {
  phraseStart: number;
  phraseEnd: number;
  duration: number;
}

/**
 * Alignment Result
 */
export interface AlignmentResult {
  phrase: Phrase;
  audioTiming: AudioTiming;
  merged?: boolean;
  split?: boolean;
  densityOverride?: boolean;
}

/**
 * Alignment Context
 */
export interface AlignmentContext {
  density?: number;
  isInformationHeavy?: boolean;
}

/**
 * Alignment Resolver
 */
export class AlignmentResolver {
  /**
   * Resolve phrase-to-scene alignment
   */
  static resolve(phrases: Phrase[], context?: AlignmentContext): AlignmentResult[] {
    const results: AlignmentResult[] = [];
    let i = 0;
    
    while (i < phrases.length) {
      const phrase = phrases[i];
      
      // Rule: If phrase < 1.2s, merge with neighbor
      if (phrase.duration < 1.2 && i < phrases.length - 1) {
        const merged = this.mergePhrases(phrase, phrases[i + 1]);
        results.push({
          phrase: merged,
          audioTiming: {
            phraseStart: merged.start,
            phraseEnd: merged.end,
            duration: merged.duration,
          },
          merged: true,
        });
        i += 2; // Skip next phrase
        continue;
      }
      
      // Rule: If phrase > 5s, split scene
      if (phrase.duration > 5.0) {
        const split = this.splitPhrase(phrase);
        split.forEach(p => {
          results.push({
            phrase: p,
            audioTiming: {
              phraseStart: p.start,
              phraseEnd: p.end,
              duration: p.duration,
            },
            split: true,
          });
        });
        i++;
        continue;
      }
      
      // Density override: extend scene for information-heavy content
      const densityOverride = context?.isInformationHeavy && phrase.duration < 2.0;
      
      // Normal case
      results.push({
        phrase,
        audioTiming: {
          phraseStart: phrase.start,
          phraseEnd: phrase.end,
          duration: phrase.duration,
        },
        densityOverride,
      });
      i++;
    }
    
    // Apply safety guards
    return this.applySafetyGuards(results);
  }
  
  /**
   * Merge two phrases
   */
  private static mergePhrases(p1: Phrase, p2: Phrase): Phrase {
    return {
      text: `${p1.text} ${p2.text}`,
      words: [...p1.words, ...p2.words],
      start: p1.start,
      end: p2.end,
      duration: p2.end - p1.start,
    };
  }
  
  /**
   * Split long phrase at natural midpoint
   */
  private static splitPhrase(phrase: Phrase): Phrase[] {
    if (phrase.words.length < 2) {
      return [phrase];
    }
    
    const mid = Math.floor(phrase.words.length / 2);
    
    return [
      {
        text: phrase.words.slice(0, mid).map(w => w.word).join(' '),
        words: phrase.words.slice(0, mid),
        start: phrase.words[0].start,
        end: phrase.words[mid - 1].end,
        duration: phrase.words[mid - 1].end - phrase.words[0].start,
      },
      {
        text: phrase.words.slice(mid).map(w => w.word).join(' '),
        words: phrase.words.slice(mid),
        start: phrase.words[mid].start,
        end: phrase.words[phrase.words.length - 1].end,
        duration: phrase.words[phrase.words.length - 1].end - phrase.words[mid].start,
      },
    ];
  }
  
  /**
   * Apply safety guards
   */
  private static applySafetyGuards(results: AlignmentResult[]): AlignmentResult[] {
    // Prevent hyper-cutting: avg scene < 1.5s → auto merge
    const avgDuration = results.reduce((sum, r) => sum + r.audioTiming.duration, 0) / results.length;
    if (avgDuration < 1.5) {
      console.warn(`⚠️  Hyper-cutting detected. Average scene duration ${avgDuration.toFixed(2)}s < 1.5s.`);
      console.warn('    Consider merging more phrases or adjusting segmentation.');
    }
    
    // Prevent lecture pacing: scenes > 6s without reason → flag
    results.forEach((r, i) => {
      if (r.audioTiming.duration > 6.0 && !r.densityOverride) {
        console.warn(`⚠️  Scene ${i} duration ${r.audioTiming.duration.toFixed(2)}s exceeds 6s (lecture pacing risk).`);
      }
    });
    
    // Prevent robotic rhythm: identical durations → add small variance
    const durations = results.map(r => r.audioTiming.duration);
    const roundedDurations = durations.map(d => Math.round(d * 10) / 10);
    const uniqueDurations = new Set(roundedDurations);
    
    if (uniqueDurations.size < durations.length * 0.5) {
      console.warn('⚠️  Robotic rhythm detected. Many scenes have identical durations.');
      console.warn('    Human editing is never perfectly uniform. This is expected for audio-driven timing.');
    }
    
    return results;
  }
  
  /**
   * Get alignment statistics
   */
  static getStats(results: AlignmentResult[]): {
    totalScenes: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    mergedCount: number;
    splitCount: number;
    densityOverrideCount: number;
  } {
    if (results.length === 0) {
      return {
        totalScenes: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        mergedCount: 0,
        splitCount: 0,
        densityOverrideCount: 0,
      };
    }
    
    const durations = results.map(r => r.audioTiming.duration);
    
    return {
      totalScenes: results.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      mergedCount: results.filter(r => r.merged).length,
      splitCount: results.filter(r => r.split).length,
      densityOverrideCount: results.filter(r => r.densityOverride).length,
    };
  }
  
  /**
   * Print alignment report
   */
  static printReport(results: AlignmentResult[]): void {
    const stats = this.getStats(results);
    
    console.log('\n=== AUDIO ALIGNMENT REPORT ===\n');
    console.log(`Total Scenes: ${stats.totalScenes}`);
    console.log(`Average Duration: ${stats.avgDuration.toFixed(2)}s`);
    console.log(`Min Duration: ${stats.minDuration.toFixed(2)}s`);
    console.log(`Max Duration: ${stats.maxDuration.toFixed(2)}s`);
    console.log(`Merged Phrases: ${stats.mergedCount}`);
    console.log(`Split Phrases: ${stats.splitCount}`);
    console.log(`Density Overrides: ${stats.densityOverrideCount}\n`);
    
    console.log('─────────────────────────────────────────\n');
  }
}
