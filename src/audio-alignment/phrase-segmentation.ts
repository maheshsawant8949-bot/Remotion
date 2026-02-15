/**
 * Phrase Segmentation
 * 
 * VERY IMPORTANT: Never drive visuals from individual words. That looks terrible.
 * 
 * Target duration: 1.5-4 seconds per phrase
 * (natural human processing window)
 */

import { WordTimestamp } from './transcription';

/**
 * Phrase
 */
export interface Phrase {
  text: string;
  words: WordTimestamp[];
  start: number;
  end: number;
  duration: number;
}

/**
 * Phrase Segmenter
 * 
 * Hybrid logic:
 * - Rule-based: punctuation, conjunctions, pauses
 * - Optional AI assist: LLM refinement
 * - Keep deterministic guardrails
 */
export class PhraseSegmenter {
  /**
   * Segment words into phrases
   */
  static segment(words: WordTimestamp[]): Phrase[] {
    const phrases: Phrase[] = [];
    let currentPhrase: WordTimestamp[] = [];
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentPhrase.push(word);
      
      // Check for natural break points
      const shouldBreak = this.shouldBreakPhrase(word, words[i + 1], currentPhrase);
      
      if (shouldBreak || i === words.length - 1) {
        const phrase = this.createPhrase(currentPhrase);
        
        // Validate phrase duration (1.5-4s target)
        if (phrase.duration >= 1.5 && phrase.duration <= 4.0) {
          phrases.push(phrase);
          currentPhrase = [];
        } else if (phrase.duration > 4.0) {
          // Split long phrase
          const split = this.splitLongPhrase(currentPhrase);
          phrases.push(...split);
          currentPhrase = [];
        } else if (i === words.length - 1) {
          // Last phrase, even if short
          phrases.push(phrase);
          currentPhrase = [];
        }
        // If < 1.5s and not last, keep accumulating
      }
    }
    
    return phrases;
  }
  
  /**
   * Determine if phrase should break
   */
  private static shouldBreakPhrase(
    currentWord: WordTimestamp,
    nextWord: WordTimestamp | undefined,
    currentPhrase: WordTimestamp[]
  ): boolean {
    if (!nextWord) return true;
    
    // Punctuation breaks (strong)
    if (currentWord.word.match(/[.!?]/)) {
      return true;
    }
    
    // Comma/semicolon breaks (medium)
    if (currentWord.word.match(/[,;:]/)) {
      const duration = currentWord.end - currentPhrase[0].start;
      // Only break if phrase is already substantial
      if (duration > 2.0) {
        return true;
      }
    }
    
    // Conjunction breaks (and, but, or, etc.)
    if (this.isConjunction(nextWord.word)) {
      const duration = currentWord.end - currentPhrase[0].start;
      if (duration > 2.5) {
        return true;
      }
    }
    
    // Pause detection (gap > 0.3s)
    const gap = nextWord.start - currentWord.end;
    if (gap > 0.3) {
      return true;
    }
    
    // Duration limit (approaching 4s)
    const duration = currentWord.end - currentPhrase[0].start;
    if (duration > 3.8) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if word is a conjunction
   */
  private static isConjunction(word: string): boolean {
    const conjunctions = ['and', 'but', 'or', 'so', 'yet', 'for', 'nor', 'while', 'because'];
    return conjunctions.includes(word.toLowerCase().replace(/[^\w]/g, ''));
  }
  
  /**
   * Create phrase from words
   */
  private static createPhrase(words: WordTimestamp[]): Phrase {
    if (words.length === 0) {
      throw new Error('Cannot create phrase from empty words array');
    }
    
    return {
      text: words.map(w => w.word).join(' '),
      words,
      start: words[0].start,
      end: words[words.length - 1].end,
      duration: words[words.length - 1].end - words[0].start,
    };
  }
  
  /**
   * Split long phrase at natural midpoint
   */
  private static splitLongPhrase(words: WordTimestamp[]): Phrase[] {
    if (words.length < 2) {
      return [this.createPhrase(words)];
    }
    
    // Find best split point (prefer punctuation, conjunctions, or midpoint)
    let splitIndex = Math.floor(words.length / 2);
    
    // Look for punctuation near midpoint
    for (let i = Math.floor(words.length * 0.4); i < Math.floor(words.length * 0.6); i++) {
      if (words[i].word.match(/[,;:]/)) {
        splitIndex = i + 1;
        break;
      }
    }
    
    return [
      this.createPhrase(words.slice(0, splitIndex)),
      this.createPhrase(words.slice(splitIndex)),
    ];
  }
  
  /**
   * Get segmentation statistics
   */
  static getStats(phrases: Phrase[]): {
    totalPhrases: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    inTargetRange: number;
  } {
    if (phrases.length === 0) {
      return {
        totalPhrases: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        inTargetRange: 0,
      };
    }
    
    const durations = phrases.map(p => p.duration);
    const inTargetRange = phrases.filter(p => p.duration >= 1.5 && p.duration <= 4.0).length;
    
    return {
      totalPhrases: phrases.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      inTargetRange,
    };
  }
}
