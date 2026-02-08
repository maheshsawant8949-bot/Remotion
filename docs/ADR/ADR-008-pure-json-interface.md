# ADR-008: Pure JSON Compiler Interface (Renderer Ignorance)

## Status

Accepted

## Context

In a layered architecture, leakage between the "Logic" and the "View" is the root of all technical debt.
If the `SceneCompiler` imports `React` or knows about `<div>` tags, we cannot:

1.  Run the compiler in a non-DOM environment easily (e.g., pure Node worker).
2.  Switch to a different renderer (e.g., Mobile Native, WebGL, Unity).
3.  Test the compiler logic without mocking a browser.

## Decision

We enforce **Renderer Ignorance**: The Compilation Layer outputs **Pure JSON**.

- The output contains _Data_ (`text`, `color`, `x/y coordinates`).
- The output contains _Intent_ (`animation: 'fade-in'`).
- The output does NOT contain _Implementation_ (`<motion.div animate={{opacity: 1}} />`).

The `SceneFactory` (rendering layer) is responsible for taking this JSON and mapping it to React components.

## Alternatives Considered

### 1. Returning React Nodes directly

- **Idea**: `compile(script) -> <Video />`
- **Pros**: very standard React pattern.
- **Cons**: The compiler is now coupled to React. We can't save the "Compiled Scene" to a database easily without serializing React (impossible/messy).

### 2. Returning Code Strings

- **Idea**: Compiler generates a string of JS code that is `eval`'d.
- **Pros**: flexible.
- **Cons**: Security nightmare. Hard to debug syntax errors in generated code.

## Why Chosen

Usefulness of the **Intermediate Representation (IR)**:
The JSON output serves as an _Intermediate Representation_.
We can:

- Save it to a DB (Project File).
- Send it over a network (Cloud Rendering).
- Inspect it in a dashboard (Debug View).
- Diff it version-to-version.

This aligns with the principle: "Cognition is the moat, Rendering is a commodity."

## Consequences

- **Positive**:
  - Complete decoupling of "Thought" and "Action".
  - Testability of compiler is trivial (input JSON -> output JSON).
- **Negative**:
  - We must maintain a "Schema" (Contract) between the JSON output and the React Props.
  - Slight overhead in mapping JSON to Components at runtime.
