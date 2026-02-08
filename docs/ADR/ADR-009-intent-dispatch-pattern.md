# ADR-009: Intent Dispatch Pattern

## Status

Accepted

## Context

Users provide input in many forms:

- "Tell me a story about space." (Narrative)
- "Show the stock price of Apple." (Data)
- "Make the logo bounce." (Instruction)
- "Why is the sky blue?" (Question/Exploratory)

Trying to handle all these with a single "Video Generator" function leads to spaghetti code full of `if (isData) ... else if (isStory) ...`.

## Decision

We implemented the **Intent Dispatch Pattern**.

1.  **Input Analysis**: First, classify the input into an `IntentType`.
2.  **Dispatch**: Route the input to a _specialized_ sub-pipeline (handler).
    - `NarrativeHandler`: Focuses on pacing, emotion, story arcs.
    - `DataHandler`: Focuses on accuracy, charts, clarity.
    - `InstructionHandler`: Focuses on specific visual actions.

## Alternatives Considered

### 1. Monolithic Pipeline

- **Idea**: One giant script that handles everything.
- **Pros**: simple to start.
- **Cons**: unmaintainable. The logic for "animating a chart" conflicts with "telling a sad story".

### 2. User-Selected Mode

- **Idea**: User must click "Data Mode" or "Story Mode" in the UI.
- **Pros**: simpler code (no classifier needed).
- **Cons**: bad UX. Users expect the AI to "just understand".

## Why Chosen

Specialization allows for deeper quality.
The rules for a good "Data Video" (clean, precise, neutral) are often the _opposite_ of a good "Story Video" (emotional, varied, dramatic).
By splitting the pipeline early, each handler can optimize for its specific domain without compromising the others.

## Consequences

- **Positive**:
  - Code is organized by domain.
  - Adding a new domain (e.g., "Quiz Mode") is addictive (new Handler) rather than invasive.
- **Negative**:
  - Requires a robust "Classifier" (Intent Router) at the front door. If the router fails (classifies a story, as data), the output is weird.
