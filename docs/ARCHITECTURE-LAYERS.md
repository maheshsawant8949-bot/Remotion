# Pipeline Architecture: Scene-Level vs Meta-Layer

## Complete Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  SCENE-LEVEL COMPILATION                    │
│                  (Runs for EACH scene)                      │
└─────────────────────────────────────────────────────────────┘

    Script Input (Scene 1)
           ↓
    Emotional Analysis
           ↓
    Strategy Prediction
           ↓
    Density Analysis
           ↓
    Reveal Resolution
           ↓
    Emphasis Resolution
           ↓
    Scene JSON Created
           ↓
    [Store in array]

    [Repeat for Scene 2, 3, 4... N]

┌─────────────────────────────────────────────────────────────┐
│                    META-LAYER ANALYSIS                      │
│              (Runs ONCE on entire sequence)                 │
└─────────────────────────────────────────────────────────────┘

    All Scenes Compiled (Array)
           ↓
    Rhythm Controller Analyzes:
      - Narrative arc detection
      - Flatline detection (12+ scenes)
      - Clustering detection (4-scene windows)
      - Intensity distribution
           ↓
    Adjustment Suggestions Generated
           ↓
    [Optional] Apply Adjustments
           ↓
    Final Video JSON
```

## Key Differences

### Scene-Level Components (Run Per Scene)

- ✅ Emotional Analyzer
- ✅ Strategy Engine
- ✅ Density Controller
- ✅ Reveal Resolver
- ✅ Emphasis Resolver

**Why?** These analyze individual scene content and make local decisions.

### Meta-Layer Components (Run Once on Sequence)

- ✅ Rhythm Controller

**Why?** Rhythm requires full sequence context to detect patterns.

## Example: Why Rhythm Must Be Meta-Layer

### ❌ Cannot Work Scene-by-Scene

```typescript
// This is IMPOSSIBLE to do scene-by-scene:

// Scene 5 compilation
const scene5 = compileScene(script5);
// ❌ Cannot detect: "Are we in a flatline?"
//    → Need to see scenes 1-4 AND 6-17 to know!

// ❌ Cannot detect: "Are we clustering?"
//    → Need to see scenes 3-4 and 6-7 to know!

// ❌ Cannot detect: "What narrative phase?"
//    → Need to know total scene count and position!
```

### ✅ Only Works on Full Sequence

```typescript
// This is how rhythm MUST work:

const allScenes = [scene1, scene2, ..., scene26];

const rhythmAnalysis = RhythmConductor.conduct(allScenes);
// ✅ Can detect flatlines: Look at all 26 scenes
// ✅ Can detect clustering: Scan 4-scene windows
// ✅ Can detect narrative arc: Know position 5/26 = 19%
```

## Integration Example

```typescript
// Scene Factory (simplified)
class SceneFactory {
  static compileVideo(scripts: string[]) {
    // STEP 1: Compile all scenes individually
    const scenes = scripts.map(script => {
      const emotion = EmotionalAnalyzer.analyze(script);
      const strategy = StrategyEngine.predict(script, emotion);
      const reveal = RevealResolver.resolve(...);
      const emphasis = EmphasisResolver.resolve(...);

      return { emotion, strategy, reveal, emphasis, ... };
    });

    // STEP 2: Meta-layer rhythm analysis
    const rhythmInputs = scenes.map((scene, index) => ({
      sceneIndex: index,
      emphasis: scene.emphasis.level,
      emotionalWeight: scene.emotion.score,
      strategy: scene.strategy,
    }));

    const rhythmAnalysis = RhythmConductor.conduct(rhythmInputs);

    // STEP 3: Apply rhythm adjustments (optional)
    rhythmAnalysis.scenes.forEach(sceneRhythm => {
      if (sceneRhythm.suggestedEmphasis !== sceneRhythm.originalEmphasis) {
        scenes[sceneRhythm.sceneIndex].emphasis.level = sceneRhythm.suggestedEmphasis;
        scenes[sceneRhythm.sceneIndex].trace.rhythmAdjustment = sceneRhythm.adjustmentReason;
      }
    });

    return scenes;
  }
}
```

## Summary

**Scene-Level**: Analyzes content, makes local decisions  
**Meta-Layer**: Analyzes patterns, makes global adjustments

**Rhythm is inherently global. It cannot and should not operate scene-by-scene.**
