# Autonomous Visual Narrative Engine - Quick Reference

## Pipeline Flow (22 Layers)

```
INPUT → Emotional Analysis → Pacing → Rhythm Controller →
Scene Compilation → Reveal → Emphasis → Motion Behavior →
Motion Curves → Camera Framing → Camera Movement →
Distribution Governor → Transitions → Visual Style →
Motion Polish → Micro-Interactions → Renderer →
OUTPUT → Quality Audit
```

---

## Distribution Targets (Quick Lookup)

### Emphasis

- `none`: 40-50% | `mild`: ≤30% | `strong`: ≤20%

### Motion Behavior

- `static`: 30-40% | `ambient`: ≤30% | `kinetic`: ≤25% | `float`: ≤15%

### Motion Curves (4 only)

- `gentle` | `confident` | `swift` | `deliberate`

### Camera Shots (5 only)

- `wide`: 25-35% | `medium`: 30-40% | `close`: ≤25% | `tight`: ≤15% | `macro`: ≤10%

### Camera Movement (4 only)

- `static`: 40-50% | `drift`: ≤30% | `push`: ≤15% | `hold`: ≤10%

### Transitions (5 only)

- `cut`: 40-60% | `soft-cut` | `match-cut`: ≤15% | `ease-through`: ≤20% | `hold-cut`: 5-8%

### Micro-Interactions (5 only)

- `none`: 50-65% | `settle`: ≤20% | `linger`: ≤15% | `soft-pop`: ≤10% | `breathe`: ≤8%

---

## Duration Limits

| Type             | Range     | Max       |
| ---------------- | --------- | --------- |
| **Scene Motion** |           |           |
| micro            | 180-260ms | -         |
| standard         | 260-420ms | -         |
| emphasis         | 420-650ms | -         |
| deliberate       | 650-900ms | **900ms** |
| **Transitions**  |           |           |
| cut              | 0-120ms   | -         |
| soft-cut         | 180-260ms | -         |
| match-cut        | 220-320ms | -         |
| hold-cut         | 320-450ms | **500ms** |

---

## Easing Curves (4 only)

```typescript
gentleEase: "cubic-bezier(0.25, 0.1, 0.25, 1)"; // Soft ease-out
confidentEase: "cubic-bezier(0.4, 0, 0.2, 1)"; // Ease-in-out
swiftEase: "cubic-bezier(0.4, 0, 0.6, 1)"; // Fast ease-out
deliberateEase: "cubic-bezier(0.4, 0, 0.2, 1)"; // Slow ease-in-out
```

---

## Visual Style (editorial-modern)

### Palette (6 colors)

```typescript
background: "#0F1419"; // Soft near-black
surface: "#1A1F26"; // Elevated
primaryText: "#E8EAED"; // Soft near-white
secondaryText: "#9AA0A6"; // Muted gray
accent: "#5E8FD9"; // Desaturated blue
divider: "#2D3339"; // Subtle separator
```

### Fonts (max 2)

- Primary: **Inter** (display, headline, body)
- Secondary: **JetBrains Mono** (data, code)

### Depth (3 levels)

- `depth-0`: flat (no shadow)
- `depth-1`: `0 1px 3px rgba(0,0,0,0.12)`
- `depth-2`: `0 2px 6px rgba(0,0,0,0.16)`

### Accent Coverage

- **MAX: 8-10%** (attention currency)

---

## Quality Audit Thresholds

### Health Score Bands

- **90+**: 🟢 Production-ready
- **75-89**: 🟡 Strong (minor tuning)
- **60-74**: 🟠 Noticeable risk
- **<60**: 🔴 Not production safe

### Critical Checks

- **Intensity Stacking**: 3+ factors → HIGH RISK
- **Kinetic Streak**: >2 → flag
- **Push Frequency**: >10% → flag
- **Movement Ratio**: >40% → flag
- **Interaction Ratio**: >45% → flag
- **Avg Duration**: >500ms → flag
- **Curve Volatility**: >0.45 → flag

---

## HARD RULES

### Never Override

1. ❌ **Emphasis** (sacred, highest-level intent)
2. ❌ **Emotional weight** (core narrative)
3. ❌ **Rhythm peaks** (meta-layer control)

### Always Respect

1. ✅ **Hierarchy**: Emphasis → Motion → Camera → Transitions → Micro
2. ✅ **Distribution targets** (strict caps)
3. ✅ **Duration limits** (900ms scene, 500ms transition)
4. ✅ **Stillness** (none/static should dominate)

