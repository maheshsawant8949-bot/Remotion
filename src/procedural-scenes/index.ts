/**
 * Procedural Scene Engine
 * 
 * Deterministic procedural graphics engine capable of generating explanation-driven
 * visuals aligned with narrative intent, style system, and motion constraints.
 * 
 * This is NOT an animation sandbox.
 * It is a visual explanation engine.
 * 
 * Pipeline order:
 * 1. Scene compilation
 * 2. Audio timing
 * 3. Asset strategy
 * 4. 👉 PROCEDURAL SCENE ENGINE (this module)
 * 5. Render preparation
 * 
 * Procedural scenes must compete with stock—not feel like fallback.
 * Whitespace feels premium. Clarity > cleverness. Always.
 */

export {
  type ProceduralTrigger,
  ProceduralStrategy,
} from './procedural-strategy';

export {
  type SceneArchetype,
  type ArchetypeMetadata,
  ARCHETYPE_DEFINITIONS,
  ArchetypeSelector,
} from './scene-archetypes';

export {
  type Layout,
  type LayoutRegion,
  type SpacingConfig,
  LayoutGenerator,
} from './layout-generator';

export {
  type ElementType,
  type Element,
  type ElementStyle,
  ElementFactory,
} from './element-factory';

export {
  type AnimationPattern,
  type Animation,
  AnimationOrchestrator,
} from './animation-orchestrator';

export {
  type ComplexityMetrics,
  ComplexityGovernor,
} from './complexity-governor';

export {
  type StyleProfile,
  ProceduralStyleMapper,
} from './procedural-style-mapper';
