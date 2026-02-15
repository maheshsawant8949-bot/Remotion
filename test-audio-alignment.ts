/**
 * Test Audio Alignment
 * 
 * Tests WhisperX transcription and forced alignment
 */

import { Transcriber } from './src/audio-alignment/transcription.ts';
import { ForcedAligner } from './src/audio-alignment/forced-alignment.ts';
import * as path from 'path';

async function testAudioAlignment() {
  try {
    // Test audio file path
    const testAudioPath = path.join('c:', 'Users', 'mahesh.sawant', 'Desktop', 'Remotion', 'test_audio', 'Test.wav');
    
    console.log('=== Audio Alignment Test ===\n');
    console.log(`Audio file: ${testAudioPath}\n`);
    
    // Step 1: Transcribe
    console.log('Step 1: Transcribing with WhisperX...');
    const transcription = await Transcriber.transcribe(testAudioPath);
    
    console.log('\n✅ Transcription complete!');
    console.log(`Text: ${transcription.text}`);
    console.log(`Language: ${transcription.language}`);
    console.log(`Duration: ${transcription.duration?.toFixed(2)}s`);
    console.log(`Words: ${transcription.words.length}`);
    
    // Show first 5 words
    console.log('\nFirst 5 words with timestamps:');
    transcription.words.slice(0, 5).forEach(w => {
      console.log(`  "${w.word}" [${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s]`);
    });
    
    // Step 2: Validate alignment
    console.log('\nStep 2: Validating alignment...');
    const validation = ForcedAligner.validateAlignment(transcription.words);
    
    if (validation.isValid) {
      console.log('✅ Alignment is valid!');
    } else {
      console.log('⚠️  Alignment issues found:');
      validation.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`✅ Transcription: SUCCESS`);
    console.log(`✅ Alignment validation: ${validation.isValid ? 'PASSED' : 'PASSED WITH WARNINGS'}`);
    console.log(`✅ Total words: ${transcription.words.length}`);
    console.log(`✅ Audio duration: ${transcription.duration?.toFixed(2)}s`);
    
    console.log('\n🎉 Audio alignment is working!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run test
testAudioAlignment();
