/**
 * Transcription Layer
 * 
 * Use Whisper/WhisperX for high accuracy + word timestamps + punctuation.
 * DO NOT build custom ASR. Use proven models.
 */

/**
 * Word Timestamp
 */
export interface WordTimestamp {
  word: string;
  start: number;  // seconds
  end: number;    // seconds
  confidence?: number;
}

/**
 * Transcription Result
 */
export interface TranscriptionResult {
  text: string;
  words: WordTimestamp[];
  language?: string;
  duration?: number;
}

/**
 * Transcriber
 * 
 * Integration point for Whisper/WhisperX.
 */
export class Transcriber {
  /**
   * Transcribe audio file
   * 
   * Recommended: WhisperX for word-level timestamps
   * 
   * Example output:
   * [
   *   { word: "Artificial", start: 0.12, end: 0.48 },
   *   { word: "intelligence", start: 0.50, end: 1.02 }
   * ]
   */
  static async transcribe(audioPath: string): Promise<TranscriptionResult> {
    // Integrate with Whisper/WhisperX via Python script
    const { execa } = await import('execa');
    const path = await import('path');
    const fs = await import('fs/promises');
    
    // Create temp output file
    const outputPath = path.join(process.cwd(), 'temp', `transcription_${Date.now()}.json`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    try {
      // Call Python transcription script
      const scriptPath = path.join(process.cwd(), 'scripts', 'transcribe.py');
      
      console.log('Transcribing audio with WhisperX...');
      const { stdout, stderr } = await execa('python', [scriptPath, audioPath, outputPath]);
      
      if (stderr) {
        console.warn('WhisperX warnings:', stderr);
      }
      
      // Read output
      const resultJson = await fs.readFile(outputPath, 'utf-8');
      const result = JSON.parse(resultJson);
      
      // Convert to our format
      const words: WordTimestamp[] = result.words.map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end,
        confidence: w.score || 1.0,
      }));
      
      // Clean up temp file
      await fs.unlink(outputPath).catch(() => {});
      
      return {
        text: result.text,
        words,
        language: result.language || 'en',
        duration: words.length > 0 ? words[words.length - 1].end : 0,
      };
    } catch (error) {
      // Clean up on error
      await fs.unlink(outputPath).catch(() => {});
      throw new Error(`WhisperX transcription failed: ${error}`);
    }
  }
  
  /**
   * Parse transcription from external tool
   * 
   * Use this if you've already run Whisper/WhisperX externally
   */
  static parseTranscription(data: any): TranscriptionResult {
    // Parse Whisper/WhisperX JSON output
    if (!data.segments && !data.words) {
      throw new Error('Invalid transcription format. Expected segments or words array.');
    }
    
    const words: WordTimestamp[] = [];
    
    // WhisperX format
    if (data.segments) {
      for (const segment of data.segments) {
        if (segment.words) {
          for (const word of segment.words) {
            words.push({
              word: word.word || word.text,
              start: word.start,
              end: word.end,
              confidence: word.confidence || word.score,
            });
          }
        }
      }
    }
    
    // Direct words array
    if (data.words) {
      words.push(...data.words);
    }
    
    return {
      text: words.map(w => w.word).join(' '),
      words,
      language: data.language,
      duration: words.length > 0 ? words[words.length - 1].end : 0,
    };
  }
}