### Principles

- **Slow ≠ Cinematic** (slow = boring)
- **Stillness is Sophistication** (don't animate everything)
- **Viewer Comprehension > Cinematic Flair** (always)
- **Audit Never Modifies** (only diagnoses)
- **Cuts are Premium** (40-60% target)
- **Accent is Attention Currency** (don't overspend)

---

## Common Patterns

### High Emotion Scene

```
emotionalWeight: 7+ →
  pacingBias: 'assertive' →
  motionBehavior: 'kinetic' →
  motionCurve: 'confident' →
  cameraShot: 'close' →
  cameraMovement: 'drift' →
  emphasis: 'strong'
```

### Calm Scene

```
emotionalWeight: <4 →
  pacingBias: 'calm' →
  motionBehavior: 'ambient' →
  motionCurve: 'gentle' →
  cameraShot: 'wide' →
  cameraMovement: 'static' →
  microInteraction: 'breathe'
```

### Peak Scene

```
rhythmPeak: true →
  emphasis: 'strong' →
  linger interaction →
  hold-cut transition (after peak) →
  recovery scene (next)
```

---

## Troubleshooting Quick Fixes

### Health Score <60

1. Check intensity stacking (downgrade: micro → transition → movement → motion)
2. Check cognitive load (reduce density + movement + speed)
3. Check motion health (reduce kinetic streak)

### Over-Animated Feel

1. Increase `none` interaction (target 50-65%)
2. Increase `static` camera (target 40-50%)
3. Reduce accent coverage (<10%)

### Mechanical Feel

1. Increase `settle` interaction (removes mechanical feel)
2. Reduce curve volatility (<45%)
3. Add hold-cuts after peaks (5-8%)

### Too Many Cuts

1. Verify cut ratio (40-60% is correct)
2. Check soft-cut/match-cut usage
3. Ensure continuity detection working

---

## File Locations

```
src/
├── emotional-analysis/          # Emotional weight detection
├── scene-compiler/              # Master orchestrator
├── rhythm-controller/           # Meta-layer rhythm
├── reveal-strategy/             # Content appearance
├── emphasis-detection/          # Visual weight
├── motion-behavior/             # Movement personality
├── motion-curves/               # Motion intent
├── camera-framing/              # Shot composition
├── camera-movement/             # Camera motion
├── governors/                   # Distribution balance
├── cinematic-transitions/       # Scene-to-scene flow
├── visual-language/             # Design tokens
├── visual-style/                # Style system
├── motion-polish/               # Duration + easing
└── micro-interactions/          # Refinement layer

evaluation/
└── final-quality-audit/         # Quality checks
```

---

## Usage Example

```typescript
import { VideoEngine } from "./video-engine";
import { QualityAudit } from "./evaluation/final-quality-audit";

const engine = new VideoEngine();

const result = await engine.compile({
  content: "Your content here",
  duration: 30,
  style: "editorial-modern",
});

// Check quality
const audit = QualityAudit.audit(result.scenes);
QualityAudit.printReport(audit);

if (audit.healthScore < 60) {
  throw new Error("Quality below production threshold");
}

// Access decisions
result.scenes.forEach((scene) => {
  console.log(scene.trace.cinematicTransition.reason);
});
```

---

## Decision Trace Structure

```typescript
scene.trace = {
  emotionalAnalysis: { score, level, triggers },
  pacingBias: "calm" | "assertive" | "urgent",
  rhythmState: { isPeak, isRecovery, phase },
  reveal: { type, reason },
  emphasis: { level, reason },
  motionBehavior: { type, reason },
  motionCurve: { type, reason },
  cameraShot: { type, reason },
  cameraMovement: { type, reason },
  cinematicTransition: { type, reason },
  microInteraction: { type, reason },
};
```

Every decision has a **reason** for explainability.

---

## Key Metrics to Monitor

1. **Health Score**: Should be ≥75 for production
2. **Intensity Stacking**: Should be 0
3. **Cognitive Load Risks**: Should be 0
4. **Motion Health**: All checks passing
5. **Camera Health**: All checks passing
6. **Distribution Balance**: Within targets

---

## Remember

- **Trust the defaults** (designed with strict targets)
- **Run quality audit constantly** (permanent infrastructure)
- **Stillness is sophistication** (over-animation = cheap)
- **Viewer comprehension first** (always)
- **Audit never modifies** (governors correct)

---

For full documentation, see: `docs/SYSTEM_USAGE_GUIDE.md`
