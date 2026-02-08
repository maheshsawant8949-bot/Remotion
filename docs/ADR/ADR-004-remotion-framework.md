# ADR-004: Adoption of Remotion Framework

## Status

Accepted

## Context

We needed a way to render high-quality video programmatically.
Traditional video editing (Premiere, After Effects) is manual.
Traditional programmatic video (FFmpeg CLI) is extremely hard to style and animate for complex UI/motion graphics.

We needed a tool that allows:

1.  **Programmatic Control**: Defined by code, not timelines.
2.  **Rich Styling**: CSS/Canvas capabilities for complex layouts.
3.  **React Ecosystem**: Leverage existing UI libraries and component models.
4.  **Server-Side Rendering**: Ability to generate video in the cloud without a GPU head.

## Decision

We selected **Remotion** as our Rendering Layer technology.

Remotion allows us to write video frames using React components, determining the visual state of every frame as a pure function of `frame` number and `props`.

## Alternatives Considered

### 1. FFmpeg + ImageMagick Scripts

- **Idea**: Generate images for every frame using ImageMagick, stitch with FFmpeg.
- **Pros**: extremely performant, zero dependencies.
- **Cons**: impossible to build complex UI. Managing layout and text wrapping in C/CLI is a nightmare.

### 2. HTML5 Canvas + Screen Capture

- **Idea**: Run a browser, animate on Canvas, record the screen with Puppeteer.
- **Pros**: flexible.
- **Cons**: non-deterministic timing (dropping frames if the browser lags). Hard to sync audio.

### 3. After Effects Scripting

- **Idea**: Generate `.jsx` scripts to drive After Effects.
- **Pros**: industry-standard visual quality.
- **Cons**: requires a Windows/Mac license to render. Very slow. Not scalable for potential cloud generation.

## Why Chosen

Remotion acts as the bridge between "Web Development" and "Video Production".
It gives us:

- **Determinism**: Frame 0 is always Frame 0.
- **Preview**: Fast in-browser preview for debugging.
- **Power**: Full access to CSS Flexbox/Grid for layout (solving the hardest part of dynamic video).

## Consequences

- **Positive**:
  - Rapid iteration using web skills.
  - Huge ecosystem of React libraries (Three.js via React-Three-Fiber, etc.).
- **Negative**:
  - Rendering is slower than native C++ engines.
  - Memory heavy for very long videos.
  - Browser-based constraints (some advanced blending modes or shaders are harder than in native tools).
