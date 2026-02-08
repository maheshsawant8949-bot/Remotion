# ADR-001: Strategy-Based Deterministic Reveal System

## Status

Accepted

## Context

In a generative video system, the "reveal" of elements (how they appear on screen) is critical for viewer engagement and comprehension.
We needed a way to determine _how_ content appears (fade, slide, pop, typewriter, etc.) and _when_ it appears.

The initial problem was that simple hardcoded animations felt repetitive, while purely random animations felt chaotic and unpolished.
We needed a system that improves _cinematic quality_ without sacrificing the _deterministic_ nature of the engine (a core architectural principle).

The challenge was to link the **cognitive weight** of the content to its **cinematic presentation**.

## Decision

We decided to implement a **Strategy-Based Deterministic Reveal System** where the reveal animation is determined by the **Content Strategy** and **Pacing Profile**, not by random selection or hardcoded component logic.

Check `src/pacing-engine/pacing-model.ts` for the implementation of `PACING_PROFILES` and `STRATEGY_PACING_MAP`.

Specifics:

1.  **Strategy-Driven**: The selected strategy (e.g., `shocking_stat`, `emotional_impact`) dictates the allowable reveal styles.
2.  **Pacing-Aware**: The pacing profile (`slow`, `medium`, `fast`) controls the speed and "breathe" of the reveal.
    - `fast` -> `immediate` reveals (cuts, quick pops).
    - `slow` -> `gradual` reveals (slow fades, typewriter).
3.  **Deterministic**: Given the same content and strategy, the reveal is always identical.

## Alternatives Considered

### 1. Randomized Animations per Component

- **Idea**: Each `TextLayer` picks a random animation (fade, slide, zoom) on mount.
- **Pros**: easy to implement, visual variety.
- **Cons**: violates "Determinism First" principle. Hard to debug. "Chaos" rather than "Cinema". No narrative cohesion.

### 2. Hardcoded Best-Guess

- **Idea**: Always use `FadeIn` for text, `ScaleUp` for images.
- **Pros**: Consistency, simple.
- **Cons**: Boring. Doesn't adapt to the _tone_ of the content (a tragedy should not "pop" like a fun fact).

### 3. LLM-Generated Animation Scripts

- **Idea**: Ask the LLM to specify exactly which animation curve to use for every element.
- **Pros**: Infinite flexibility.
- **Cons**: Expensive, hallucinates valid animations, hard to enforce brand consistency, breaks "Renderer Ignorance" if LLM tries to write CSS.

## Why Chosen

The Strategy-Based approach strictly follows our Layered Architecture:

- **Cognitive Layer** determines the "Weight" (Sad/Happy/Urgent).
- **Strategic Layer** picks the "Approach" (Shocking Stat).
- **Cinematic Layer** (this decision) maps that Strategy to a concrete `revealStyle` (`gradual`, `immediate`).

This ensures that the _feeling_ of the animation matches the _meaning_ of the content, which is our "Cognitive Before Cinematic" philosophy.

## Consequences

- **Positive**:
  - Animations always match the narrative tone.
  - System is debuggable (if an animation looks wrong, we check the Strategy, not a random seed).
  - Centralized control via `pacing-model.ts`.
- **Negative**:
  - Adding new animation styles requires registering them in the strategy map; you can't just "use" a new animation in a component without upstream support.
  - Requires strict discipline to not bypass the system for "one-off" cool effects.
