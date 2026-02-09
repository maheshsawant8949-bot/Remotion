# Rhythm Controller

**Post-compilation meta-layer for narrative flow optimization.**

## Core Principle

> **Rhythm is a meta-layer. It operates on the ENTIRE sequence, never scene-by-scene.**

The Rhythm Controller analyzes scene sequences AFTER compilation and nudges emphasis levels to create better narrative flow, prevent monotony, and ensure appropriate pacing.

## Meta-Layer Architecture

```
Individual Scene Compilation (Scene-by-Scene):
  Script → Emotion → Strategy → Reveal → Emphasis → Scene JSON

Meta-Layer (Sequence-Level):
  All Scenes → Rhythm Analysis → Adjustments → Final Video JSON
```

**Key Insight**: Rhythm only makes sense globally. You cannot detect flatlines, clustering, or narrative arcs by looking at individual scenes.

## Architectural Rules

- ❌ Overrides grammar rules
- ❌ Rewrites strategy decisions
- ❌ Changes layout templates

It ONLY:

- ✅ Nudges emphasis strength (none ↔ soft ↔ strong)
- ✅ Operates at sequence level
- ✅ Respects all architectural constraints

## Architecture

```
rhythm-controller/
├── rhythm-types.ts          # Type definitions
├── narrative-detector.ts    # Heuristic arc detection
├── intensity-analyzer.ts    # Flatline/clustering detection
├── rhythm-conductor.ts      # Main orchestration logic
└── index.ts                 # Public API
```

## Core Responsibilities

### 1. Narrative Arc Detection

Heuristically detects narrative phases:

- **Setup** (first ~20%) - Context setting
- **Expansion** (next ~30%) - Building understanding
- **Escalation** (middle ~30%) - Rising tension
- **Peak** (~10%) - Climax, key revelation
- **Resolution** (final ~10%) - Conclusion

Detection uses:

- Scene position in sequence
- Intent types (e.g., `context_setting`, `reflective_closure`)
- Emotional weight signals

### 2. Intensity Distribution

Prevents problematic patterns:

**Flatline Detection:**

- Rule: 12+ consecutive scenes without strong emphasis
- Fix: Elevate strongest candidate (if emotion ≥ 4)

**Clustering Detection:**

- Rule: 2+ strong emphasis within 4 scenes
- Fix: Downgrade later instances to soft

### 3. Narrative Alignment

Ensures emphasis matches narrative expectations:

- **Peak phases** → Should have medium/high intensity
- **Resolution phases** → Should wind down (avoid strong)

## Usage

```typescript
import { RhythmConductor, RhythmInput } from "./rhythm-controller";

// Prepare inputs (after scene compilation)
const inputs: RhythmInput[] = scenes.map((scene, index) => ({
  sceneIndex: index,
  emphasis: scene.trace.emphasis.level,
  emotionalWeight: scene.emotionalWeight,
  strategy: scene.strategy,
  intentType: scene.intent.type,
}));

// Conduct rhythm analysis
const analysis = RhythmConductor.conduct(inputs);

// Check for adjustments
analysis.scenes.forEach((sceneRhythm) => {
  if (sceneRhythm.originalEmphasis !== sceneRhythm.suggestedEmphasis) {
    console.log(`Scene ${sceneRhythm.sceneIndex}:`);
    console.log(`  Original: ${sceneRhythm.originalEmphasis}`);
    console.log(`  Suggested: ${sceneRhythm.suggestedEmphasis}`);
    console.log(`  Reason: ${sceneRhythm.adjustmentReason}`);
  }
});

// Apply adjustments (optional - you decide)
if (analysis.adjustmentsMade > 0) {
  // Update scene emphasis levels with suggested values
}
```

## Design Decisions

### Why Post-Compilation?

The Rhythm Controller operates AFTER individual scene compilation because:

1. **Sequence awareness** - Needs full context of all scenes
2. **Non-invasive** - Doesn't interfere with core compilation logic
3. **Optional** - Can be disabled without breaking the system
4. **Transparent** - All adjustments are logged and traceable

### Why Heuristic?

Perfect narrative detection is impossible. Instead:

- Use position-based heuristics (setup = first 20%)
- Leverage intent types as strong signals
- Accept imperfection - "guided, not rigid"
- Log all decisions for transparency

### Confidence Levels

All rhythm adjustments have `confidence: 0.7` (medium) because:

- These are heuristic, not deterministic
- Human review is encouraged
- Adjustments are suggestions, not mandates

## Integration Points

### Current Pipeline

```
Script Input
    ↓
Emotional Analysis
    ↓
Strategy Selection
    ↓
Scene Compilation (with Emphasis Engine)
    ↓
[NEW] Rhythm Controller ← Analyzes full sequence
    ↓
Final Scene JSON
```

### Future Integration

The Rhythm Controller can be integrated into:

1. **Scene Factory** - Apply adjustments automatically
2. **Evaluation Harness** - Track rhythm metrics
3. **CLI Tools** - Show rhythm analysis in output

## Rules & Constraints

### Flatline Prevention

- **Threshold**: 12 consecutive scenes without strong
- **Action**: Elevate strongest candidate
- **Requirement**: Candidate must have emotion ≥ 4

### Clustering Prevention

- **Threshold**: 2+ strong within 4 scenes
- **Action**: Downgrade later instances to soft
- **Exception**: First strong in cluster is preserved

### Narrative Alignment

- **Peak phases**: Elevate `none` → `soft` if emotion ≥ 5
- **Resolution phases**: Downgrade `strong` → `soft` if emotion < 7

## Testing

```bash
# Run with rhythm analysis
node scripts/generate-all-scenes-with-rhythm.js

# Output will show:
# - Original emphasis
# - Suggested emphasis
# - Adjustment reasons
# - Narrative arc phases
```

## Future Enhancements

Potential additions:

- **Variance targeting** - Aim for specific intensity variance
- **Arc templates** - Different curves for different video types
- **Confidence tuning** - Adjust based on signal strength
- **Multi-pass optimization** - Iterative refinement

---

**Remember**: The Rhythm Controller is a conductor, not a composer. It shapes the performance without rewriting the score.
