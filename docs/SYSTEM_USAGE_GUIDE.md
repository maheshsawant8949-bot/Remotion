# Autonomous Visual Narrative Engine - Complete Usage Guide

## Overview

This system transforms raw content into professionally-directed video narratives through a multi-layered intelligence pipeline. This guide covers the complete flow from input to final output.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Input Requirements](#input-requirements)
3. [Pipeline Execution Flow](#pipeline-execution-flow)
4. [Intelligence Layers](#intelligence-layers)
5. [Output Structure](#output-structure)
6. [Quality Audit](#quality-audit)
7. [Integration Examples](#integration-examples)
8. [Troubleshooting](#troubleshooting)

---

## System Architecture

The system operates through **22 distinct intelligence layers**, each with specific responsibilities:

```
INPUT (Raw Content)
    ↓
[1] Emotional Weight Detection
    ↓
[2] Pacing Analysis
    ↓
[3] Rhythm Controller (Meta-Layer)
    ↓
[4] Scene Compilation
    ↓
[5] Reveal Strategy
    ↓
[6] Emphasis Detection
    ↓
[7] Motion Behavior
    ↓
[8] Motion Curves
    ↓
[9] Camera Framing
    ↓
[10] Camera Movement Intelligence
    ↓
[11] Global Distribution Governor
    ↓
[12] Cinematic Transition Intelligence
    ↓
[13] Visual Language (Tokens)
    ↓
[14] Visual Style System
    ↓
[15] Motion Polish
    ↓
[16] Micro-Interactions
    ↓
[17] Renderer Execution
    ↓
OUTPUT (Compiled Video)
    ↓
[18] Final Quality Audit
```

**Key Principle**: Each layer **decorates** decisions from upstream layers. No layer overrides emphasis or core narrative intent.

---

## Input Requirements

### Minimum Input

```typescript
interface VideoInput {
  content: string; // Raw text content
  duration?: number; // Optional target duration (seconds)
  style?: "editorial-modern"; // Currently only one style
}
```

### Example Input

```typescript
const input = {
  content: `
    Artificial Intelligence is transforming healthcare.
    Machine learning models can now detect diseases earlier than ever.
    This breakthrough could save millions of lives.
  `,
  duration: 30,
  style: "editorial-modern",
};
```

---

## Pipeline Execution Flow

### Step 1: Emotional Analysis

**Layer**: Emotional Weight Detection  
**Location**: `src/emotional-analysis/`

```typescript
import { EmotionalAnalyzer } from "./emotional-analysis";

const emotionalWeight = EmotionalAnalyzer.analyze(content);
// Returns: { score: 7, level: 'high', triggers: ['breakthrough', 'save lives'] }
```

**Output**:

- `score`: 0-10 (quantitative)
- `level`: 'low' | 'medium' | 'high'
- `triggers`: Array of emotional keywords

---

### Step 2: Pacing Analysis

**Layer**: Pacing Bias  
**Location**: `src/scene-compiler/pacing-analyzer.ts`

```typescript
const pacingBias = PacingAnalyzer.analyze({
  emotionalWeight,
  contentLength: content.length,
  targetDuration: 30,
});
// Returns: 'calm' | 'assertive' | 'urgent'
```

**Pacing Rules**:

- High emotion (7+) → `assertive` or `urgent`
- Low emotion (<4) → `calm`
- Medium emotion → `assertive`

---

### Step 3: Rhythm Controller (Meta-Layer)

**Layer**: Rhythm Controller  
**Location**: `src/rhythm-controller/`

```typescript
import { RhythmController } from "./rhythm-controller";

const rhythmState = RhythmController.analyzeRhythm({
  emotionalWeight,
  sceneIndex,
  totalScenes,
});
// Returns: { isPeak: boolean, isRecovery: boolean, phase: string }
```

**Rhythm Phases**:

- `build` → Escalating intensity
- `peak` → Emotional climax
- `recovery` → Calming down
- `sustain` → Maintaining energy

---

### Step 4: Scene Compilation

**Layer**: Scene Factory  
**Location**: `src/scene-compiler/scene-factory.ts`

This is the **master orchestrator** that runs all intelligence layers:

```typescript
import { SceneFactory } from "./scene-compiler";

const compiledScenes = SceneFactory.compileScenes({
  content: input.content,
  emotionalWeight,
  pacingBias,
  rhythmState,
  // ... other context
});
```

**Scene Factory executes in order**:

1. **Reveal Strategy** → How content appears
2. **Emphasis Detection** → What to highlight
3. **Motion Behavior** → Movement personality
4. **Motion Curves** → Easing intent
5. **Camera Framing** → Shot composition
6. **Camera Movement** → Camera motion intent
7. **Global Distribution Governor** → Balance enforcement
8. **Cinematic Transitions** → Scene-to-scene flow
9. **Visual Style** → Design language application
10. **Motion Polish** → Duration + easing mapping
11. **Micro-Interactions** → Refinement layer

---

### Step 5: Intelligence Layer Details

#### 5.1 Reveal Strategy

**Purpose**: Determines how content appears on screen

```typescript
// Location: src/reveal-strategy/
const reveal = RevealResolver.resolve({
  templateType: "diagram",
  density: 6,
  emotionalWeight: 7,
});
// Returns: { type: 'sequential', reason: 'High density diagram' }
```

**Reveal Types**:

- `instant` (50-60%) - Default, no animation
- `fade-in` (≤25%) - Gentle appearance
- `sequential` (≤20%) - Step-by-step reveal

---

#### 5.2 Emphasis Detection

**Purpose**: Identifies what deserves visual weight

```typescript
// Location: src/emphasis-detection/
const emphasis = EmphasisDetector.detect({
  emotionalWeight: 7,
  rhythmPeak: true,
  density: 5,
});
// Returns: { level: 'strong', reason: 'Emotional peak' }
```

**Emphasis Levels**:

- `none` (40-50%) - Default
- `mild` (≤30%) - Subtle highlight
- `strong` (≤20%) - Clear focus

**HARD RULE**: Emphasis is **never overridden** by downstream layers.

---

#### 5.3 Motion Behavior

**Purpose**: Defines movement personality

```typescript
// Location: src/motion-behavior/
const motion = MotionResolver.resolve({
  emotionalWeight: 7,
  pacingBias: "assertive",
  density: 5,
});
// Returns: { type: 'kinetic', reason: 'High emotion + assertive pacing' }
```

**Motion Types**:

- `static` (30-40%) - No motion
- `ambient` (≤30%) - Subtle drift
- `kinetic` (≤25%) - Active movement
- `float` (≤15%) - Gentle suspension

---

#### 5.4 Motion Curves

**Purpose**: Semantic motion intent (NOT renderer easing)

```typescript
// Location: src/motion-curves/
const curve = CurveResolver.resolve({
  emotionalWeight: 7,
  motionBehavior: "kinetic",
  density: 5,
});
// Returns: { type: 'confident', reason: 'Kinetic motion + high emotion' }
```

**Curve Types** (4 only):

- `gentle` - Soft, calm
- `confident` - Balanced, professional
- `swift` - Quick, responsive
- `deliberate` - Slow, thoughtful

---

#### 5.5 Camera Framing

**Purpose**: Shot composition

```typescript
// Location: src/camera-framing/
const shot = FramingResolver.resolve({
  templateType: "diagram",
  density: 6,
  emphasis: "strong",
});
// Returns: { type: 'close', reason: 'High density + strong emphasis' }
```

**Shot Types** (5 only):

- `wide` (25-35%) - Establishing
- `medium` (30-40%) - Default
- `close` (≤25%) - Focus
- `tight` (≤15%) - Intense
- `macro` (≤10%) - Detail

---

#### 5.6 Camera Movement

**Purpose**: Camera motion intent

```typescript
// Location: src/camera-movement/
const movement = MovementResolver.resolve({
  cameraShot: "close",
  motionCurve: "confident",
  emphasis: "strong",
  density: 6,
});
// Returns: { type: 'drift', reason: 'Close shot + confident curve' }
```

**Movement Types** (4 only):

- `static` (40-50%) - No camera motion
- `drift` (≤30%) - Subtle pan
- `push` (≤15%) - Forward motion
- `hold` (≤10%) - Stabilized focus

---

#### 5.7 Global Distribution Governor

**Purpose**: Cross-layer balance enforcement

```typescript
// Location: src/governors/
const stabilized = GlobalDistributionGovernor.stabilize(scenes);
// Returns: Adjusted scenes with balanced distribution
```

**Prevents**:

- Intensity stacking (kinetic + tight + push)
- Consecutive pressure (3+ intense scenes)
- Volatility spikes (erratic changes)
- Inflation (overuse of dynamic elements)

---

#### 5.8 Cinematic Transitions

**Purpose**: Scene-to-scene flow

```typescript
// Location: src/cinematic-transitions/
const transition = TransitionResolverV2.resolve({
  currentScene,
  nextScene,
  energyDelta: 3,
});
// Returns: { type: 'cut', reason: 'Large energy increase' }
```

**Transition Types** (5 only):

- `cut` (40-60%) - Default, professional
- `soft-cut` - Low energy shift
- `match-cut` (≤15%) - Visual continuity
- `ease-through` (≤20%) - Gradual escalation
- `hold-cut` (5-8%) - Micro pause (VERY CINEMATIC)

**Energy Delta Logic**:

- Large positive (+3) → `cut`
- Large negative (-3) → `hold-cut`
- Minimal (≤1) → `soft-cut`

---

#### 5.9 Visual Style System

**Purpose**: Design language application

```typescript
// Location: src/visual-style/
const style = StyleResolver.resolve({
  emphasisLevel: "strong",
  density: 6,
  emotionalWeight: 7,
});
// Returns: { colors, fonts, surfaces, depth, background }
```

**Style Profile**: `editorial-modern`

- Palette: 6 softened colors (no pure black/white)
- Fonts: Inter (primary) + JetBrains Mono (data)
- Depth: 3 subtle levels (no heavy shadows)
- Accent: <8-10% coverage

---

#### 5.10 Motion Polish

**Purpose**: Duration + easing mapping

```typescript
// Location: src/motion-polish/
const polish = MotionMapper.mapSceneMotion("confident", {
  emotionalWeight: 7,
  density: 6,
});
// Returns: { duration: 420, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
```

**Duration Ranges**:

- micro: 180-260ms
- standard: 260-420ms
- emphasis: 420-650ms
- deliberate: 650-900ms
- **MAX: 900ms** (slow ≠ cinematic)

**Easing Curves** (4 only):

- `gentleEase` - Soft ease-out
- `confidentEase` - Ease-in-out
- `swiftEase` - Fast ease-out
- `deliberateEase` - Slow ease-in-out

---

#### 5.11 Micro-Interactions

**Purpose**: Refinement layer (supports motion, never competes)

```typescript
// Location: src/micro-interactions/
const interaction = InteractionResolver.resolve({
  motionCurve: "confident",
  cameraMovement: "drift",
  density: 6,
});
// Returns: { type: 'settle', reason: 'Text-heavy focus scene' }
```

**Interaction Types** (5 only):

- `none` (50-65%) - Default, stillness is sophistication
- `settle` (≤20%) - Tiny stabilization (VERY HIGH VALUE)
- `linger` (≤15%) - Hold attention longer
- `soft-pop` (≤10%) - Subtle confirmation
- `breathe` (≤8%) - Slow ambient motion

---

## Output Structure

### Compiled Scene Format

```typescript
interface CompiledScene {
  // Core properties
  id: string;
  content: string;
  duration: number;

  // Decision trace (explainability)
  trace: {
    emotionalAnalysis: { score: number; level: string; triggers: string[] };
    pacingBias: string;
    rhythmState: { isPeak: boolean; isRecovery: boolean };
    reveal: { type: string; reason: string };
    emphasis: { level: string; reason: string };
    motionBehavior: { type: string; reason: string };
    motionCurve: { type: string; reason: string };
    cameraShot: { type: string; reason: string };
    cameraMovement: { type: string; reason: string };
    cinematicTransition: { type: string; reason: string };
    microInteraction: { type: string; reason: string };
  };

  // Style & polish
  style: {
    colors: ColorPalette;
    fonts: { primary: string; secondary: string };
    depth: "depth-0" | "depth-1" | "depth-2";
  };

  polish: {
    duration: number;
    easing: string;
  };
}
```

---

## Quality Audit

**Location**: `evaluation/final-quality-audit/`

Run AFTER full compilation:

```typescript
import { QualityAudit } from "./evaluation/final-quality-audit";

const auditReport = QualityAudit.audit(compiledScenes);
QualityAudit.printReport(auditReport);
```

### Audit Output

```
╔════════════════════════════════════════╗
║   CINEMATIC HEALTH AUDIT               ║
╚════════════════════════════════════════╝

HEALTH SCORE: 87/100
STATUS: 🟡 STRONG (minor tuning)

⚡ MINOR RISKS:
   • Kinetic streak 3 exceeds 2
   • Push frequency 12.5% exceeds 10%

─────────────────────────────────────────
DETAILED BREAKDOWN:

Motion Health: ⚠️
  Kinetic Streak: 3 (max 2)
  Avg Duration: 420ms (max 500ms)
  Curve Volatility: 32.1% (max 45%)

Camera Health: ⚠️
  Tight Streak: 1 (max 2)
  Push Frequency: 12.5% (max 10%)
  Movement Ratio: 35.0% (max 40%)
```

### Health Score Bands

| Score | Band                | Action          |
| ----- | ------------------- | --------------- |
| 90+   | 🟢 Production-ready | Ship it         |
| 75-89 | 🟡 Strong           | Minor tuning    |
| 60-74 | 🟠 Noticeable risk  | Needs attention |
| <60   | 🔴 Not safe         | Do not ship     |

---

## Integration Examples

### Basic Usage

```typescript
import { VideoEngine } from "./video-engine";

const engine = new VideoEngine();

const result = await engine.compile({
  content: "Your content here",
  duration: 30,
  style: "editorial-modern",
});

console.log(`Generated ${result.scenes.length} scenes`);
console.log(`Health Score: ${result.audit.healthScore}/100`);
```

### Advanced Usage with Custom Context

```typescript
const result = await engine.compile({
  content: "Your content here",
  duration: 30,
  style: "editorial-modern",

  // Optional overrides
  context: {
    emotionalBias: "calm", // Force calm tone
    maxScenes: 10, // Limit scene count
    targetPacing: "assertive", // Override pacing
  },
});
```

### Accessing Decision Trace

```typescript
result.scenes.forEach((scene, i) => {
  console.log(`Scene ${i}:`);
  console.log(`  Emotion: ${scene.trace.emotionalAnalysis.level}`);
  console.log(`  Motion: ${scene.trace.motionBehavior.type}`);
  console.log(`  Camera: ${scene.trace.cameraShot.type}`);
  console.log(`  Transition: ${scene.trace.cinematicTransition.type}`);
  console.log(`  Reason: ${scene.trace.cinematicTransition.reason}`);
});
```

---

## Troubleshooting

### Issue: Health Score Too Low (<60)

**Check**:

1. Intensity stacking (3+ factors together)
2. Cognitive load risks (high density + movement + fast curve)
3. Motion health (kinetic streak, duration, volatility)
4. Camera health (tight streak, push frequency)

**Solution**: Governors should auto-correct, but if not:

- Reduce density in high-emotion scenes
- Avoid stacking push + swift + tight
- Add recovery scenes after peaks

---

### Issue: Too Many Cuts

**Check**: Transition distribution in audit report

**Solution**:

- Cuts should be 40-60% (this is correct)
- If >60%, check if soft-cut/match-cut are being used
- Ensure continuity detection is working

---

### Issue: Motion Feels Mechanical

**Check**:

1. Settle interaction usage (should be ≤20%)
2. Motion curve volatility (should be <45%)
3. Duration inflation (avg should be <500ms)

**Solution**:

- Increase settle interactions for text-heavy scenes
- Reduce curve switching frequency
- Check polish governor is running

---

### Issue: Over-Animated Feel

**Check**:

1. Interaction ratio (should be ≤45%)
2. Movement ratio (should be ≤40%)
3. Accent coverage (should be <10%)

**Solution**:

- Bias toward `none` interaction
- Reduce camera movement frequency
- Enforce accent rules strictly

---

## Best Practices

### 1. Trust the Defaults

The system is designed with strict distribution targets. **Do not override** unless you have specific requirements.

### 2. Emphasis is Sacred

Never override emphasis decisions. All downstream layers respect emphasis as the highest-level narrative intent.

### 3. Stillness is Sophistication

- `none` interaction should be 50-65%
- `static` camera should be 40-50%
- Cuts should be 40-60%

**Over-animation destroys maturity.**

### 4. Viewer Comprehension > Cinematic Flair

Always. If readability risks are flagged, reduce:

- Density
- Camera movement
- Motion speed

### 5. Run Quality Audit Constantly

This is **permanent infrastructure**, not optional tooling. Run after every compilation.

---

## System Principles

1. **Hierarchy Preservation**: Emphasis → Motion → Camera → Transitions → Micro-interactions
2. **Distribution Control**: Strict targets prevent overuse
3. **Explainability**: Every decision has a `reason`
4. **No Randomness**: Deterministic, rule-based
5. **Decoration, Not Direction**: Layers decorate, never override
6. **Slow ≠ Cinematic**: Slow = boring (max 900ms)
7. **Stillness is Sophistication**: Don't animate everything
8. **Audit Never Modifies**: Only diagnoses, governors correct

---

## Quick Reference

### Distribution Targets

| Element               | Target | Cap  |
| --------------------- | ------ | ---- |
| Emphasis: none        | 40-50% | -    |
| Emphasis: strong      | -      | ≤20% |
| Motion: static        | 30-40% | -    |
| Motion: kinetic       | -      | ≤25% |
| Camera: static        | 40-50% | -    |
| Camera: push          | -      | ≤15% |
| Movement: static      | 40-50% | -    |
| Movement: push        | -      | ≤15% |
| Transition: cut       | 40-60% | -    |
| Transition: match-cut | -      | ≤15% |
| Transition: hold-cut  | 5-8%   | ≤8%  |
| Interaction: none     | 50-65% | -    |
| Interaction: settle   | -      | ≤20% |
| Accent coverage       | -      | <10% |

### Duration Limits

| Type                 | Range     | Max   |
| -------------------- | --------- | ----- |
| Scene: micro         | 180-260ms | -     |
| Scene: standard      | 260-420ms | -     |
| Scene: emphasis      | 420-650ms | -     |
| Scene: deliberate    | 650-900ms | 900ms |
| Transition: cut      | 0-120ms   | -     |
| Transition: soft-cut | 180-260ms | -     |
| Transition: hold-cut | 320-450ms | 500ms |

---

## Support

For issues or questions:

1. Check the quality audit report
2. Review decision traces for explainability
3. Verify distribution targets are met
4. Ensure governors are running

**Remember**: The system is designed to be self-correcting. If quality scores are low, governors should intervene automatically.
