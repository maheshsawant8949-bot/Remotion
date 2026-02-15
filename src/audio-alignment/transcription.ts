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
    // TODO: Integrate with Whisper/WhisperX
    // This is a placeholder for the actual integration
    
    throw new Error('Whisper/WhisperX integration not yet implemented. Use external tool and provide word timestamps.');
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
