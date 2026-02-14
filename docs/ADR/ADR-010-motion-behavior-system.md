# ADR-010: Motion Behavior System

**Status**: Accepted  
**Date**: 2026-02-14  
**Context**: Autonomous Visual Narrative Engine

## Context

The system needed a principled approach to control motion intensity across scenes to prevent viewer fatigue and maintain engagement. Without governance, motion behaviors (assertive, energetic) can inflate, creating an exhausting viewing experience.

## Decision

Implement a **Motion Behavior System** with 4 distinct archetypes and strict inflation prevention:

### Motion Archetypes

1. **Calm** (55-70%): Minimal motion, viewer at rest
2. **Technical** (15-25%): Precise, mechanical motion for diagrams/processes
3. **Assertive** (5-12%): Confident, purposeful motion for emphasis
4. **Energetic** (0-5%): High-energy motion for peak moments

### Core Principles

1. **Calm Dominance**: Most scenes default to calm (cognitive recovery)
2. **Inflation Prevention**: Max 25% kinetic motion (assertive + energetic)
3. **Recovery Bias**: After kinetic scenes, bias toward calm
4. **Frequency Governors**: Technical and kinetic behaviors capped globally
5. **Density Override**: High density (≥7) forces calm motion

### Selection Algorithm

```
1. Recovery Bias (if prev = assertive/energetic && emotion < 8)
2. High Density → Calm
3. Process/Diagram → Technical (with 25% frequency cap)
4. Peak Moment (strong emphasis + high emotion) → Energetic (if upward polarity)
5. Emphasis → Assertive
6. Default → Calm
```

## Consequences

### Positive

- **Prevents Fatigue**: Calm dominance ensures viewer recovery
- **Predictable Distribution**: Governors enforce target percentages
- **Explainable**: Each decision traced with clear reasoning
- **Scarcity Creates Impact**: Rare energetic moments feel significant

### Negative

- **Complexity**: Multiple governors and rules to maintain
- **Tuning Required**: Thresholds may need adjustment per content type

## Implementation

- `src/motion-behavior/behavior-resolver.ts`: Selection algorithm
- `src/motion-behavior/motion-principles.ts`: Global constraints
- `src/motion-behavior/behavior-types.ts`: Type definitions

## Validation

**Evaluation Set (26 scenes)**:

- Calm: 65.4% ✅ (Target: 55-70%)
- Technical: 19.2% ✅ (Target: 15-25%)
- Assertive: 15.4% ⚠️ (Target: 5-12%)
- Energetic: 0% ✅ (Target: 0-5%)

**Status**: 3/4 targets met. System stable.
