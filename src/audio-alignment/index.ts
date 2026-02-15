/**
 * Audio Alignment Engine
 * 
 * Timing intelligence layer that converts voice-over audio into phrase-level timestamps
 * that drive scene orchestration.
 * 
 * This is core infrastructure. Scene timing must become audio-driven — not estimated.
 * 
 * Pipeline order:
 * 1. Script generation
 * 2. Audio generation (TTS or recording)
 * 3. 👉 AUDIO ALIGNMENT (this module)
 * 4. Scene duration locking
 * 5. Motion/camera/transitions (use audio timing)
 */

export {
  type WordTimestamp,
  type TranscriptionResult,
  Transcriber,
} from './transcription';

export {
  ForcedAligner,
} from './forced-alignment';

export {
  type Phrase,
  PhraseSegmenter,
} from './phrase-segmentation';

export {
  type TimingMap,
  TimingMapBuilder,
} from './timing-map';

export {
  type AudioTiming,
  type AlignmentResult,
  type AlignmentContext,
  AlignmentResolver,
} from './alignment-resolver';

export {
  AudioAlignmentEngine,
} from './engine';
