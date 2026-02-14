# ADR-011: Transition Intelligence Layer

**Status**: Accepted  
**Date**: 2026-02-14  
**Context**: Autonomous Visual Narrative Engine

## Context

Scene transitions significantly impact pacing and viewer comfort. Without governance, aggressive transitions (firm) can create jarring, uncomfortable viewing experiences. The system needed intelligent transition selection based on motion changes and emotional context.

## Decision

Implement a **Transition Intelligence Layer** with 4 transition types and strict governance:

### Transition Types

1. **Soft** (Default): Gentle, comfortable transitions
2. **Firm**: Assertive transitions for energy increases
3. **Release**: Gentle deceleration for energy drops
4. **Minimal**: Nearly invisible for technical continuity

### Selection Rules

```
1. Base Mapping:
   - calm → assertive: Firm
   - assertive/energetic → calm: Release
   - technical → technical: Minimal
   - Default: Soft

2. Constraints (Override Base):
   - High Density (≥7): Force Soft (cognitive load)
   - Peak Scene: Force Soft (content carries intensity)
   - Consecutive Firm: Force Soft (anti-aggression)
   - Firm Cap (15%): Force Soft (frequency limit)
```

### Governance Principles

1. **Soft Dominance**: Most transitions are soft (comfortable default)
2. **Firm Scarcity**: Max 15-18% firm transitions
3. **Consecutive Prevention**: Never allow consecutive firm transitions
4. **Density Sensitivity**: High cognitive load forces soft transitions
5. **Peak Deference**: Peak moments use soft transitions (content carries weight)

## Consequences

### Positive

- **Comfortable Pacing**: Soft dominance prevents jarring experiences
- **Intentional Firmness**: Rare firm transitions feel purposeful
- **Cognitive Awareness**: Density constraint prevents overload
- **Explainable**: Each decision traced with clear reasoning

### Negative

- **Reduced Dynamism**: Firm cap may limit aggressive pacing
- **Complexity**: Multiple override rules to maintain

## Implementation

- `src/transition-intelligence/transition-resolver.ts`: Selection algorithm
- `src/transition-intelligence/transition-rules.ts`: Rule definitions
- `src/transition-intelligence/transition-types.ts`: Type definitions

## Validation

**Evaluation Set (26 scenes)**:

- Soft: 84.6% ✅ (Dominant)
- Firm: 11.5% ✅ (Target: ≤15-18%)
- Release: 0.0%
- Minimal: 3.8%

**Governance**:

- 0 consecutive firm transitions ✅
- Firm cap respected ✅

**Status**: All targets met. System stable.
