# Rhythm Controller Boundaries

## CRITICAL: What Rhythm Can and Cannot Do

### ✅ ALLOWED Operations

Rhythm Controller is **ONLY** allowed to:

1. **Upgrade emphasis**
   - `none` → `soft`
   - `soft` → `strong`
   - `none` → `strong`

2. **Downgrade emphasis**
   - `strong` → `soft`
   - `soft` → `none`
   - `strong` → `none`

3. **Spread intensity**
   - Analyze sequence-level patterns
   - Suggest adjustments for better flow
   - Balance emphasis distribution

### ❌ FORBIDDEN Operations

Rhythm Controller is **NEVER** allowed to:

1. **❌ Change layouts**

   ```typescript
   // FORBIDDEN
   scene.layout = "hero"; // NO!
   ```

2. **❌ Change strategy**

   ```typescript
   // FORBIDDEN
   scene.strategy = "diagram"; // NO!
   ```

3. **❌ Change density**

   ```typescript
   // FORBIDDEN
   scene.densityScore = 7; // NO!
   ```

4. **❌ Rewrite scene content**

   ```typescript
   // FORBIDDEN
   scene.text = 'new text'; // NO!
   scene.duration = 10; // NO!
   scene.layers = [...]; // NO!
   ```

5. **❌ Override grammar rules**
   ```typescript
   // FORBIDDEN
   scene.grammarVersion = '2.0'; // NO!
   scene.allowedRegions = [...]; // NO!
   ```

## Enforcement Mechanisms

### 1. Input Validation

```typescript
// Rhythm receives READ-ONLY metadata
const rhythmInput: RhythmInput = {
  sceneIndex: 5,
  emphasis: "soft", // ✅ Can read
  emotionalWeight: 6, // ✅ Can read
  strategy: "diagram", // ✅ Can read (but NOT modify)
  intentType: "explanation", // ✅ Can read (but NOT modify)
};

// Rhythm does NOT receive mutable scene references
// It cannot access scene.layout, scene.layers, etc.
```

### 2. Output Validation

```typescript
// Rhythm output contains ONLY emphasis adjustments
const rhythmOutput: RhythmAnalysis = {
  scenes: [
    {
      sceneIndex: 5,
      originalEmphasis: "soft", // ✅ Read-only
      suggestedEmphasis: "strong", // ✅ Adjustment
      intensity: "high", // ✅ Derived
      narrativePhase: "peak", // ✅ Metadata
      adjustmentReason: "...", // ✅ Explanation
    },
  ],
  // NO strategy, layout, or density fields allowed
};
```

### 3. Boundary Enforcer

The `RhythmBoundary` class validates:

- ✅ Input contains only read-only metadata
- ✅ Output contains only emphasis adjustments
- ✅ No forbidden properties are modified

```typescript
// Automatic validation
const analysis = RhythmConductor.conduct(inputs);
// ↑ Throws error if boundaries are violated
```

## Why These Boundaries?

### Separation of Concerns

Each layer has a specific responsibility:

| Layer                  | Responsibility     | Can Modify          |
| ---------------------- | ------------------ | ------------------- |
| **Emotional Analyzer** | Detect emotion     | Emotional weight    |
| **Strategy Engine**    | Choose layout      | Strategy, layout    |
| **Density Controller** | Measure complexity | Density score       |
| **Reveal Resolver**    | Choose reveal      | Reveal strategy     |
| **Emphasis Resolver**  | Choose emphasis    | Emphasis level      |
| **Rhythm Controller**  | Balance sequence   | Emphasis level ONLY |

### Preventing Catastrophic Mistakes

**Most common mistake**: Rhythm trying to "fix" strategy decisions.

```typescript
// ❌ CATASTROPHIC MISTAKE
if (scene.emphasis === "strong" && scene.strategy === "title") {
  scene.strategy = "hero"; // NO! This breaks everything!
}
```

**Why this is catastrophic:**

1. Violates grammar rules (hero has different allowed regions)
2. Breaks scene compilation (layers won't match layout)
3. Destroys architectural separation
4. Makes debugging impossible

### The Conductor Metaphor

> **Think: Conductor — not composer.**

A conductor:

- ✅ Adjusts tempo (emphasis intensity)
- ✅ Balances sections (sequence flow)
- ✅ Shapes dynamics (intensity distribution)

A conductor does NOT:

- ❌ Rewrite the score (strategy)
- ❌ Change instrumentation (layout)
- ❌ Alter the composition (content)

## Validation Examples

### ✅ Valid Rhythm Adjustment

```typescript
const analysis = RhythmConductor.conduct([
  { sceneIndex: 0, emphasis: "none", emotionalWeight: 5, strategy: "title" },
  { sceneIndex: 1, emphasis: "none", emotionalWeight: 6, strategy: "hero" },
  // ... 10 more scenes with 'none' emphasis
]);

// Rhythm detects flatline and suggests:
// Scene 5: none → soft (elevation to prevent monotony)
// ✅ VALID: Only changed emphasis
```

### ❌ Invalid Rhythm Adjustment

```typescript
// This would throw an error:
const badOutput = {
  scenes: [
    {
      sceneIndex: 5,
      originalEmphasis: "none",
      suggestedEmphasis: "soft",
      strategy: "hero", // ❌ FORBIDDEN! Cannot modify strategy
    },
  ],
};

RhythmBoundary.validateOutput(badOutput);
// Throws: "Rhythm boundary violation: Attempted to modify forbidden properties"
```

## Integration Checklist

When integrating Rhythm Controller:

- [ ] Use `RhythmBoundary.createSafeInput()` to create read-only inputs
- [ ] Never pass mutable scene references to rhythm
- [ ] Only apply `suggestedEmphasis` changes (nothing else)
- [ ] Log all rhythm adjustments for transparency
- [ ] Validate output with `RhythmBoundary.validateOutput()`

## Summary

**Rhythm Controller has ONE job: Adjust emphasis levels to improve sequence flow.**

It does this by:

- ✅ Analyzing patterns (flatlines, clustering, arcs)
- ✅ Suggesting emphasis adjustments
- ✅ Respecting all architectural boundaries

It NEVER:

- ❌ Changes strategy, layout, or density
- ❌ Overrides grammar rules
- ❌ Rewrites scene content

**Violating these boundaries is a catastrophic mistake that breaks the entire system.**
