# ADR-002: Centralized Design Token System

## Status

Accepted

## Context

As the video generation system scales, maintaining visual consistency across different templates, layers, and strategies becomes difficult.
Hardcoding values like colors (`#38BDF8`), spacing (`20px`), and font sizes (`64px`) directly into React components leads to:

1.  **Inconsistency**: Slight variations in similar values.
2.  **Maintenance Nightmare**: Changing the brand color requires hunting down every hex code.
3.  **Rigidity**: Making a "Dark Mode" or "Brand Reskin" is impossible without major refactoring.

## Decision

We decided to adopt a **Centralized Design Token System** (`src/style/tokens.ts`).
All visual primitives—colors, spacing, typography, potential animation curves—MUST be defined in this single source of truth and consumed by components.

Key Structure:

- `colors`: Semantic names (`primary`, `surface`, `text`) rather than descriptive (`blue`, `dark-grey`).
- `spacing`: T-shirt sizes (`s`, `m`, `xl`) to enforce rhythm.
- `font`: Functional roles (`display`, `h1`, `body`) to enforce hierarchy.

## Alternatives Considered

### 1. Hardcoded Values / Magic Numbers

- **Idea**: Just write `fontSize: 60` in the style prop.
- **Pros**: Fastest for initial prototyping.
- **Cons**: Unmaintainable. Leads to "visual drift" where nothing quite aligns.

### 2. CSS Variables / Tailwind Classes

- **Idea**: Use standard web development (Tailwind).
- **Pros**: Very standard for web.
- **Cons**: Remotion renders to video frames. While Tailwind works, we often need these values in _logic_ (e.g., calculating layout heights in the `LayoutEngine`), not just in CSS. JS Tokens are more portable for our `SceneCompiler`.

### 3. Per-Template Theme Objects

- **Idea**: Each template file has its own `const theme = {...}`.
- **Pros**: Isolation.
- **Cons**: No global brand consistency. A video composed of mixed templates would look disjointed.

## Why Chosen

We chose TS Tokens because they are:

1.  **Type-Safe**: TypeScript ensures we only use valid tokens.
2.  **Logic-Ready**: Available to the `LayoutEngine` (Phase 1) for calculating if text fits, unlike CSS classes.
3.  **Themeable**: We can easily swap the entire `tokens` object to re-skin the engine.

## Consequences

- **Positive**:
  - Changing the `primary` color updates the entire video engine instantly.
  - Layout calculations are precise and consistent.
- **Negative**:
  - Developers must look up token names (`tokens.spacing.m`) instead of guessing pixels.
  - Refactoring existing "magic number" code to use tokens is a tedious cleanup task.
