# Earned Peaks Philosophy

## CRITICAL: Peaks Must Be Earned

### The Problem: Artificial Drama

**Artificial drama is instantly perceptible.**

Users won't know _why_ — but they'll **feel manipulation**.

This destroys trust and engagement.

### The Principle

> **Only elevate scenes that already have strong signals.**  
> **Never create artificial drama.**

## Minimum Thresholds

### For Strong Emphasis

```typescript
const MIN_EMOTION_FOR_STRONG = 6;
```

**Why 6?**

- Emotional weight 6+ indicates genuinely high emotion
- Below 6 = medium emotion, not peak-worthy
- Elevating below 6 to strong = artificial drama

**Example:**

```typescript
// Scene has emotion: 5 (medium)
// ❌ WRONG: Elevate to strong anyway
scene.emphasis = "strong"; // Feels manipulative!

// ✅ CORRECT: Elevate to soft only, or don't elevate
scene.emphasis = "soft"; // Respects the actual emotion
```

### For Soft Emphasis

```typescript
const MIN_EMOTION_FOR_SOFT = 4;
```

**Why 4?**

- Emotional weight 4+ indicates at least medium emotion
- Below 4 = low emotion, shouldn't be elevated at all
- Elevating below 4 = creating drama from nothing

**Example:**

```typescript
// Scene has emotion: 3 (low)
// ❌ WRONG: Elevate anyway to avoid flatline
scene.emphasis = "soft"; // Artificial!

// ✅ CORRECT: Accept the flatline
// If no scene has decent emotion, don't fake it
```

## Real-World Examples

### Example 1: Educational Video (No Drama)

**Scenario**: 20-scene explainer about database indexing

**Emotional weights**: All scenes 2-4 (low to medium)

**❌ Artificial Drama Approach:**

```typescript
// Force a peak at scene 15 even though emotion is only 3
scene15.emphasis = "strong"; // WRONG!
// Result: Feels manipulative, users sense something is off
```

**✅ Earned Peak Approach:**

```typescript
// No scene has emotion >= 6
// Accept that this is a calm, educational video
// All scenes remain 'none' or 'soft'
// Result: Natural, trustworthy, appropriate for content
```

### Example 2: Documentary (Genuine Drama)

**Scenario**: 25-scene documentary about climate change

**Emotional weights**:

- Scenes 1-10: 3-5 (setup, facts)
- Scene 11: 8 (crisis revelation)
- Scenes 12-20: 4-6 (implications)
- Scene 21: 7 (call to action)

**✅ Earned Peak Approach:**

```typescript
// Scene 11: emotion 8 >= 6 → strong (EARNED)
scene11.emphasis = "strong";

// Scene 21: emotion 7 >= 6 → strong (EARNED)
scene21.emphasis = "strong";

// Other scenes: emotion < 6 → soft or none
// Result: Peaks feel natural, aligned with content
```

## Why This Matters

### User Perception

**Artificial drama triggers subconscious red flags:**

| What Happens                 | User Feels              | Result                  |
| ---------------------------- | ----------------------- | ----------------------- |
| Emphasis matches emotion     | "This is important"     | Trust, engagement       |
| Emphasis exceeds emotion     | "I'm being manipulated" | Distrust, disengagement |
| Flat content forced dramatic | "This feels fake"       | Skepticism              |

### The Uncanny Valley of Emphasis

Just like the uncanny valley in animation, there's an uncanny valley in emphasis:

```
Too little emphasis → Boring but honest
Appropriate emphasis → Engaging and trustworthy
Too much emphasis → Manipulative and off-putting
```

**The sweet spot**: Match emphasis to actual emotional signals.

## Implementation Rules

### Rule 1: Minimum Thresholds

```typescript
// ALWAYS check thresholds before elevation
if (emotion >= MIN_EMOTION_FOR_STRONG) {
  // Elevation is earned
  emphasis = "strong";
} else if (emotion >= MIN_EMOTION_FOR_SOFT) {
  // Partial elevation is earned
  emphasis = "soft";
} else {
  // NO ELEVATION - accept reality
  // Don't create fake drama
}
```

### Rule 2: Accept Flatlines

```typescript
// If 12+ scenes have no strong emphasis
// AND no scene has emotion >= 6
// ✅ CORRECT: Accept the flatline
// ❌ WRONG: Force a peak anyway

if (flatlineDetected) {
  const bestCandidate = findStrongestCandidate();
  if (bestCandidate.emotion >= MIN_EMOTION_FOR_STRONG) {
    // Elevation is earned
    elevate(bestCandidate);
  } else {
    // NO ELEVATION
    // This content is genuinely calm - respect that
  }
}
```

### Rule 3: Log Earned Status

```typescript
// ALWAYS indicate whether elevation was earned
if (elevated) {
  scene.adjustmentReason = `Elevated to strong (emotion: ${emotion} - EARNED)`;
} else {
  scene.adjustmentReason = `Not elevated (emotion: ${emotion} - insufficient)`;
}
```

## Testing for Artificial Drama

### Red Flags

If you see ANY of these, you're creating artificial drama:

- ❌ Elevating scenes with emotion < 4 to soft
- ❌ Elevating scenes with emotion < 6 to strong
- ❌ "Force a peak to avoid flatline" without checking emotion
- ❌ "Every video needs a peak" mentality
- ❌ Ignoring minimum thresholds

### Green Flags

These indicate earned peaks:

- ✅ Checking `emotion >= MIN_THRESHOLD` before elevation
- ✅ Accepting flatlines when no scene qualifies
- ✅ Logging emotion values in adjustment reasons
- ✅ "Elevation is earned" comments in code
- ✅ Respecting content's natural emotional arc

## Summary

**Peaks must be earned through strong signals, not artificially created.**

### Minimum Thresholds:

- **Strong emphasis**: emotion ≥ 6 (high)
- **Soft emphasis**: emotion ≥ 4 (medium)
- **No elevation**: emotion < 4 (low)

### Philosophy:

- ✅ Respect the content's natural emotional arc
- ✅ Accept flatlines if no scene qualifies
- ✅ Match emphasis to actual signals
- ❌ Never create artificial drama
- ❌ Never force peaks where they don't belong

### Why:

**Artificial drama is instantly perceptible.**  
**Users feel manipulation, even if they can't articulate why.**  
**Trust is destroyed, engagement drops.**

**Earned peaks feel natural. Artificial peaks feel fake.**
