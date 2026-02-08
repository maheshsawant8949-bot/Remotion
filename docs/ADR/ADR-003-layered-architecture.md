# ADR-003: "Cognitive First" Layered Architecture

## Status

Accepted

## Context

When building an autonomous video generation engine, a common pitfall is to start with "How do I make this look cool?" (The Cinematic/Rendering layer).
This often leads to a system that can make pretty visuals but has no understanding of _why_ those visuals exist.
We needed an architecture that prioritizes **Narrative Intelligence** over **Rendering Technology**.
If the system doesn't understand the story, the video will be generic and unengaging.

## Decision

We adopted a strict **Unidirectional Layered Architecture** where data flows from abstract thought to concrete pixels:

1.  **Intent Layer**: Parses user input (Script/Prompt).
2.  **Cognitive Layer**: Analyzes _meaning_ (Emotional Weight, Pacing, Density).
3.  **Strategic Layer**: Decides _approach_ (Strategy Selection).
4.  **Compositional Layer**: Enforces _rules_ (Grammar, Layout).
5.  **Cinematic Layer**: Applies _polish_ (Reveal, Motion).
6.  **Rendering Layer**: Outputs _pixels_ (React/Remotion).

**Crucial Constraint**: Upstream layers (Cognitive) must NEVER know about downstream layers (Rendering).
The Cognitive Layer does not know that "React" exists. It only knows about "sadness" or "urgency".

## Alternatives Considered

### 1. Monolithic "Smart Component" Architecture

- **Idea**: A `SmartText` component that decides its own animation, layout, and style based on props.
- **Pros**: localized logic, easy to write initially.
- **Cons**: impossible to reason about the _whole video_. Components fight for attention. No global pacing control.

### 2. Template-First Architecture

- **Idea**: Pick a template (e.g., "News Style") and fill in the slots.
- **Pros**: very easy to implement.
- **Cons**: brittle. If the content doesn't fit the slots, it breaks. Low "intelligence" - just a mad-libs generator.

## Why Chosen

The Layered Architecture allows us to:

1.  **Isolate Complexity**: We can improve the "Emotional Weight" logic without touching a single line of rendering code.
2.  **Swap Renderers**: If we move from Remotion to Unreal Engine later, layers 1-4 remain unchanged.
3.  **Debug Narrative**: We can inspect the "Decision Trace" at the Strategic Layer to see _why_ a decision was made, before it gets clouded by animation code.

## Consequences

- **Positive**:
  - Highly testable business logic (pure functions).
  - Clear separation of concerns.
  - "Renderer Ignorance" ensures the core IP (the cognitive engine) is portable.
- **Negative**:
  - high boilerplate. Data must be passed down through many layers.
  - "Prop Drilling" or complex state management is needed to get signals from Layer 2 to Layer 5.
