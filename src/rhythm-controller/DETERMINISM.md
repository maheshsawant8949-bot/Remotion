# Determinism Guarantee

## CRITICAL: Rhythm Must Remain Deterministic

### The Rule

> **DO NOT introduce randomness. Ever.**

### Why This Matters

**Random intensity destroys editorial trust.**

If two runs produce different dramatic structure:

- ❌ Your engine becomes un-debuggable
- ❌ Users lose trust in the system
- ❌ A/B testing becomes impossible
- ❌ Regression detection fails
- ❌ Editorial review is meaningless

**Elite systems are explainable. Always.**

## Determinism Requirements

### Same Input → Same Output

```typescript
// ✅ DETERMINISTIC
const result1 = RhythmConductor.conduct(inputs);
const result2 = RhythmConductor.conduct(inputs);
// result1 === result2 (always, guaranteed)

// ❌ NON-DETERMINISTIC (FORBIDDEN)
const result1 = RhythmConductor.conduct(inputs);
const result2 = RhythmConductor.conduct(inputs);
// result1 !== result2 (different on each run - UNACCEPTABLE)
```

### Forbidden Operations

The following operations are **ABSOLUTELY FORBIDDEN** in rhythm controller:

#### 1. Random Number Generation

```typescript
// ❌ FORBIDDEN
Math.random();
Math.floor(Math.random() * n);
_.sample(array); // Uses random internally
_.shuffle(array); // Uses random internally
```

#### 2. Time-Based Operations

```typescript
// ❌ FORBIDDEN
Date.now();
new Date();
performance.now();
```

#### 3. Non-Deterministic Sorting

```typescript
// ❌ FORBIDDEN - Unstable sort without tiebreaker
array.sort((a, b) => a.value - b.value);
// If a.value === b.value, order is undefined!

// ✅ ALLOWED - Stable sort with tiebreaker
array.sort((a, b) => {
  if (a.value !== b.value) return a.value - b.value;
  return a.index - b.index; // Deterministic tiebreaker
});
```

#### 4. Object Key Iteration (Unordered)

```typescript
// ❌ FORBIDDEN - Object key order is not guaranteed
for (const key in object) { ... }
Object.keys(object).forEach(...)

// ✅ ALLOWED - Explicit ordering
const sortedKeys = Object.keys(object).sort();
sortedKeys.forEach(key => { ... });
```

#### 5. Set/Map Iteration (Insertion Order)

```typescript
// ⚠️  CAREFUL - Depends on insertion order
for (const item of set) { ... }

// ✅ SAFER - Convert to array and sort
const sortedItems = Array.from(set).sort();
sortedItems.forEach(item => { ... });
```

## Current Determinism Status

### ✅ Guaranteed Deterministic

All rhythm controller operations are deterministic:

1. **Narrative Detection**
   - Signal-based (intent type, emotional weight)
   - Position-based (scene index / total)
   - No randomness

2. **Intensity Analysis**
   - Flatline detection (consecutive count)
   - Clustering detection (window scan)
   - Strongest candidate selection (max emotion)
   - No randomness

3. **Scarcity Protection**
   - Sort by emotional weight (stable)
   - Downgrade weakest (deterministic)
   - No randomness

4. **Rhythm Conductor**
   - Sequential processing
   - Deterministic adjustments
   - No randomness

### Determinism Validation

```typescript
// Test: Same input produces same output
const inputs = [...]; // Fixed input
const result1 = RhythmConductor.conduct(inputs);
const result2 = RhythmConductor.conduct(inputs);

// Assert: Results are identical
expect(result1).toEqual(result2); // ✅ Always passes
```

## Why Determinism Is Critical

### 1. Debuggability

**Non-deterministic:**

```
User: "Scene 5 has wrong emphasis"
Dev: "I can't reproduce it - it's different every time"
User: "This is unusable"
```

**Deterministic:**

```
User: "Scene 5 has wrong emphasis"
Dev: "I see it - scene 5 emotion is 5.2, threshold is 6"
Dev: "Fixed by adjusting threshold"
User: "Perfect, I can verify the fix"
```

### 2. Editorial Trust

**Non-deterministic:**

```
Editor reviews video → Approves
System regenerates → Different peaks
Editor: "This isn't what I approved!"
Trust destroyed.
```

**Deterministic:**

```
Editor reviews video → Approves
System regenerates → Identical peaks
Editor: "Perfect, exactly as approved"
Trust maintained.
```

### 3. Regression Testing

**Non-deterministic:**

