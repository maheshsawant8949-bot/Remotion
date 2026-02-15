"""
WhisperX Transcription Script

Usage:
    python transcribe.py <audio_file> <output_json>

Output:
    JSON file with word-level timestamps
"""

import sys
import json
import whisperx
import torch

def transcribe_audio(audio_file, output_file):
    """Transcribe audio using WhisperX"""
    
    # Use CPU or CUDA
    device = "cuda" if torch.cuda.is_available() else "cpu"
    compute_type = "float16" if device == "cuda" else "int8"
    
    print(f"Using device: {device}")
    print(f"Loading WhisperX model...")
    
    # Load model
    model = whisperx.load_model("base", device, compute_type=compute_type)
    
    print(f"Transcribing: {audio_file}")
    
    # Transcribe
    audio = whisperx.load_audio(audio_file)
    result = model.transcribe(audio, batch_size=16)
    
    # Align whisper output
    model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
    result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)
    
    # Format output
    words = []
    for segment in result["segments"]:
        if "words" in segment:
            for word in segment["words"]:
                words.append({
                    "word": word["word"],
                    "start": word["start"],
                    "end": word["end"],
                    "score": word.get("score", 1.0)
                })
    
    # Save to JSON
    output_data = {
        "text": result.get("text", ""),
        "language": result.get("language", "en"),
        "words": words
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Transcription saved to: {output_file}")
    print(f"Total words: {len(words)}")
    
    return output_data

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python transcribe.py <audio_file> <output_json>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        transcribe_audio(audio_file, output_file)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
