# ADR-007: Rule-Based Cognition for Weight Detection

## Status

Accepted

## Context

We needed a way to detect "Emotional Weight" to drive pacing and visual emphasis.
Initially, one might think this means "Sentiment Analysis" (Happy vs. Sad).
**However, Emotional Weight is NOT emotion detection.**
It is **Narrative Importance Estimation**.

A sentence like "The trajectory is off by 0.001 degrees" is emotionally neutral (no sad words), but in a space launch context, it represents a **Critical Consequence**.
Standard sentiment analysis would miss this completely.

## Architectural Constraints (Non-Negotiable)

To ensure pacing stability and debugging sanity, this system is bound by the following rules:

1.  **NO Sentiment APIs**: We do not use external black-box classifiers.
2.  **NO LLM calls**: Weight calculation must happen in <1ms without network latency.
3.  **NO Probabilistic Weight**: The same text MUST always yield the exact same score.
4.  **NO Hidden Logic**: All scoring rules must be visible in `weight-rules.ts`.

## Decision

We chose a **Rule-Based, Deterministic Narrative Importance Engine**.
The system detects specific "Signals" that imply importance, not just emotion.

### Core Signals & Families:

#### 1. Scale Signals (Weight: 1.5)

- **Keywords**: million, billion, thousands, every second, per day.
- **Meaning**: Implies magnitude or frequency.

#### 2. Contrast Signals (Weight: 1.0)

- **Keywords**: but, however, instead, yet.
- **Meaning**: Implies a pivot in narrative direction.

#### 3. Scarcity Signals (Weight: 1.2)

- **Keywords**: only, just, less than, merely.
- **Meaning**: Implies value due to limited availability.

#### 4. Human Impact Signals (Weight: 2.0)

- **Keywords**: people, lives, children, families.
- **Meaning**: Implies emotional connection to human suffering or joy.

#### 5. Irreversibility Signals (Weight: 2.5)

- **Keywords**: never, cannot be undone, permanent.
- **Meaning**: Implies high stakes and lasting consequence.

We use linguistic heuristics (word lookups, pattern matching) to map text to these signals.

- "One truckload every minute" -> Signal: **Scale** -> Weight: **High**.
- "However, we failed." -> Signal: **Contrast** + **Consequence** -> Weight: **Critical**.

### Scoring Function

The final "Narrative Importance Score" is calculated as:

1.  **Sum**: Total weight of all detected signals.
2.  **Synergy Amplifier**:
    - If multiple _families_ are triggered (e.g., Scale + Impact), apply a multiplier.
    - **Formula**: `1.0 + (UniqueFamilies - 1) * 0.1`
    - **Cap**: Max **1.5x**.
3.  **Clamp**: Constrained to range **0–10**.
4.  **Map**:
    - **0–3**: Low Priority (Neutral/Informational)
    - **4–6**: Medium Priority (Contrast/Pivot)
    - **7–10**: High Priority (Critical/Impactful)

**HARD RULE**: The score must NEVER exceed 10. Runaway scores destroy pacing logic.

### Strategy Influence

Emotional Weight acts as a **Confidence Modifier** for the Visual Reasoner, but **NEVER** overrides Grammar.

- **High Weight (7-10)**:
  - Boosts `Hero` / `Title` / `Impact` strategies.
  - _Rationale_: Important moments need screen time and focus.
- **Low Weight (0-3)**:
  - Boosts `Diagram` / `Data` / `Process` strategies.
  - _Rationale_: Low emotion usually means high information density.

**Formula**: `FinalConfidence = BaseConfidence * WeightModifier`

- Example: A `Hero` strategy (Base 0.8) with High Weight gets a 1.2x boost -> 0.96.
- Example: A `Hero` strategy with Low Weight gets a 0.8x penalty -> 0.64.

### Tempo Influence

Emotional Weight suggests a baseline Tempo, but **Density Overrides Everything**.

1.  **Baseline Suggestion**:
    - **High Weight**: Slower tempo (Give time to feel).
    - **Low Weight**: Faster tempo (Keep energy up).
2.  **The Density Override (The "Physics" Rule)**:
    - If **Information Density is High** (lots of numbers, difficult concepts), the Tempo **MUST be Slow**.
    - _Example_: A "Fast" low-weight scene with 5 statistics will be forced to **Slow** to ensure readability.
    - **Hierarchy**: Grammar (Density) > Emotional Weight > Default.

## Alternatives Considered

### 1. LLM Sentiment Analysis

- **Idea**: Ask GPT "Is this sad?".
- **Pros**: Detects mood well.
- **Cons**: Misses technical importance. "System pressure at 110%" might be seen as just a number by a generic sentiment model, but it's a crisis signal.

### 2. Manual Tagging

- **Idea**: User manually tags "Important" parts of the script.
- **Pros**: Accurate.
- **Cons**: Tedious. Defeats the "Autonomous" purpose.

## Why Chosen

- **Accuracy for Non-Fiction**: Our target is documentary/data video. "Importance" > "Sentiment".
- **Determinism**: "Deadly" always triggers the **Consequence** signal. No guessing.
- **Explainability**: We can trace exactly _why_ a scene is slow and dramatic: "Because it detected a Consequence signal in the word 'Deadly'."

## Consequences

- **Positive**:
  - Aligns with the _informational_ nature of the content.
  - Prevents "Melodrama" (treating a minor setback as a tragedy).
- **Negative**:
  - Requires building a sophisticated "Signal Library" (lists of words for Scale, Urgency, etc.).
  - Still misses context (e.g., "It was a big sandwich" has Scale words but low importance). Requires smart filtering.