```
Test: "Scene 5 should have strong emphasis"
Run 1: ✅ Pass (scene 5 is strong)
Run 2: ❌ Fail (scene 5 is soft)
Run 3: ✅ Pass (scene 5 is strong)
Useless test - can't detect real regressions
```

**Deterministic:**

```
Test: "Scene 5 should have strong emphasis"
Run 1: ✅ Pass
Run 2: ✅ Pass
Run 3: ✅ Pass
If it ever fails → Real regression detected
```

### 4. A/B Testing

**Non-deterministic:**

```
Test A: Old algorithm
Test B: New algorithm
Problem: Can't compare because each run is different
Can't isolate algorithm change from random variation
```

**Deterministic:**

```
Test A: Old algorithm (same every time)
Test B: New algorithm (same every time)
Clear comparison: Algorithm change impact isolated
```

## Testing for Non-Determinism

### Red Flags

If you see ANY of these, you've introduced non-determinism:

- ❌ `Math.random()` anywhere in rhythm code
- ❌ `Date.now()` or time-based logic
- ❌ Sorting without stable tiebreaker
- ❌ Different output on same input
- ❌ "It works sometimes" bugs

### Green Flags

These indicate determinism is maintained:

- ✅ All sorting has explicit tiebreakers
- ✅ All decisions based on input data only
- ✅ Same input always produces same output
- ✅ Bugs are 100% reproducible
- ✅ Tests never flake

## Enforcement

### Code Review Checklist

Before merging any rhythm controller changes:

- [ ] No `Math.random()` calls
- [ ] No `Date.now()` or time-based logic
- [ ] All sorting has stable tiebreakers
- [ ] All decisions based on input data only
- [ ] Determinism test passes

### Determinism Test

```typescript
// Add to test suite
describe("Rhythm Controller Determinism", () => {
  it("produces identical output for identical input", () => {
    const inputs = createTestInputs();

    const result1 = RhythmConductor.conduct(inputs);
    const result2 = RhythmConductor.conduct(inputs);
    const result3 = RhythmConductor.conduct(inputs);

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });

  it("produces different output for different input", () => {
    const inputs1 = createTestInputs({ emotion: 5 });
    const inputs2 = createTestInputs({ emotion: 7 });

    const result1 = RhythmConductor.conduct(inputs1);
    const result2 = RhythmConductor.conduct(inputs2);

    expect(result1).not.toEqual(result2);
  });
});
```

## Examples of Deterministic Design

### Example 1: Strongest Candidate Selection

```typescript
// ✅ DETERMINISTIC
static findStrongestCandidate(
  start: number,
  end: number,
  emotionalWeights: number[],
  emphasisLevels: EmphasisLevelName[]
): number {
  let strongestIndex = start;
  let strongestWeight = emotionalWeights[start];

  for (let i = start + 1; i <= end; i++) {
    // Deterministic comparison
    if (emotionalWeights[i] > strongestWeight) {
      strongestWeight = emotionalWeights[i];
      strongestIndex = i;
    }
    // If weights are equal, keep first (deterministic tiebreaker)
  }

  return strongestIndex;
}
```

### Example 2: Scarcity Downgrade

```typescript
// ✅ DETERMINISTIC
static enforceScarcity(scenes: SceneRhythm[], emotionalWeights: number[]) {
  // Sort by emotion (stable)
  const sortedByEmotion = [...strongScenes].sort((a, b) => {
    // Primary sort: emotion
    if (a.emotion !== b.emotion) {
      return a.emotion - b.emotion;
    }
    // Tiebreaker: scene index (deterministic)
    return a.index - b.index;
  });

  // Downgrade weakest (deterministic order)
  for (let i = 0; i < excessCount; i++) {
    sortedByEmotion[i].scene.suggestedEmphasis = 'soft';
  }
}
```

## Summary

**Rhythm controller MUST remain deterministic.**

### Requirements:

- ✅ Same input → Same output (always)
- ✅ No randomness (Math.random forbidden)
- ✅ No time-based logic (Date.now forbidden)
- ✅ Stable sorting (explicit tiebreakers)
- ✅ 100% reproducible behavior

### Why:

- **Debuggability** - Can reproduce and fix bugs
- **Editorial trust** - Approved output stays approved
- **Regression testing** - Can detect real regressions
- **A/B testing** - Can isolate algorithm changes

### Enforcement:

- Code review checklist
- Determinism tests
- No exceptions, ever

**Elite systems are explainable. Always.**
