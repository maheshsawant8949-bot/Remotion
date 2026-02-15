/**
 * Audio Alignment Engine
 * 
 * The main orchestrator for audio-driven timing.
 * Connects Transcription -> Segmentation -> Timing Map.
 */

import { Transcriber } from './transcription';
import { ForcedAligner } from './forced-alignment';
import { PhraseSegmenter } from './phrase-segmentation';
import { AlignmentResolver, AlignmentResult } from './alignment-resolver';
import { TimingMap, TimingMapBuilder } from './timing-map';

export class AudioAlignmentEngine {
  /**
   * Process audio file and generate timing map
   * 
   * The "One Ring to Rule Them All" method for timing.
   */
  static async processAudio(audioPath: string): Promise<{
    timingMap: TimingMap;
    alignmentResults: AlignmentResult[];
  }> {
    console.log(`🎤 Processing audio: ${audioPath}`);
    
    // 1. Transcribe (WhisperX)
    console.log('   - Transcribing...');
    const transcription = await Transcriber.transcribe(audioPath);
    
    // 2. Forced Alignment (Verification)
    console.log('   - Validating alignment...');
    const alignmentValidation = ForcedAligner.validateAlignment(transcription.words);
    if (!alignmentValidation.isValid) {
      console.warn('   ⚠️ Alignment issues detected:', alignmentValidation.issues[0]);
    }
    
    // 3. Phrase Segmentation
    console.log('   - Segmenting phrases...');
    const phrases = PhraseSegmenter.segment(transcription.words);
    
    // 4. Resolve Alignment (Merge/Split/Guardrails)
    console.log('   - Resolving alignment...');
    const alignmentResults = AlignmentResolver.resolve(phrases);
    
    // 5. Build Timing Map
    console.log('   - Building timing map...');
    // We use the phrases from alignment results because they might have been merged/split
    const finalPhrases = alignmentResults.map(r => r.phrase);
    const timingMap = TimingMapBuilder.build(finalPhrases);
    
    return {
      timingMap,
      alignmentResults,
    };
  }
}
