# Anti-Template Philosophy

## CRITICAL: We Are NOT Building Hollywood Story Structure

### ❌ What We DON'T Do

We do NOT enforce rigid story templates like:

```typescript
// ❌ FORBIDDEN - DO NOT DO THIS
if (sceneIndex === 8) {
  return "peak"; // NO! This is a hard template
}

if (position < 0.2) {
  return "setup"; // NO! This forces structure
}

if (sceneIndex === totalScenes - 1) {
  return "resolution"; // NO! This assumes every video ends the same way
}
```

**Why these are catastrophic:**

- Not all videos have the same structure
- Educational content ≠ Hollywood scripts
- Explainer videos ≠ Three-act structure
- Technical demos ≠ Hero's journey

### ✅ What We DO Instead

We use **signal-based heuristic detection**:

```typescript
// ✅ CORRECT - Signal-based detection
if (input.intentType === "awe_scale") {
  return "peak"; // Intent signal indicates peak
}

if (input.emotionalWeight >= 7) {
  // High emotion suggests peak or escalation
  // Use position as WEAK tiebreaker, not hard rule
  return position > 0.5 ? "peak" : "escalation";
}

// Default to most common phase
return "expansion";
```

## The Correct Model

### 👉 Detect Candidate Peaks

```typescript
// Find scenes that COULD be peaks based on signals
const candidates = NarrativeDetector.findPeakCandidates(inputs);
// Returns: [5, 12, 18] - scenes with high emotion or peak intent
```

### 👉 Elevate the Best

```typescript
// Select the strongest candidate
const bestPeak = NarrativeDetector.selectBestPeak(inputs, candidates);
// Returns: 12 - scene with highest emotional weight
```

### ❌ NOT Force Structure

```typescript
// ❌ WRONG - Forcing structure
const peakIndex = Math.floor(totalScenes * 0.75); // NO!
scenes[peakIndex].emphasis = "strong"; // NO!
```

## Why This Matters

### Example: Educational Video

**Scenario**: 15-scene explainer about quantum computing

**❌ Template Approach (WRONG)**:

- Scene 1-3: Setup (forced)
- Scene 4-7: Expansion (forced)
- Scene 8-11: Escalation (forced)
- Scene 12: Peak (forced at 80% position)
- Scene 13-15: Resolution (forced)

**Result**: Awkward pacing, forced structure, doesn't match content.

**✅ Signal-Based Approach (CORRECT)**:

- Scene 1: Setup (intent: context_setting)
- Scene 2-5: Expansion (medium emotion)
- Scene 6: Peak (intent: awe_scale, emotion: 8)
- Scene 7-10: Expansion (medium emotion)
- Scene 11: Peak (intent: scenario_visualization, emotion: 7)
- Scene 12-15: Expansion (medium emotion)

**Result**: Natural flow, follows content signals, multiple peaks allowed.

## Rules for Avoiding Templates

### 1. Never Use Hard Position Rules

```typescript
// ❌ FORBIDDEN
if (position < 0.2) return "setup";
if (position > 0.8) return "resolution";

// ✅ ALLOWED (as weak tiebreaker only)
if (emotionalWeight >= 7) {
  return position > 0.5 ? "peak" : "escalation";
}
```

### 2. Never Force Scene Counts

```typescript
// ❌ FORBIDDEN
const setupScenes = Math.floor(totalScenes * 0.2);
const peakScene = Math.floor(totalScenes * 0.75);

// ✅ ALLOWED
const peakCandidates = findPeakCandidates(inputs);
const bestPeak = selectBestPeak(inputs, peakCandidates);
```

### 3. Never Assume Structure

```typescript
// ❌ FORBIDDEN
// "Every video must have exactly one peak"
// "Peak must be in the last third"
// "Resolution must be the last scene"

// ✅ ALLOWED
// "Find scenes with peak signals"
// "Elevate the strongest candidate"
// "Allow multiple peaks if signals support it"
```

### 4. Always Prioritize Signals

**Signal Priority (strongest to weakest):**

1. **Intent type** (explicit semantic signal)
2. **Emotional weight** (content-based signal)
3. **Position** (weak tiebreaker only)

```typescript
// Correct priority
if (intentType === "peak")
  return "peak"; // Strongest
else if (emotionalWeight >= 7)
  return "peak"; // Medium
else if (position > 0.8) return "resolution"; // Weakest (tiebreaker)
```

## Testing for Templates

### Red Flags (Delete Immediately)

If you see ANY of these patterns, delete them:

- ❌ `if (sceneIndex === N)` - Hard scene number
- ❌ `if (position === 0.X)` - Hard position percentage
- ❌ `Math.floor(totalScenes * 0.X)` - Forced scene count
- ❌ "always peak at..." - Hard structure rule
- ❌ "first X% is..." - Hard percentage rule
- ❌ "must have exactly N..." - Hard count rule

### Green Flags (Keep These)

- ✅ `if (intentType === 'peak')` - Signal-based
- ✅ `if (emotionalWeight >= 7)` - Signal-based
- ✅ `findCandidates()` then `selectBest()` - Heuristic
- ✅ `position as weak tiebreaker` - Soft guidance
- ✅ "detect candidates" - Flexible
- ✅ "elevate the best" - Adaptive

## Summary

**We are building a heuristic shaping system, not a rigid formula.**

**Correct mindset:**

- 👉 Detect candidate peaks
- 👉 Elevate the best
- 👉 Respect content signals
- 👉 Allow flexible structure

**Wrong mindset:**

- ❌ Force story structure
- ❌ Apply Hollywood templates
- ❌ Assume all videos are the same
- ❌ Use hard position rules

**Remember**: Educational content, explainers, and technical demos are NOT Hollywood scripts. They don't follow three-act structure. Respect the content.
