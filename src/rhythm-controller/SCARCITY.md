# Scarcity Protection

## The Golden Rule

> **Strong emphasis should rarely exceed 10-15% of scenes.**

This is not arbitrary. This is **cinematic physiology**.

## The Science

### For a 26-scene video:

- **2-4 peaks** is ideal
- **More than 4** = fatigue (everything feels important, nothing is)
- **Less than 2** = flat (no peaks, monotonous)

### The Math

```
10% of 26 scenes = 2.6 → 3 peaks (minimum)
15% of 26 scenes = 3.9 → 4 peaks (maximum)
12% of 26 scenes = 3.1 → 3 peaks (target)
```

## Why This Matters

### The Fatigue Zone (>15%)

**What happens:**

- Viewer becomes desensitized
- Peaks lose their special nature
- "Everything is important" = nothing is important
- Emotional exhaustion sets in

**Example:**

```
26 scenes, 6 strong emphasis (23%)
↓
Viewer: "Why is everything dramatic?"
Result: Disengagement, fatigue
```

### The Flat Zone (<10%)

**What happens:**

- No peaks to anchor attention
- Monotonous flow
- Viewer loses interest
- No memorable moments

**Example:**

```
26 scenes, 1 strong emphasis (4%)
↓
Viewer: "This is all the same..."
Result: Boredom, drop-off
```

### The Sweet Spot (10-15%)

**What happens:**

- Peaks feel special and earned
- Viewer stays engaged
- Memorable moments stand out
- Natural rhythm maintained

**Example:**

```
26 scenes, 3 strong emphasis (12%)
↓
Viewer: "These moments matter"
Result: Engagement, retention
```

## Implementation

### Automatic Enforcement

```typescript
// After all other adjustments, enforce scarcity
const scarcityResult = ScarcityProtector.enforceScarcity(
  scenes,
  emotionalWeights,
);

// If we have 6 strong emphasis but max is 4:
// - Sort by emotional weight
// - Downgrade the 2 weakest to soft
// - Result: 4 strong (within limits)
```

### Downgrade Strategy

When we have too many strong emphasis:

1. **Count** current strong emphasis
2. **Calculate** excess (current - max)
3. **Sort** strong scenes by emotional weight (weakest first)
4. **Downgrade** weakest excess scenes to soft

**Why downgrade weakest?**

- Strongest peaks are most earned
- Weakest peaks are borderline anyway
- Preserves the most impactful moments

### Example

```typescript
// 26 scenes, 6 strong emphasis (23% - FATIGUE ZONE)
const strongScenes = [
  { index: 5, emotion: 6.2 }, // Weakest
  { index: 8, emotion: 6.5 }, // ↓
  { index: 12, emotion: 7.1 }, // Keep
  { index: 15, emotion: 7.8 }, // Keep
  { index: 20, emotion: 8.2 }, // Keep
  { index: 23, emotion: 8.5 }, // Strongest - Keep
];

// Max allowed: 4 (15%)
// Excess: 2

// Downgrade weakest 2:
// Scene 5: strong → soft (emotion 6.2)
// Scene 8: strong → soft (emotion 6.5)

// Result: 4 strong (15% - IDEAL)
```

## Scarcity Report

The system provides a scarcity report:

```typescript
{
  strongCount: 3,
  percentage: 11.5,
  ideal: { min: 3, max: 4, target: 3 },
  status: 'ideal',
  recommendation: 'Peak count (3) is in ideal range.'
}
```

### Status Levels

| Status      | Percentage | Meaning        |
| ----------- | ---------- | -------------- |
| **flat**    | <10%       | Too few peaks  |
| **ideal**   | 10-15%     | Perfect range  |
| **fatigue** | >15%       | Too many peaks |

## Real-World Examples

### Example 1: Educational Video (20 scenes)

**Ideal range**: 2-3 peaks (10-15%)

```typescript
// Scenario A: 1 peak (5%) - FLAT
Status: Too few peaks
Impact: Monotonous, no memorable moments
Fix: Elevate 1-2 more strong candidates

// Scenario B: 2 peaks (10%) - IDEAL
Status: Perfect
Impact: Engaged, peaks feel special

// Scenario C: 5 peaks (25%) - FATIGUE
Status: Too many peaks
Impact: Desensitized, everything feels dramatic
Fix: Downgrade 2-3 weakest to soft
```

### Example 2: Documentary (30 scenes)

**Ideal range**: 3-4 peaks (10-13%)

```typescript
// Scenario A: 2 peaks (7%) - FLAT
Status: Too few peaks
Impact: Lacks impact moments
Fix: Elevate 1-2 more strong candidates

// Scenario B: 4 peaks (13%) - IDEAL
Status: Perfect
Impact: Well-paced, impactful

// Scenario C: 7 peaks (23%) - FATIGUE
Status: Too many peaks
Impact: Viewer exhaustion
Fix: Downgrade 3-4 weakest to soft
```

## Cinematic Physiology

### Why 10-15%?

This range is based on:

1. **Attention span research**
   - Humans can maintain peak attention for ~10-15% of duration
   - More frequent peaks = diminishing returns

2. **Emotional capacity**
   - Emotional responses require recovery time
   - Too frequent = desensitization
   - Too rare = disengagement

3. **Memory formation**
   - 3-4 peaks per video = optimal for recall
   - More = interference, less = insufficient anchors

4. **Cinematic convention**
   - Hollywood films: ~10-12% of runtime at peak intensity
   - Documentaries: ~8-12%
   - Educational content: ~10-15%

### The Scarcity Principle

> **Scarcity creates value.**

When strong emphasis is rare:

- ✅ Each peak feels special
- ✅ Viewer anticipates peaks
- ✅ Peaks create memorable moments
- ✅ Natural rhythm maintained

When strong emphasis is common:

- ❌ Peaks lose impact
- ❌ Viewer becomes numb
- ❌ Nothing stands out
- ❌ Fatigue sets in

## Testing

### Red Flags

If you see ANY of these, scarcity is violated:

- ❌ Strong emphasis >15% of scenes
- ❌ More than 4 peaks in a 26-scene video
- ❌ Strong emphasis every 3-4 scenes
- ❌ "Everything is important" feeling

### Green Flags

These indicate healthy scarcity:

- ✅ Strong emphasis 10-15% of scenes
- ✅ 2-4 peaks in a 26-scene video
- ✅ Strong emphasis every 6-8 scenes
- ✅ Peaks feel special and earned

## Summary

**The golden rule: Strong emphasis should rarely exceed 10-15% of scenes.**

### For a 26-scene video:

- **Minimum**: 3 peaks (10%)
- **Target**: 3 peaks (12%)
- **Maximum**: 4 peaks (15%)

### Why:

- **More** = fatigue, desensitization
- **Less** = flat, monotonous
- **10-15%** = ideal, peaks feel special

### Enforcement:

- Automatic downgrade of weakest excess peaks
- Scarcity report with warnings
- Preserves strongest, most earned peaks

**This is cinematic physiology. Respect it.**
