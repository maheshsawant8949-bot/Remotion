/**
 * Forced Alignment
 * 
 * CRITICAL: Even for TTS, run forced alignment.
 * TTS timestamps are often slightly wrong.
 * Alignment guarantees frame-accurate sync.
 */

import { WordTimestamp } from './transcription';

/**
 * Forced Aligner
 */
export class ForcedAligner {
  /**
   * Align transcript to audio
   * 
   * Ensures frame-accurate synchronization.
   * 
   * Recommended tools:
   * - Montreal Forced Aligner
   * - Gentle
   * - Aeneas
   */
  static async align(
    audioPath: string,
    transcript: string
  ): Promise<WordTimestamp[]> {
    // Integrate with forced alignment via Python script
    const { execa } = await import('execa');
    const path = await import('path');
    const fs = await import('fs/promises');
    
    // Create temp files
    const transcriptPath = path.join(process.cwd(), 'temp', `transcript_${Date.now()}.json`);
    const outputPath = path.join(process.cwd(), 'temp', `aligned_${Date.now()}.json`);
    await fs.mkdir(path.dirname(transcriptPath), { recursive: true });
    
    try {
      // Write transcript to temp file
      await fs.writeFile(transcriptPath, JSON.stringify({ text: transcript, words: [] }));
      
      // Call Python alignment script
      const scriptPath = path.join(process.cwd(), 'scripts', 'align.py');
      
      console.log('Aligning audio with forced aligner...');
      const { stdout, stderr } = await execa('python', [scriptPath, audioPath, transcriptPath, outputPath]);
      
      if (stderr) {
        console.warn('Alignment warnings:', stderr);
      }
      
      // Read output
      const resultJson = await fs.readFile(outputPath, 'utf-8');
      const result = JSON.parse(resultJson);
      
      // Clean up temp files
      await fs.unlink(transcriptPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
      
      return result.words;
    } catch (error) {
      // Clean up on error
      await fs.unlink(transcriptPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
      throw new Error(`Forced alignment failed: ${error}`);
    }
  }
  
  /**
   * Validate alignment quality
   * 
   * Check for gaps, overlaps, and timing issues
   */
  static validateAlignment(words: WordTimestamp[]): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    for (let i = 0; i < words.length - 1; i++) {
      const current = words[i];
      const next = words[i + 1];
      
      // Check for overlaps
      if (current.end > next.start) {
        issues.push(`Overlap detected: "${current.word}" (${current.end}s) overlaps "${next.word}" (${next.start}s)`);
      }
      
      // Check for large gaps (> 1s)
      const gap = next.start - current.end;
      if (gap > 1.0) {
        issues.push(`Large gap detected: ${gap.toFixed(2)}s between "${current.word}" and "${next.word}"`);
      }
      
      // Check for zero-duration words
      if (current.end - current.start < 0.01) {
        issues.push(`Zero-duration word: "${current.word}"`);
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }
  
  /**
   * Refine TTS timestamps
   * 
   * TTS engines often provide timestamps, but they're not always accurate.
   * This refines them using forced alignment.
   */
  static async refineTTSTimestamps(
    audioPath: string,
    ttsTimestamps: WordTimestamp[]
  ): Promise<WordTimestamp[]> {
    // Use TTS timestamps as initial guess
    const transcript = ttsTimestamps.map(w => w.word).join(' ');
    
    // Run forced alignment for precision
    return this.align(audioPath, transcript);
  }
}
