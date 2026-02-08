# ADR-006: Grammar Supremacy

## Status

Accepted

## Context

When combining "Generative Content" (unknown text length) with "Design Constraints" (fixed screen size), conflicts are inevitable.
Example: A strategy requests a "Big Bold Headline" but the text provided is 500 characters long.
If the strategy wins, the text overflows and breaks the video.
If the content wins, the design breaks.

## Decision

We established the hierarchy of **Grammar Supremacy**:
`Grammar Rules > Strategy Suggestions > User Preferences`

1.  **Grammar acts as the Law**: It defines physical limits (max characters, min contrast, safe zones).
2.  **Strategy acts as the Advisor**: Ideally, we follow the strategy, but ONLY if it fits within Grammar.
3.  **Rejection over Exception**: If a strategy violates grammar (e.g., text too long), the system _rejects_ the strategy and falls back to a safer one, rather than bending the rules (e.g., shrinking font to unreadable size).

## Alternatives Considered

### 1. Dynamic Resizing (Squishy Layouts)

- **Idea**: Just keep shrinking text until it fits.
- **Pros**: Technically "nothing breaks".
- **Cons**: Looks amateurish. 6pt font on a TV screen is a failure, even if it "fits".

### 2. Content Truncation

- **Idea**: Cut off text with "...".
- **Pros**: Preserves design.
- **Cons**: Destroys the message. The user's script is sacred.

### 3. Strategy Priority

- **Idea**: If the user picked "Big Text", give them Big Text, even if it overlaps.
- **Pros**: Obeys user intent literal.
- **Cons**: Produces broken artifacts.

## Why Chosen

High-quality design is defined by constraints.
By enforcing Grammar Supremacy, we guarantee that _every_ output video is visually valid.
It forces the "Thinking" layers (Strategy) to work harder to find a valid solution, rather than lazily drawing broken frames.

## Consequences

- **Positive**:
  - Guaranteed visual quality (no overlaps, no tiny text).
  - Trust in the output.
- **Negative**:
  - Valid content might be rejected if no strategy fits (requires good fallback "safe" strategies).
  - User might be confused why their "Big Text" choice was ignored (requires "Decision Trace" transparency).
