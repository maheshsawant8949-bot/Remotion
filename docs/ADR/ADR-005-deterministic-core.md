# ADR-005: Determinism First Principle

## Status

Accepted

## Context

In generative media, a common problem is "regenerating the same thing twice yields different results."
This makes debugging impossible. If a user sees a glitch in "Scene 5", developers cannot fix it if they cannot reproduce it.
Additionally, we need to be able to "tweak" a specific part of a video (e.g., change one word) without the entire layout reshuffling randomly.

## Decision

We adopted the **Determinism First** principle as a non-negotiable law of the engine.

1.  **Input + Seed = Output**: The output must be a pure function of the input and an explicit seed.
2.  **No `Math.random()`**: All randomness must come from a seeded PRNG (Pseudo-Random Number Generator).
3.  **No Time-Based Logic**: Logic cannot depend on `Date.now()`.
4.  **No External Variability**: The engine cannot query external APIs during the render loop (inputs must be pre-fetched).

## Alternatives Considered

### 1. "Magic" AI Generation

- **Idea**: Let the LLM generate the scene structure on the fly.
- **Pros**: highly creative, capable of surprising results.
- **Cons**: totally un-debuggable. "Hal9000" problem—if it refuses to render text, you can't force it.

### 2. Standard Randomness

- **Idea**: Use `Math.random()` for variety.
- **Pros**: easy.
- **Cons**: Re-rendering a video to fix a typo might accidentally change the background color or layout. This destroys user trust.

## Why Chosen

Determinism is the foundation of a "Professional" tool versus a "Toy".
It allows for:

- **Regression Testing**: We can verify that a code change didn't break existing scenes.
- **Caching**: If inputs haven't changed, we don't need to re-calculate.
- **Collaboration**: User A and User B see the same video given the same project file.

## Consequences

- **Positive**:
  - System is rock-solid and debuggable.
  - Enables "Time Travel" debugging (stepping through decisions).
- **Negative**:
  - Engineers must be disciplined (lint rules against `Math.random()`).
  - "True" variety requires managing seeds, which adds complexity to the state management.
