# Cognitive Recovery

## The Director-Level Principle

> **Great storytelling alternates tension and relief.**

### The Pattern

```
Tension → Relief → Tension → Relief
```

**NOT:**

```
Tension → Tension → Tension → Exhaustion
```

## Why Recovery Matters

### Breathing Room Increases Perceived Drama

**Counterintuitive truth:**

- More peaks ≠ More drama
- Constant tension = Numbness
- **Recovery makes peaks feel stronger**

### The Contrast Effect

```
Peak → Recovery → Peak
     ↑           ↑
   Feels 2x stronger because of contrast
```

```
Peak → Peak → Peak
     ↑     ↑     ↑
   Each feels weaker (no contrast)
```

## The Heuristic

> **After a strong emphasis → prefer a calmer scene unless signals demand otherwise.**

### Implementation

```typescript
// Scene follows strong emphasis
if (previousScene.emphasis === "strong") {
  // Recovery is beneficial

  // UNLESS current scene has very strong signals
  if (currentEmotion >= 7) {
    // Strong signals override recovery (earned peak)
    allowEmphasis();
  } else {
    // Provide breathing room
    downgradeToNone();
  }
}
```

### Override Threshold

```typescript
const OVERRIDE_THRESHOLD = 7; // Very high emotion
```

**Why 7?**

- Emotion 7+ = genuinely exceptional moment
- Deserves emphasis even after strong scene
- Lower emotion = recovery is more valuable

## Real-World Examples

### Example 1: Documentary (Good Recovery)

```
Scene 1: Setup (none)
Scene 2: Context (soft)
Scene 3: Crisis reveal (strong) ← Peak
Scene 4: Aftermath (none)        ← RECOVERY
Scene 5: Analysis (soft)
Scene 6: Solution (strong)       ← Peak
Scene 7: Reflection (none)       ← RECOVERY
```

**Result:**

- Peaks feel impactful
- Viewer has time to process
- Natural rhythm

### Example 2: Documentary (Poor Recovery)

```
Scene 1: Setup (none)
Scene 2: Context (soft)
Scene 3: Crisis reveal (strong) ← Peak
Scene 4: Another crisis (strong) ← No recovery!
Scene 5: More tension (strong)   ← Still no recovery!
Scene 6: Solution (strong)       ← Exhaustion
```

**Result:**

- Peaks blur together
- Viewer fatigue
- Diminished impact

### Example 3: Educational Video (Natural Recovery)

```
Scene 1: Introduction (none)
Scene 2: Concept A (soft)
Scene 3: Key insight (strong)    ← Peak
Scene 4: Example (none)          ← RECOVERY
Scene 5: Concept B (soft)
Scene 6: Application (strong)    ← Peak
Scene 7: Summary (none)          ← RECOVERY
```

**Result:**

- Clear learning moments
- Time to absorb
- Effective teaching

## Recovery Detection

### Is Recovery Needed?

```typescript
function isRecoveryNeeded(sceneIndex, scenes, emotionalWeights) {
  // Check if previous scene was strong
  const prevWasStrong = scenes[sceneIndex - 1].emphasis === "strong";

  if (!prevWasStrong) return false;

  // Previous was strong - recovery is beneficial
  // UNLESS current has very strong signals
  const currentEmotion = emotionalWeights[sceneIndex];

  if (currentEmotion >= 7) {
    return false; // Strong signals override
  }

  return true; // Recovery needed
}
```

### Enforcement

```typescript
// After strong emphasis
if (isRecoveryNeeded(i, scenes, emotionalWeights)) {
  // Downgrade to provide breathing room
  scene.emphasis = "none";
  scene.adjustmentReason =
    "[RECOVERY] Downgraded to provide cognitive recovery after strong emphasis";
}
```

## Alternation Quality

### Metrics

```typescript
{
  consecutiveStrongCount: 2,     // Max consecutive strong scenes
  recoveryMoments: 3,            // Number of recovery moments
  quality: 'good'                // Overall alternation quality
}
```

### Quality Levels

| Quality       | Consecutive Strong | Recovery Moments | Impact                       |
| ------------- | ------------------ | ---------------- | ---------------------------- |
| **Excellent** | 1                  | 3+               | Perfect alternation          |
| **Good**      | 1                  | 1-2              | Decent alternation           |
| **Fair**      | 2                  | 1+               | Some consecutive tension     |
| **Poor**      | 3+                 | Any              | Too much consecutive tension |

## Why This Is Director-Level

### Film Directors Know This

**Classic three-act structure:**

```
Act 1: Setup (calm)
Act 2a: Rising tension
Act 2b: Midpoint (peak)
Act 2c: Recovery / Regrouping  ← BREATHING ROOM
Act 3a: Final confrontation (peak)
Act 3b: Resolution (calm)
```

**The recovery in Act 2c:**

- Makes Act 3a feel more intense
- Gives audience time to process
- Builds anticipation
- Prevents exhaustion

### Music Composition Analogy

```
Verse (calm)
Chorus (peak)
Verse (calm)     ← RECOVERY
Bridge (build)
Chorus (peak)
Outro (calm)     ← RECOVERY
```

**Without recovery:**

```
Chorus → Chorus → Chorus → Listener fatigue
```

## Testing for Recovery

### Red Flags

If you see ANY of these, recovery is violated:

- ❌ 3+ consecutive strong scenes
- ❌ No recovery after any strong scene
- ❌ Alternation quality: "poor"
- ❌ Viewer feedback: "exhausting", "too much"

### Green Flags

These indicate good recovery:

- ✅ Max 1-2 consecutive strong scenes
- ✅ Recovery after most strong scenes
- ✅ Alternation quality: "good" or "excellent"
- ✅ Viewer feedback: "engaging", "well-paced"

## Integration

### Pipeline Position

```
1. Fix flatlines
2. Fix clustering
3. Align with narrative arc
4. COGNITIVE RECOVERY ← Enforce tension/relief
5. Scarcity protection
```

**Why before scarcity?**

- Recovery may downgrade scenes
- Scarcity is final pass (counts strong scenes)
- Order matters for determinism

## Summary

**Great storytelling alternates tension and relief.**

### The Heuristic:

- After strong emphasis → prefer calmer scene
- Unless signals demand otherwise (emotion >= 7)

### Why:

- **Breathing room increases perceived drama**
- Contrast makes peaks feel stronger
- Prevents viewer fatigue
- Natural rhythm

### Implementation:

- Detect recovery needs (after strong)
- Downgrade unless very strong signals
- Validate alternation quality

**This is a director-level principle. Respect it.**
