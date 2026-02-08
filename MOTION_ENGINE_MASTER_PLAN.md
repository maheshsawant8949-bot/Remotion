# MOTION ENGINE MASTER PLAN
## Autonomous Visual Narrative Engine — Architectural Blueprint

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Master Execution Document  
**Audience:** Senior Engineers, System Architects, AI Assistants (Antigravity)

---

## EXECUTIVE SUMMARY

This document is the **single source of truth** for the Autonomous Visual Narrative Engine platform.

**What This Is:**
- A deterministic, cognitive-first motion graphics engine
- Converts narrative intent → directed cinematic video
- Explainable, debuggable, production-grade

**What This Is NOT:**
- Template video generator
- Prompt-to-video toy
- AI-controlled black box

**Core Philosophy:**
Intelligence layers precede spectacle. Cognition before cinematics. Grammar supremacy. Renderer ignorance.

---

## TABLE OF CONTENTS

1. [Architectural Principles](#architectural-principles)
2. [System Dependency Graph](#system-dependency-graph)
3. [Completed Systems (Phase 1)](#completed-systems-phase-1)
4. [Current Implementation (Phase 2)](#current-implementation-phase-2)
5. [Remaining Roadmap](#remaining-roadmap)
   - Phase 2 Completion
   - Phase 3: Cinematic Intelligence
   - Phase 4: Style Intelligence
   - Phase 5: Advanced Creative Intelligence
6. [Anti-Patterns & Guardrails](#anti-patterns--guardrails)
7. [Implementation Prompts](#implementation-prompts)

---

## ARCHITECTURAL PRINCIPLES

### NON-NEGOTIABLE LAWS

#### 1. DETERMINISM FIRST
**Principle:** The pipeline must always be debuggable.

**Rules:**
- Every decision must be traceable
- AI may assist — NEVER control blindly
- Randomness requires explicit seeding
- All choices must be explainable via decision trace

**Validation:**
- Can you replay the same input and get identical output?
- Can you explain WHY scene X chose strategy Y?
- If not: the system is broken.

---

#### 2. SEPARATION OF CONCERNS

**Never Collapse These Layers:**

```
Intent Layer          → What the user wants
Cognitive Layer       → Understanding + reasoning about narrative
Strategic Layer       → How to achieve visual goals
Compositional Layer   → Grammar + layout rules
Execution Layer       → JSON output (renderer-agnostic)
Rendering Layer       → React/Animation (isolated)
```

**Critical:**
- Each layer exposes a clean contract
- Upstream layers NEVER import from downstream
- Downstream layers NEVER make strategic decisions

**Example Violation:**
```javascript
// ❌ WRONG — Renderer leak into compiler
import { TextComponent } from '@/components/scenes'
if (TextComponent.maxChars < content.length) { ... }
```

**Correct Pattern:**
```javascript
// ✅ RIGHT — Layout contract
const constraints = layoutEngine.getConstraints('headline')
if (constraints.maxCharacters < content.length) { ... }
```

---

#### 3. GRAMMAR SUPREMACY

**Hierarchy:**
```
Grammar Rules  >  Strategy Suggestions  >  User Preferences
```

**Rules:**
- Grammar defines compositional law (spacing, alignment, hierarchy)
- Strategy MUST respect grammar boundaries
- If strategy violates grammar → reject strategy, not grammar
- Grammar can evolve via versioning — NEVER via exception

**Example:**
- Strategy wants 5 bullet points
- Grammar allows max 4 for visual density
- Result: Strategy adapts to 4, or rejects scene

---

#### 4. RENDERER IGNORANCE

**The compiler and reasoning layers output PURE JSON.**

**They Must NOT:**
- Import React components
- Inspect component internals
- Depend on rendering logic
- Know about animation libraries

**Why:**
- Tomorrow you might render to Canvas, WebGL, or native video
- Compiler intelligence must remain portable
- Renderer is a commodity — cognition is the moat

**Interface Contract:**
```typescript
// Compiler output
interface CompiledScene {
  template: string
  layoutData: LayoutContract
  strategyTrace: DecisionLog
  // NO rendering instructions here
}
```

---

#### 5. COGNITIVE BEFORE CINEMATIC

**Order Matters. Always.**

**Wrong Priority:**
- Build fancy transitions first
- Add particle effects
- Implement morphing animations

**Right Priority:**
- Understand narrative weight
- Detect pacing requirements
- Choose appropriate reveal strategies
- THEN add cinematic polish

**Why:**
- Pretty chaos is still chaos
- Intelligence creates differentiation
- Spectacle without strategy = template generator

---

## SYSTEM DEPENDENCY GRAPH

### LAYERED ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INPUT LAYER                        │
│                    (Script / Narration)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   INTENT PARSING LAYER                       │
│              • Intent Dispatcher                             │
│              • Content Segmentation                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  COGNITIVE ANALYSIS LAYER                    │
│              • Emotional Weight Detection    ← PHASE 2       │
│              • Narrative Pacing Engine       ← PHASE 2       │
│              • Scene Density Controller      ← PHASE 2       │
│              • Multi-Scene Awareness         ← PHASE 5       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   STRATEGIC REASONING LAYER                  │
│              • Strategy Engine                               │
│              • Strategy Confidence Scoring                   │
│              • Rejection Trace                               │
│              • Visual Reasoning v2 (AI-assist) ← PHASE 5     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  COMPOSITIONAL LAYER                         │
│              • Layout Engine                                 │
│              • Grammar Rules + Validator                     │
│              • Template Schema                               │
│              • Design Token System          ← PHASE 4        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CINEMATIC LAYER                            │
│              • Reveal Engine                ← PHASE 2        │
│              • Transition Intelligence      ← PHASE 3        │
│              • Emphasis System              ← PHASE 3        │
│              • Motion Behavior Library      ← PHASE 3        │
│              • Rhythm Controller            ← PHASE 3        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    COMPILATION LAYER                         │
│              • Scene Compiler                                │
│              • Scene Factory                                 │
│              • Quality Scoring                               │
│              • Decision Trace Logger                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     PURE JSON OUTPUT                         │
│              (Renderer-Agnostic Scene Definition)            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    RENDERING LAYER                           │
│              • React Components (current)                    │
│              • Animation Engine                              │
│              • Future: Canvas/WebGL/Native                   │
└─────────────────────────────────────────────────────────────┘
```

### CRITICAL DEPENDENCIES

**Horizontal Dependencies (Same Layer):**
- Emotional Weight ← Pacing ← Density (must coordinate)
- Reveal ← Transitions ← Emphasis (must not conflict)

**Vertical Dependencies (Cross-Layer):**
- Strategy DEPENDS ON → Cognitive signals (weight, pacing, density)
- Cinematic DEPENDS ON → Strategy decisions
- Grammar VALIDATES → All compositional output
- Compiler DEPENDS ON → All upstream layers

**Forbidden Dependencies:**
- Renderer → Compiler (NEVER)
- Strategy → Grammar (strategy requests, grammar decides)
- Cinematic → Cognitive (uses signals, cannot modify them)


---

## COMPLETED SYSTEMS (PHASE 1)

### ✅ STATUS: PRODUCTION-READY

**Do NOT rebuild these systems unless critical architectural flaws discovered.**

---

### 1. DETERMINISTIC LAYOUT ENGINE

**Purpose:** Enforces spatial contracts for all templates.

**Architecture:**
```typescript
interface LayoutEngine {
  getConstraints(templateId: string): LayoutConstraints
  validate(template: string, data: any): ValidationResult
  version: string // Grammar versioning support
}
```

**Key Features:**
- Template-specific constraint definitions
- Character limits, element counts, spacing rules
- Deterministic enforcement (no guessing)
- Version-locked contracts

**Integration Point:**
- Used by Scene Compiler before JSON output
- Blocks invalid scenes at compile-time

---

### 2. LOCKED LAYOUT CONTRACTS

**Purpose:** Prevent compositional chaos via strict schemas.

**Example Contract:**
```typescript
const HEADLINE_LAYOUT = {
  maxCharacters: 60,
  maxLines: 2,
  fontSize: { min: 32, max: 48 },
  padding: { top: 40, bottom: 20 },
  alignment: ['left', 'center'] // allowed values
}
```

**Rules:**
- Contracts are immutable per grammar version
- Changes require version bump
- All templates must declare contracts

---

### 3. TEMPLATE SCHEMA

**Purpose:** Standardized template definitions.

**Schema Structure:**
```typescript
interface TemplateDefinition {
  id: string
  name: string
  category: TemplateCategory
  layoutContract: LayoutContract
  requiredFields: string[]
  optionalFields: string[]
  grammarVersion: string
}
```

**Benefits:**
- Self-documenting templates
- Compiler can validate at design-time
- Enables template discovery/selection

---

### 4. SCENE COMPILER

**Purpose:** Transform intent + strategy → pure JSON scene definition.

**Responsibilities:**
- Receive intent from dispatcher
- Apply strategy recommendations
- Enforce grammar rules
- Output renderer-agnostic JSON

**Critical:**
- NO React imports
- NO rendering logic
- Pure transformation only

**Output Format:**
```typescript
interface CompiledScene {
  sceneId: string
  template: string
  layoutData: Record<string, any>
  strategyApplied: string
  decisionTrace: DecisionLog
  qualityScore: number
  grammarVersion: string
}
```

---

### 5. INTENT DISPATCHER

**Purpose:** Route user input to appropriate processing pipeline.

**Routing Logic:**
```
Raw input → Parse → Classify intent type → Dispatch to specialized handler
```

**Intent Types:**
- Narration (story-driven)
- Data (fact-driven)
- Instruction (procedural)
- Question (exploratory)

**Outputs:**
- Structured intent objects
- Metadata (urgency, topic, tone indicators)

---

### 6. STRATEGY ENGINE

**Purpose:** Recommend visual approaches based on content analysis.

**Decision Process:**
```
Analyze content → Match patterns → Score strategies → Return ranked list
```

**Current Strategies:**
- Statistical presentation
- Comparison matrix
- Sequential narrative
- Problem/solution
- Emphasis + supporting detail

**Output:**
```typescript
interface StrategyRecommendation {
  strategyId: string
  confidence: number // 0-1
  reasoning: string[]
  rejectedAlternatives: RejectionTrace[]
}
```

---

### 7. SCENE FACTORY

**Purpose:** Instantiate scenes from compiled definitions.

**Responsibilities:**
- Hydrate templates with layout data
- Validate against layout contracts
- Return renderable scene objects (still JSON)

**Not Responsible For:**
- Rendering (that's downstream)
- Animation timing (that's cinematic layer)

---

### 8. GRAMMAR RULES + VALIDATOR

**Purpose:** Enforce compositional law.

**Rule Categories:**
- Spacing (margins, padding, gutters)
- Hierarchy (font sizes, weights, scales)
- Density (max elements per template)
- Alignment (grid systems, anchoring)

**Validation Flow:**
```
Scene compilation → Grammar check → Pass/Fail + reason
```

**If Fail:**
- Scene rejected
- Strategy must adapt or scene abandoned
- NO grammar exceptions

---

### 9. DETERMINISTIC MODE

**Purpose:** Guarantee identical output for identical input.

**Mechanisms:**
- Explicit seed for any randomness
- Timestamp-independent logic
- Sorted iterations (no Map/Set without sort)
- Logged decision points

**Testing:**
```javascript
const scene1 = compile(input, seed: 12345)
const scene2 = compile(input, seed: 12345)
assert(deepEqual(scene1, scene2)) // Must pass
```

---

### 10. GRAMMAR VERSIONING

**Purpose:** Evolve compositional rules without breaking existing content.

**Version Format:** `v{major}.{minor}`

**Rules:**
- Major bump: breaking layout changes
- Minor bump: additive rules only
- All scenes tagged with grammar version
- Compiler can target specific version

---

### 11. DECISION TRACE

**Purpose:** Full transparency into every choice made.

**Trace Structure:**
```typescript
interface DecisionTrace {
  timestamp: string
  layer: string // 'strategy' | 'grammar' | 'layout' | etc.
  decision: string
  inputs: Record<string, any>
  alternatives: string[]
  reasoning: string
  confidence?: number
}
```

**Use Cases:**
- Debugging unexpected outputs
- A/B testing strategies
- Training future AI layers

---

### 12. SCENE QUALITY SCORING

**Purpose:** Quantify how well a scene achieves its intent.

**Scoring Dimensions:**
- Layout efficiency (white space usage)
- Information density (appropriate for content)
- Grammar compliance (penalty for violations)
- Strategy confidence (how well strategy fits)

**Output:**
```typescript
interface QualityScore {
  overall: number // 0-100
  breakdown: {
    layout: number
    density: number
    grammar: number
    strategy: number
  }
  warnings: string[]
}
```


---

## CURRENT IMPLEMENTATION (PHASE 2)

### 🟡 STATUS: IN PROGRESS

---

### ALREADY COMPLETED IN PHASE 2:

#### ✅ Strategy Contracts
- Standardized strategy interface
- Confidence scoring (0-1 scale)
- Rejection trace for alternatives

#### ✅ Strategy Confidence + Rejection Trace
- Why was strategy X chosen over Y?
- What was the confidence delta?
- Logged for future ML training

#### ✅ Narrative Pacing Engine
- Detects narrative speed requirements
- Signals: fast, moderate, contemplative
- Integrates with density controller

#### ✅ Scene Density Controller
- Calculates information load per scene
- Prevents overwhelming viewers
- Coordinates with pacing signals

---

### 🔥 CURRENTLY IMPLEMENTING:

## EMOTIONAL WEIGHT DETECTION

**Purpose:** Understand the emotional gravity of content WITHOUT sentiment AI.

**Status:** In development  
**Target Completion:** Phase 2

---

### ARCHITECTURE

**Core Principle:** Rule-based, deterministic, explainable.

**NOT Using:**
- Sentiment analysis APIs
- ML emotion classifiers
- LLM-based affect detection

**Using:**
- Linguistic pattern matching
- Syntactic signal detection
- Contextual rule engines

---

### SIGNAL CATEGORIES

#### 1. Lexical Signals
**What:** Presence of emotionally-charged vocabulary.

**Detection:**
```typescript
const WEIGHT_LEXICON = {
  crisis: { weight: 0.9, category: 'urgency' },
  breakthrough: { weight: 0.8, category: 'achievement' },
  tragedy: { weight: 0.95, category: 'loss' },
  opportunity: { weight: 0.6, category: 'potential' }
  // ... extensive lexicon
}
```

**Rules:**
- Single word → base weight
- Multiple in proximity → amplification (max 1.0)
- Context modifiers (negation, mitigation)

---

#### 2. Syntactic Signals
**What:** Sentence structure patterns indicating emotional intensity.

**Patterns:**
- Exclamations: `!` → +0.2 weight
- Questions (rhetorical): `?` with no answer → +0.15
- Repetition: `"never, never, never"` → +0.3
- Absolutes: `always`, `nothing`, `everything` → +0.25
- Short declaratives: `< 5 words + period` → +0.2 (authority)

---

#### 3. Contextual Signals
**What:** Surrounding content that amplifies or dampens weight.

**Rules:**
- Contrast detection: `"but"`, `"however"` → weight transition
- Escalation: `"even worse"`, `"moreover"` → +0.15
- Mitigation: `"slightly"`, `"perhaps"` → -0.2
- Quotations: Direct speech → +0.1 (human voice = weight)

---

#### 4. Narrative Signals
**What:** Position within larger story arc.

**Patterns:**
- Opening statements → baseline weight
- Climactic sections → +0.3 (detected via pacing engine)
- Concluding statements → variable (depends on resolution type)

---

### WEIGHT SCORING SYSTEM

**Scale:** 0.0 (neutral) → 1.0 (maximum gravity)

**Calculation:**
```typescript
function calculateEmotionalWeight(content: string, context: NarrativeContext): number {
  let baseWeight = 0.0
  
  // Lexical contribution (40%)
  const lexicalScore = analyzeLexicon(content)
  
  // Syntactic contribution (30%)
  const syntacticScore = analyzeSyntax(content)
  
  // Contextual contribution (20%)
  const contextualScore = analyzeContext(content, context)
  
  // Narrative position (10%)
  const narrativeScore = analyzePosition(context)
  
  const rawWeight = (
    lexicalScore * 0.4 +
    syntacticScore * 0.3 +
    contextualScore * 0.2 +
    narrativeScore * 0.1
  )
  
  // Clamp to [0, 1]
  return Math.min(1.0, Math.max(0.0, rawWeight))
}
```

---

### WEIGHT CATEGORIES

**Neutral (0.0 - 0.3):**
- Informational content
- Procedural instructions
- Factual statements

**Moderate (0.3 - 0.6):**
- Opinions
- Comparisons
- Recommendations

**Elevated (0.6 - 0.8):**
- Warnings
- Opportunities
- Conflicts

**Critical (0.8 - 1.0):**
- Crises
- Breakthroughs
- Transformations
- Tragedies

---

### INTEGRATION POINTS

**Upstream Consumers:**

1. **Strategy Engine**
   - High weight → Emphasis strategies
   - Low weight → Informational strategies

2. **Pacing Engine**
   - Weight influences duration
   - High weight scenes get more time

3. **Density Controller**
   - High weight → Reduce density (let it breathe)
   - Low weight → Can afford higher density

4. **Reveal Engine** (Phase 2 next)
   - Weight determines reveal timing
   - Critical moments reveal slower

---

### DECISION TRACE INTEGRATION

**Every weight calculation must log:**
```typescript
interface WeightTrace {
  content: string
  finalWeight: number
  breakdown: {
    lexical: { score: number, triggers: string[] }
    syntactic: { score: number, patterns: string[] }
    contextual: { score: number, modifiers: string[] }
    narrative: { score: number, position: string }
  }
  appliedRules: string[]
  warnings: string[]
}
```

---

### ANTI-PATTERNS TO AVOID

❌ **Don't:** Use external sentiment APIs  
✅ **Do:** Build deterministic rule engine

❌ **Don't:** Let weight override grammar  
✅ **Do:** Use weight as input to strategy layer

❌ **Don't:** Apply weight retroactively  
✅ **Do:** Calculate during intent analysis phase

❌ **Don't:** Create weight-specific templates  
✅ **Do:** Let weight influence strategy selection

---

### SUCCESS CRITERIA

**Phase 2 completion requires:**

- [ ] Weight detection runs in < 10ms per scene
- [ ] 100% deterministic (same input → same weight)
- [ ] Full decision trace for every calculation
- [ ] Integration with strategy engine complete
- [ ] Integration with pacing engine complete
- [ ] Integration with density controller complete
- [ ] Zero external API dependencies
- [ ] Comprehensive test coverage (edge cases)


---

## COMPLETED SYSTEMS (PHASE 1)

### ✅ STATUS: PRODUCTION-READY

**Do NOT rebuild these unless critical flaws discovered:**

1. **Deterministic Layout Engine** - Enforces spatial contracts
2. **Locked Layout Contracts** - Immutable compositional rules
3. **Template Schema** - Standardized template definitions
4. **Scene Compiler** - Pure JSON transformation (NO React imports)
5. **Intent Dispatcher** - Routes user input to processors
6. **Strategy Engine** - Rule-based visual recommendations
7. **Scene Factory** - Instantiates scenes from definitions  
8. **Grammar Rules + Validator** - Compositional law enforcement
9. **Deterministic Mode** - Guaranteed identical outputs
10. **Grammar Versioning** - Evolvable rules without breaking changes
11. **Decision Trace** - Full transparency into all choices
12. **Scene Quality Scoring** - Quantified scene effectiveness

---

## CURRENT IMPLEMENTATION (PHASE 2)

### 🟡 IN PROGRESS

**Already Complete:**
- ✅ Strategy Contracts
- ✅ Strategy Confidence + Rejection Trace  
- ✅ Narrative Pacing Engine
- ✅ Scene Density Controller

**Currently Implementing:**

### EMOTIONAL WEIGHT DETECTION

**Purpose:** Deterministic, rule-based understanding of content gravity (0.0-1.0 scale)

**Signals:**
1. **Lexical** (40%): Weighted vocabulary (crisis=0.9, opportunity=0.6)
2. **Syntactic** (30%): Punctuation, repetition, absolutes, short declaratives
3. **Contextual** (20%): Contrast detection, escalation, mitigation
4. **Narrative** (10%): Position within story arc

**Integration:** Feeds Strategy, Pacing, Density, Reveal engines

**Constraints:**
- NO sentiment APIs or ML
- < 10ms calculation time
- 100% deterministic
- Full decision trace

---

## REMAINING ROADMAP

### PHASE 2 COMPLETION

## REVEAL ENGINE (Next to Build)

**Purpose:** Control WHEN information appears (not HOW it animates)

**Strategies:**
1. **IMMEDIATE** - All at once (low density, neutral weight)
2. **SEQUENTIAL** - One after another (lists, moderate density)  
3. **HIERARCHICAL** - Primary first, details follow (structured content)
4. **EMPHASIS_FIRST** - Buildup to climax (high weight > 0.8)
5. **CONTEXTUAL** - Background → foreground (explanatory)

**Guardrails:**
- MAX_REVEAL_EVENTS = 5 per scene
- MIN_REVEAL_SPACING = 0.4s
- Coordinates with Pacing (fast=0.6x, contemplative=1.5x)
- Coordinates with Density (high density → group elements)

**Output:** Pure timing JSON (renderer executes)

---

### PHASE 3: CINEMATIC INTELLIGENCE

## 1. TRANSITION INTELLIGENCE

**Purpose:** Semantic relationship-based transitions (NOT random presets)

**Relationships:**
- **CONTINUATION** → fade_fast, cut (same thread)
- **CONTRAST** → slide_opposite, wipe (opposing ideas)
- **ESCALATION** → push, accelerate_fade (building intensity)
- **DE_ESCALATION** → settle, decelerate_fade (releasing tension)
- **DIGRESSION** → offset_slide (temporary departure)
- **TEMPORAL_SHIFT** → ripple, dissolve (time jump)

**Vocabulary:** Maximum 12 transition types (consistency > novelty)

---

## 2. EMPHASIS SYSTEM

**Techniques:**
- **SCALE_EMPHASIS** - Enlarge critical elements (max 1.5x)
- **CONTRAST_ISOLATION** - Dim surroundings (opacity 0.4)
- **FOCUS_PUSH** - Sequential attention shifting
- **COLOR_ACCENT** - Introduce accent (limit 1 per scene)
- **SPATIAL_ISOLATION** - Increase whitespace

**Eligibility:** Headlines, bullets, stats, key phrases < 10 words  
**Threshold:** Only emphasize if weight > 0.6  
**Limit:** Max 2 emphasis events per scene

---

## 3. MOTION BEHAVIOR LIBRARY

**Personalities:**
- **AUTHORITATIVE** - Decisive, minimal easing, 300-400ms (news, data)
- **CALM** - Gentle, smooth, 500-700ms (explanatory, low weight)
- **ENERGETIC** - Bouncy, playful, 400-500ms (upbeat, positive)
- **TECHNICAL** - Linear, mechanical, 250-350ms (scientific, maximum clarity)

**Selection:** Content type (40%) + Emotional Weight (30%) + Pacing (20%) + User Preference (10%)

**Scope:** Affects ALL motion decisions (reveals, emphasis, transitions)

---

## 4. RHYTHM CONTROLLER

**Purpose:** Prevent robotic timing across scenes

**Patterns:**
- **NATURAL_VARIATION** - ±10-15% variance (default)
- **CRESCENDO** - Gradually decrease durations (escalation)
- **DECRESCENDO** - Gradually increase durations (de-escalation)
- **PUNCTUATED** - Occasional short "punch" scenes

**Constraints:**
- Min scene: 1.5s, Max scene: 8.0s
- Total duration ±5% tolerance
- Respects pacing signals

---

### PHASE 4: STYLE INTELLIGENCE

## 1. DESIGN TOKEN SYSTEM (Foundational)

**Categories:**
1. **COLOR** - Semantic roles (surface, text, semantic, brand)
2. **SPACING** - Scale-based (xxxs=4 to xxxl=96)
3. **TYPOGRAPHY** - Hierarchy (display, headline, title, body, caption)
4. **MOTION** - Durations (instant to slower) + Easing curves
5. **LAYOUT** - Grid, containers, aspect ratios, safe zones

**Critical:** Eliminates ALL hardcoded values. Compiler outputs token REFERENCES, renderer resolves.

**Versioning:** `tokens-v{major}.{minor}` - Major = breaking, Minor = additive

---

## 2. VISUAL LANGUAGE PROFILES

**Purpose:** Enable distinct styles WITHOUT template explosion

**Profiles (4 initial):**

1. **DOCUMENTARY** - Dark, serif headlines, calm motion, minimal transitions, high density
2. **VOX-LIKE** - Bright, sans-serif, energetic motion, frequent emphasis, medium density
3. **CINEMATIC** - High contrast, large type, authoritative motion, dramatic reveals, low density
4. **TECHNICAL** - Monospace accents, grid-visible, linear motion, immediate reveals, high density

**Mechanism:** Same templates + different token mappings + motion behavior + strategy biases

---

## 3. CONSISTENCY ENGINE

**Detects Drift in 4 Domains:**
1. **Typography** - Inconsistent hierarchy tokens
2. **Color** - Unjustified accent shifts
3. **Spacing** - Random padding/margin changes
4. **Motion** - Mixed behaviors

**Scoring:** 100 base, penalties (minor -5, major -15, critical -30)  
**Auto-Correction:** Normalize to most common OR profile compliance  
**Threshold:** 90+ excellent, 70-89 good, 50-69 fair, <50 poor

---

### PHASE 5: ADVANCED CREATIVE INTELLIGENCE

**WARNING:** Only after ALL prior phases stable (8-12 weeks)

## 1. VISUAL REASONING V2 (AI-ASSISTED)

**Architecture:** AI suggests → Rules validate → Decision logged

**AI Can:**
- Suggest strategies with reasoning + confidence
- Propose creative layout variations
- Learn from user feedback

**AI Cannot:**
- Generate scenes directly
- Override grammar rules
- Make final decisions without validation

**Guardrails:**
- Confidence threshold: ≥ 0.7
- Grammar ALWAYS validates
- Deterministic mode available (temp=0, seed)
- Fallback to rule-based on failure

---

## 2. MULTI-SCENE NARRATIVE AWARENESS

**Patterns Detected:**
1. **SETUP → PAYOFF** - Problem statement → solution
2. **ESCALATION** - Rising intensity across scenes
3. **CONTRAST PIVOT** - Negative → "BUT" → positive
4. **PARALLEL THREADS** - Interleaving topics → convergence

**Adjustments:**
- Escalation → crescendo rhythm, tighter transitions
- Setup/Payoff → elevate payoff weight, dramatic reveal
- Pivot → contrast transition
- Parallel → visual consistency within threads

---

## 3. STORY ARC CONSTRUCTION (Final)

**Most Advanced Feature - Plan Carefully**

**Arc Types:**
1. **CLASSIC (3-ACT)** - Setup 25% → Conflict 50% → Resolution 25%
2. **HERO'S JOURNEY** - Ordinary → Call → Trials → Transformation → Return
3. **IN MEDIAS RES** - Dramatic hook → flashback → return → resolution
4. **PYRAMID (Inverted)** - Conclusion first → details → context

**Capability:** Reorder scenes for optimal narrative flow

**Constraints:**
- Must respect logical dependencies
- User can accept/reject/override
- Optional system (not automatic)
- Requires all other Phase 5 systems mature

---

## ANTI-PATTERNS & GUARDRAILS

### FORBIDDEN PATTERNS

❌ **AI Generating Scenes Directly** - Bypasses validation, not traceable  
❌ **Renderer-Aware Compiler** - Couples cognition to presentation, not portable  
❌ **Strategy Overriding Grammar** - Breaks compositional law, creates chaos  
❌ **Cinematics Before Cognition** - Pretty chaos is still chaos, no differentiation  
❌ **Template Explosion** - Unmaintainable, use profiles instead  
❌ **Hardcoded Styling** - Can't evolve, use token system

### VALIDATION GATES

Every phase must pass:
1. **Determinism Test** - Same input → same output
2. **Decision Trace Completeness** - Every decision logged
3. **Grammar Enforcement** - No violations allowed
4. **Renderer Independence** - No rendering imports in compiler
5. **Layer Separation** - No upstream dependencies

---

## IMPLEMENTATION PROMPTS FOR ANTIGRAVITY

### PROMPT: EMOTIONAL WEIGHT DETECTION

```
CONTEXT: Implementing rule-based emotional weight detection (0.0-1.0) for motion graphics engine.

IMPLEMENTATION:
1. Create /src/cognitive/emotional-weight/lexicon.ts - 100+ weighted terms
2. Create /src/cognitive/emotional-weight/detector.ts - 4 analysis functions:
   - analyzeLexicon() - 40% contribution
   - analyzeSyntax() - 30% (punctuation, repetition, absolutes)
   - analyzeContext() - 20% (negation, mitigation, contrast)
   - analyzePosition() - 10% (narrative position)
3. Implement decision trace logging
4. Tests: determinism, edge cases, performance < 10ms

GUARDRAILS: NO external APIs, NO ML, MUST be deterministic, MUST log trace
```

---

### PROMPT: REVEAL ENGINE

```
CONTEXT: Implementing reveal timing control for scene elements.

IMPLEMENTATION:
1. Create /src/cinematic/reveal/strategies.ts - 5 strategies (IMMEDIATE, SEQUENTIAL, HIERARCHICAL, EMPHASIS_FIRST, CONTEXTUAL)
2. Create /src/cinematic/reveal/engine.ts - analyzeScene(), generateTimings(), validate()
3. Implement eligibility rules (headlines yes, paragraphs grouped)
4. Coordinate with pacing (fast=0.6x, contemplative=1.5x)
5. Coordinate with density (high → max 3 events, group rest)
6. Enforce guardrails (MAX_EVENTS=5, MIN_SPACING=0.4s, MAX_SIMULTANEOUS=2)
7. Decision trace logging
8. Tests: each strategy, coordination, conflicts, determinism

GUARDRAILS: Output timing ONLY, respect pacing/weight/density, prevent spam, deterministic
```

---

### PROMPT: TRANSITION INTELLIGENCE

```
CONTEXT: Implementing semantic relationship-based transitions.

IMPLEMENTATION:
1. Create /src/cinematic/transitions/relationships.ts - 6 types (CONTINUATION, CONTRAST, ESCALATION, DE_ESCALATION, DIGRESSION, TEMPORAL_SHIFT)
2. Create /src/cinematic/transitions/vocabulary.ts - 12 transition types categorized
3. Create /src/cinematic/transitions/engine.ts - analyzeRelationship(), selectTransition(), calculateDuration()
4. Implement detection: emotional delta, topic continuity, explicit markers
5. Selection algorithm: explicit > delta > continuity
6. Enforce constraints (maxConsecutiveRepeats=2, forbiddenPairs)
7. Decision trace with reasoning
8. Tests: each relationship, selection, constraints, determinism

GUARDRAILS: Max 12 types, semantic justification required, output timing only, respect pacing
```

---

### PROMPT: DESIGN TOKEN SYSTEM

```
CONTEXT: Implementing foundational token system to eliminate hardcoded values.

IMPLEMENTATION:
1. Create /src/style/tokens/definitions.ts - 5 categories (color, spacing, typography, motion, layout)
2. Create /src/style/tokens/system.ts - resolve(), validate(), getCategory(), trace()
3. Implement resolution with nested references, circular dependency detection, caching
4. Implement versioning (tokens-v{major}.{minor})
5. Create validator (completeness, reference validity, circular deps)
6. Create migration system (v1 → v2 upgrade path)
7. Tests: resolution, versioning, circular detection, performance < 1ms

GUARDRAILS: Zero hardcoded values after this, output references not values, enforce versioning, trace resolution
```

---

### PROMPT: VISUAL LANGUAGE PROFILES

```
CONTEXT: Implementing profile system for style variation without template duplication.

IMPLEMENTATION:
1. Create /src/style/profiles/definitions.ts - 4 profiles (DOCUMENTARY, VOX, CINEMATIC, TECHNICAL)
2. Create /src/style/profiles/system.ts - loadProfile(), applyProfile(), validateProfile()
3. Implement token override (profile tokens override base)
4. Implement behavior mapping (profile → motion behavior → strategy biases)
5. Strategy bias scoring (preferred +0.15, avoided -0.20)
6. Profile validator (token completeness, behavior exists, no conflicts)
7. Selection: user choice, content inference, preference storage
8. Tests: each profile, overrides, biases, same template different outputs, validation

GUARDRAILS: Limit 4-6 profiles, work across all templates, profiles as JSON data, maintain consistency
```

---

### PROMPT: VISUAL REASONING V2 (AI-ASSISTED)

```
CONTEXT: Implementing AI-assisted suggestions with strict validation gates.

IMPLEMENTATION:
1. Create /src/ai/interfaces/provider.ts - Abstract AI provider (OpenAI/Anthropic/local)
2. Create /src/ai/validation/validator.ts - validateSuggestion() with confidence threshold ≥ 0.7
3. Create /src/ai/integration/reasoning-v2.ts - getSuggestedStrategy() with validation + fallback
4. Implement deterministic mode (temp=0, seed support)
5. Create feedback system - recordFeedback() for accept/reject tracking
6. Implement fallback mechanism (rule-based on low confidence/grammar violation/unavailable)
7. Enhanced decision trace (AI details, validation, fallback reason)
8. Tests: suggestion flow, validation, fallback, deterministic mode, grammar supremacy

GUARDRAILS: AI NEVER bypasses compiler/validator, confidence ≥ 0.7, grammar ALWAYS validates, fallback MUST work, deterministic mode available
```

---

## SYSTEM DEPENDENCY ORDER

**Critical Path:**
```
Intent → Emotional Weight → Strategy → Density → Pacing → Reveal → Transitions → Rhythm → Renderer
```

**Integration Points:**
- Weight feeds: Strategy, Pacing, Density, Reveal
- Pacing feeds: Reveal timing, Transition duration, Rhythm patterns
- Density feeds: Reveal grouping, Element limits
- Strategy feeds: Template selection, Reveal strategy, Emphasis decisions

---

## QUALITY METRICS

**Track:**
1. **Determinism Rate** - Target: 100%
2. **Decision Trace Completeness** - Target: 100%
3. **Grammar Compliance** - Target: 100%
4. **Performance** - Target: < 100ms per scene compilation
5. **Strategy Accuracy** - Baseline: rule-based, Target: improve with AI
6. **User Satisfaction** - Acceptance rate

---

## KNOWLEDGE TRANSFER RULES

1. **Always read this document first** - Understand what exists
2. **Never rebuild completed systems** - Unless critical flaw
3. **Respect architectural principles** - Non-negotiable
4. **Use implementation prompts** - Production-grade guidance
5. **Maintain decision traces** - Explainability critical

---

## CONCLUSION

**This is a long-horizon platform build.** Months of work.

**Success factors:**
- Discipline (respect the order)
- Patience (cognition before spectacle)
- Rigor (determinism always)
- Vision (differentiation through intelligence)

**The Goal:** Build an autonomous visual narrative engine that feels **directed, not assembled**.

**This document is the map. Follow it.**

---

**END OF MASTER PLAN**

Version: 1.0 | Date: February 2026 | Status: Master Execution Document

---

# PHASE 2 COMPLETION

## REVEAL ENGINE

**Status:** Next to implement  
**Dependencies:** Emotional Weight, Pacing, Density  
**Priority:** HIGH — First cinematic layer

---

### PURPOSE

Control WHEN and HOW information appears within a scene.

**This Is NOT:**
- Random animation presets
- Transition effects between scenes
- Motion graphics library

**This IS:**
- Cognitive control of information disclosure
- Narrative-driven reveal timing
- Deterministic reveal strategies

---

### REVEAL STRATEGIES

#### 1. IMMEDIATE
**All elements visible at scene start.**

**Use When:**
- Low information density
- Neutral emotional weight
- Fast pacing required
- Simple factual statement

#### 2. SEQUENTIAL
**Elements appear one after another.**

**Timing Formula:**
```typescript
const baseDelay = 0.6 // seconds
const weightMultiplier = 1 + (emotionalWeight * 0.5)
const pacingMultiplier = pacingSpeed === 'fast' ? 0.7 : 1.0

const delayBetweenElements = baseDelay * weightMultiplier * pacingMultiplier
```

#### 3. HIERARCHICAL
**Primary elements first, supporting details follow.**

#### 4. EMPHASIS_FIRST
**Most important element reveals last (buildup).**

#### 5. CONTEXTUAL
**Background first, foreground last.**

---

### REVEAL SPAM PREVENTION

**Guardrails:**

1. **Maximum Events Per Scene:** 5
2. **Minimum Time Between Reveals:** 0.4 seconds
3. **Simultaneous Reveal Limit:** 2

---

### SUCCESS CRITERIA

- [ ] Strategy selection is deterministic
- [ ] Respects pacing, weight, density signals
- [ ] Prevents reveal spam via guardrails
- [ ] Outputs pure timing data (renderer-agnostic)
- [ ] Full decision trace for every scene
- [ ] Zero rendering library imports

---

# PHASE 3: CINEMATIC INTELLIGENCE

**Status:** Design phase  
**Start After:** Phase 2 complete (Reveal Engine shipped)  
**Duration Estimate:** 4-6 weeks

**Purpose:** Add directorial intelligence to transform functional scenes into cinematic experiences.

---

## TRANSITION INTELLIGENCE

**Purpose:** Choose transitions between scenes based on semantic relationship.

### SEMANTIC RELATIONSHIP TYPES

1. **CONTINUATION** - Same narrative thread → Minimal disruption
2. **CONTRAST** - Opposing ideas → Clean break
3. **ESCALATION** - Intensity increases → Momentum-building
4. **DE-ESCALATION** - Intensity decreases → Tension release
5. **DIGRESSION** - Temporary departure → Distinct visual treatment
6. **TEMPORAL_SHIFT** - Jump in time → Clear temporal signaling

### TRANSITION VOCABULARY (Max 12 types)

- FADE_FAST, FADE_STANDARD, CUT
- SLIDE_OPPOSITE, WIPE
- PUSH, ACCELERATE_FADE
- SETTLE, DECELERATE_FADE
- OFFSET_SLIDE, ZOOM_OUT_IN
- RIPPLE, DISSOLVE

---

## EMPHASIS SYSTEM

**Purpose:** Direct viewer attention through visual hierarchy.

### EMPHASIS TECHNIQUES

1. **SCALE_EMPHASIS** - Increase size (max 1.5x)
2. **CONTRAST_ISOLATION** - Reduce surrounding elements
3. **FOCUS_PUSH** - Sequential de-emphasis/re-emphasis
4. **COLOR_ACCENT** - Introduce accent color
5. **SPATIAL_ISOLATION** - Increase whitespace

**Constraint:** Max 2 emphasis events per scene

---

## MOTION BEHAVIOR LIBRARY

**Purpose:** Define motion personalities for consistent visual language.

### MOTION PERSONALITIES

1. **AUTHORITATIVE** - Decisive, minimal easing, 300-400ms
2. **CALM** - Gentle, smooth, 500-700ms
3. **ENERGETIC** - Bouncy, playful, 400-500ms
4. **TECHNICAL** - Linear, mechanical, 250-350ms

---

## RHYTHM CONTROLLER

**Purpose:** Prevent robotic, metronomic timing.

### RHYTHM PATTERNS

1. **NATURAL_VARIATION** - ±10-15% variance
2. **CRESCENDO** - Gradually decrease durations
3. **DECRESCENDO** - Gradually increase durations
4. **PUNCTUATED** - Occasional short "punch" scenes

---

# PHASE 4: STYLE INTELLIGENCE

**Status:** Design phase  
**Start After:** Phase 3 complete  
**Duration Estimate:** 4-6 weeks

**Purpose:** Create a centralized design system that eliminates hardcoded values.

---

## DESIGN TOKEN SYSTEM

**Purpose:** Centralize ALL design decisions.

### TOKEN CATEGORIES

1. **COLOR TOKENS** - Semantic roles (not specific colors)
2. **SPACING TOKENS** - Scale-based system (xxxs → xxxl)
3. **TYPOGRAPHY TOKENS** - Hierarchical (display → caption)
4. **MOTION TOKENS** - Timing + easing centralized
5. **LAYOUT TOKENS** - Grid + composition rules

**Critical:** Compiler outputs token REFERENCES, renderer resolves values.

---

## VISUAL LANGUAGE PROFILES

**Purpose:** Enable distinct visual styles WITHOUT creating new templates.

### INITIAL PROFILES

1. **DOCUMENTARY** - Dark, serif, calm, minimal transitions
2. **VOX-LIKE** - Bright, colorful, energetic, frequent emphasis
3. **CINEMATIC** - High contrast, dramatic reveals, low density
4. **TECHNICAL** - Monospace, linear motion, high density

**Same templates → Different token mappings → Different visual output**

---

## CONSISTENCY ENGINE

**Purpose:** Detect and correct stylistic drift across scenes.

### CONSISTENCY DOMAINS

1. Typography consistency
2. Color consistency
3. Spacing consistency
4. Motion consistency

### AUTO-CORRECTION STRATEGIES

1. NORMALIZE_TO_MOST_COMMON
2. NORMALIZE_TO_PROFILE
3. PRESERVE_INTENTIONAL_VARIANCE

**Scoring:** 0-100 with penalties for minor (-5), major (-15), critical (-30) drifts

---

# PHASE 5: ADVANCED CREATIVE INTELLIGENCE

**Status:** Design phase  
**Start After:** Phase 4 complete  
**Duration Estimate:** 8-12 weeks

**Warning:** Most complex phase. Only start when all prior phases stable.

---

## VISUAL REASONING V2 (AI-ASSISTED)

**Purpose:** Allow AI to SUGGEST strategies, but grammar + validator remain gatekeepers.

### ARCHITECTURE PRINCIPLES

1. **AI AS ADVISOR, NOT CONTROLLER**
   - AI suggests → Rules validate → Human-reviewable decision

2. **EXPLAINABILITY MANDATE**
   - Every AI suggestion includes: confidence score, reasoning chain, alternatives

### GUARDRAILS

1. Confidence threshold: MIN = 0.7
2. Grammar supremacy (AI cannot override)
3. Deterministic mode option (AI uses seed)
4. Human review mode available

---

## MULTI-SCENE NARRATIVE AWARENESS

**Purpose:** Understand narrative relationships ACROSS scenes.

### NARRATIVE PATTERNS

1. **SETUP → PAYOFF** - Problem established → solution revealed
2. **ESCALATION CHAINS** - Rising emotional weight
3. **CONTRAST PIVOTS** - Emotional polarity shifts
4. **PARALLEL THREADS** - Interleaved topics converge

### ARC-BASED ADJUSTMENTS

- Escalation → Crescendo rhythm + tighter transitions
- Setup/Payoff → Elevate payoff scene + dramatic reveal
- Contrast Pivot → Contrast transition + pacing shift

---

## STORY ARC CONSTRUCTION

**Purpose:** Automatically shape narrative flow for optimal impact.

**Warning:** Only implement at Phase 5 end after ALL other systems stable.

### ARC TYPES

1. **CLASSIC (3-ACT)** - Setup → Conflict → Resolution
2. **HERO'S JOURNEY** - Ordinary World → Trials → Transformation
3. **IN MEDIAS RES** - Dramatic moment → Flashback → Resolution
4. **PYRAMID (INVERTED)** - Conclusion first → Supporting details

**Critical:** User must be able to accept/reject/override proposed ordering.

---

# ANTI-PATTERNS & GUARDRAILS

## FORBIDDEN PATTERNS

### 1. AI GENERATING SCENES DIRECTLY
**Why Forbidden:** Bypasses grammar validation, no decision trace, not deterministic

### 2. RENDERER-AWARE COMPILER
**Why Forbidden:** Couples cognition to presentation, not portable

### 3. STRATEGY OVERRIDING GRAMMAR
**Why Forbidden:** Breaks compositional law, creates visual chaos

### 4. CINEMATICS BEFORE COGNITION
**Why Forbidden:** Pretty chaos is still chaos, no differentiation

### 5. TEMPLATE EXPLOSION
**Why Forbidden:** Unmaintainable, no consistency

### 6. HARDCODED STYLING
**Why Forbidden:** Can't evolve, no design system

---

## VALIDATION GATES

**Every Phase Must Pass:**

1. **Determinism Test**
   ```typescript
   assert(compile(input, seed) === compile(input, seed))
   ```

2. **Decision Trace Completeness**
3. **Grammar Enforcement**
4. **Renderer Independence**
5. **Layer Separation**

---

# IMPLEMENTATION PROMPTS

## FOR ANTIGRAVITY (AI CODING ASSISTANT)

Each prompt below is **production-grade** and ready to paste.

---

### PROMPT 1: EMOTIONAL WEIGHT DETECTION

```
CONTEXT:
You are implementing the Emotional Weight Detection system for an autonomous motion graphics engine.

GOAL:
Build a deterministic, rule-based system that calculates emotional weight (0.0 - 1.0).

IMPLEMENTATION STEPS:

1. Create `/src/cognitive/emotional-weight/lexicon.ts`
   - Define WEIGHT_LEXICON with 100+ terms
   - Categories: urgency, achievement, loss, potential

2. Create `/src/cognitive/emotional-weight/detector.ts`
   - Implement calculateEmotionalWeight(content, context)
   - Formula: (lexical × 0.4) + (syntactic × 0.3) + (contextual × 0.2) + (narrative × 0.1)

3. Create decision trace integration

GUARDRAILS:
- NO external APIs
- Must be < 10ms per scene
- 100% deterministic

SUCCESS CRITERIA:
- All tests pass
- Full integration with Strategy, Pacing, Density engines
```

---

### PROMPT 2: REVEAL ENGINE

```
CONTEXT:
Implementing the Reveal Engine - controls WHEN and HOW information appears.

GOAL:
Generate reveal timelines based on cognitive signals.

IMPLEMENTATION STEPS:

1. Create `/src/cinematic/reveal/strategies.ts`
   - Implement 5 strategies: immediate, sequential, hierarchical, emphasis_first, contextual

2. Create `/src/cinematic/reveal/eligibility.ts`
   - Detect revealable elements

3. Create `/src/cinematic/reveal/engine.ts`
   - Enforce guardrails: MAX_EVENTS=5, MIN_SPACING=0.4s

GUARDRAILS:
- Output ONLY timing data (renderer-agnostic)
- Prevent reveal spam

SUCCESS CRITERIA:
- Deterministic strategy selection
- Coordinates with pacing/weight/density
```

---

### PROMPT 3: TRANSITION INTELLIGENCE

```
CONTEXT:
Transitions chosen by semantic relationship, NOT random presets.

GOAL:
Analyze scene pairs and select appropriate transitions.

IMPLEMENTATION STEPS:

1. Create `/src/cinematic/transitions/relationships.ts`
   - Detect 6 relationship types

2. Create `/src/cinematic/transitions/vocabulary.ts`
   - Define 12 transition types (max)

3. Create `/src/cinematic/transitions/selector.ts`
   - Implement selection algorithm

GUARDRAILS:
- Maximum 12 transition types
- Semantic justification required

SUCCESS CRITERIA:
- All 6 relationship types detected
- Constraints prevent transition overload
```

---

### PROMPT 4: DESIGN TOKEN SYSTEM

```
CONTEXT:
Centralize ALL design decisions, eliminate hardcoded values.

GOAL:
Create token-based design system with versioning.

IMPLEMENTATION STEPS:

1. Create `/src/style/tokens/definitions.ts`
   - 5 categories: color, spacing, typography, motion, layout

2. Create `/src/style/tokens/resolver.ts`
   - Handle token references and resolution

3. Update all code to use tokens

GUARDRAILS:
- NO hardcoded values anywhere
- Compiler outputs token REFERENCES

SUCCESS CRITERIA:
- Zero hardcoded values in codebase
- Versioning system works
```

---

### PROMPT 5: VISUAL LANGUAGE PROFILES

```
CONTEXT:
Enable distinct visual styles WITHOUT creating new templates.

GOAL:
Create 4 production-ready profiles.

IMPLEMENTATION STEPS:

1. Create `/src/style/profiles/definitions/`
   - documentary.ts, vox-like.ts, cinematic.ts, technical.ts

2. Create profile selection and application logic

GUARDRAILS:
- Same templates must work with all profiles
- Profiles are DATA (JSON-like)

SUCCESS CRITERIA:
- 4 distinct profiles production-ready
- Zero template duplication required
```

---

# APPENDIX: DEPENDENCY MATRIX

## Layer Dependencies

```
Layer 0 (Foundation):
- Design Token System → (none)

Layer 1 (Structural):
- Layout Engine → Design Tokens
- Grammar Rules → Layout Engine

Layer 2 (Compilation):
- Scene Compiler → Grammar, Layout

Layer 3 (Cognitive):
- Emotional Weight → Intent Dispatcher
- Pacing Engine → Emotional Weight
- Density Controller → Weight + Pacing

Layer 4 (Strategic):
- Strategy Engine → Cognitive signals

Layer 5 (Cinematic):
- Reveal Engine → Cognitive + Strategy
- Transition Intelligence → Weight + Pacing
- Emphasis System → Reveal + Layout

Layer 6 (Style):
- Visual Profiles → Design Tokens
- Consistency Engine → Profiles

Layer 7 (Advanced):
- Narrative Awareness → All cognitive + cinematic
- Story Arc Construction → Narrative Awareness
```

---

# CLOSING NOTES

## For Future Developers/Agents

This document is the **authoritative source of truth**.

## For Antigravity Specifically

- Read relevant sections fully before coding
- Follow architecture exactly
- Implement decision traces from start
- Write tests for determinism
- Validate against anti-patterns

---

**END OF MASTER PLAN**

---

## DOCUMENT MAINTENANCE

Update this document when:
- A phase completes
- Architecture changes approved
- New anti-patterns discovered

**Owner:** Platform Architect  
**Version:** 1.0 (Feb 2026)
