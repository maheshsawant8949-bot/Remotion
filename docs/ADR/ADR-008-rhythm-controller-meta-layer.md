# ADR-008: Rhythm Controller as Meta-Layer

**Status**: Accepted  
**Date**: 2026-02-09  
**Context**: Emphasis Engine Architecture

## Decision

The Rhythm Controller operates as a **meta-layer** that analyzes the entire scene sequence AFTER individual scene compilation, not during it.

## Context

During emphasis engine development, we needed a mechanism to:

1. Prevent monotonous sequences (flatlines)
2. Prevent intensity clustering
3. Ensure narrative flow across the entire video

The question was: **Where does rhythm analysis fit in the pipeline?**

## Options Considered

### Option 1: Scene-by-Scene Rhythm (❌ Rejected)

Integrate rhythm checks into individual scene compilation.

**Pros:**

- Simpler integration
- No separate pass needed

**Cons:**

- ❌ Cannot see full sequence context
- ❌ Cannot detect flatlines (requires looking ahead)
- ❌ Cannot detect clustering (requires window analysis)
- ❌ Violates separation of concerns

### Option 2: Meta-Layer After Compilation (✅ Accepted)

Rhythm Controller operates on the entire compiled sequence.

**Pros:**

- ✅ Full sequence visibility
- ✅ Can detect patterns (flatlines, clustering, arcs)
- ✅ Clean separation of concerns
- ✅ Optional and non-invasive
- ✅ Can be disabled without breaking compilation

**Cons:**

- Requires separate pass
- Slightly more complex integration

## Decision

**Rhythm Controller is a meta-layer that operates AFTER scene compilation.**

### Pipeline Flow

```
Individual Scene Compilation:
  Script Input
      ↓
  Emotional Analysis
      ↓
  Strategy Selection
      ↓
  Reveal Resolution
      ↓
  Emphasis Resolution
      ↓
  Scene JSON Created
      ↓
  [Repeat for each scene]

Meta-Layer (Sequence-Level):
  All Scenes Compiled
      ↓
  Rhythm Controller Analyzes Sequence
      ↓
  Adjustments Suggested (optional)
      ↓
  Final Emphasis Levels Applied
      ↓
  Video JSON Finalized
```

## Architectural Principles

### 1. Sequence-Level Only

Rhythm NEVER operates scene-by-scene. It only makes sense globally.

**Why?**

- Flatline detection requires looking at 12+ consecutive scenes
- Clustering detection requires 4-scene windows
- Narrative arc detection requires full sequence position

### 2. Post-Compilation

Rhythm runs AFTER all scenes are individually compiled.

**Why?**

- Needs complete emphasis decisions from all scenes
- Cannot interfere with core compilation logic
- Maintains clean separation of concerns

### 3. Non-Invasive

Rhythm adjustments are suggestions, not mandates.

**Why?**

- Heuristic-based (not deterministic)
- Medium confidence (0.7)
- Human review encouraged
- Can be disabled entirely

### 4. Grammar-Respecting

Rhythm NEVER overrides:

- ❌ Grammar rules
- ❌ Strategy decisions
- ❌ Layout templates

It ONLY nudges:

- ✅ Emphasis strength (none ↔ soft ↔ strong)

## Implementation

### Correct Usage

```typescript
// ✅ CORRECT: Sequence-level analysis
const allScenes = compileAllScenes(scripts);
const rhythmInputs = allScenes.map((scene) => ({
  sceneIndex: scene.index,
  emphasis: scene.trace.emphasis.level,
  emotionalWeight: scene.emotionalWeight,
  strategy: scene.strategy,
}));

const rhythmAnalysis = RhythmConductor.conduct(rhythmInputs);

// Apply adjustments if desired
rhythmAnalysis.scenes.forEach((sceneRhythm) => {
  if (sceneRhythm.suggestedEmphasis !== sceneRhythm.originalEmphasis) {
    allScenes[sceneRhythm.sceneIndex].emphasis = sceneRhythm.suggestedEmphasis;
  }
});
```

### Incorrect Usage

```typescript
// ❌ WRONG: Scene-by-scene rhythm
scripts.forEach((script) => {
  const scene = compileScene(script);
  const rhythm = RhythmConductor.analyzeOne(scene); // NO! This doesn't exist
  scene.emphasis = rhythm.suggested;
});
```

## Consequences

### Positive

- ✅ Clean architectural separation
- ✅ Full sequence context available
- ✅ Can detect complex patterns
- ✅ Optional and transparent
- ✅ Easy to test in isolation

### Negative

- Requires two-pass compilation (scenes first, rhythm second)
- Slightly more complex integration
- Adjustments are suggestions (not automatic)

## Integration Points

### Current

- Standalone analysis (test scripts)
- Manual review of suggestions

### Future

- Auto-apply in scene factory (with flag)
- Evaluation harness metrics
- CLI visualization of rhythm flow

## Related

- **ADR-001**: Reveal Strategy Selection (scene-level)
- **ADR-002**: Emphasis Engine (scene-level)
- **This ADR**: Rhythm Controller (sequence-level meta-layer)

## Notes

The key insight: **Rhythm is about relationships between scenes, not individual scenes.**

Just as a conductor shapes the performance by adjusting tempo and dynamics across movements, the Rhythm Controller shapes narrative flow by adjusting emphasis across scenes.

**Think conductor — not composer.**
