/**
 * Micro-Interactions
 * 
 * Lightweight refinement layer that enhances visual smoothness and perceived craftsmanship
 * WITHOUT adding visual noise.
 * 
 * This layer must support motion, never compete with it.
 * Stillness is sophistication. Do not animate everything.
 */

export {
  type MicroInteraction,
  type MicroInteractionResult,
} from './interaction-types';

export {
  INTERACTION_CHARACTERISTICS,
  INTERACTION_TARGETS,
  INTERACTION_LIMITS,
  getInteractionTarget,
  validateInteractionDistribution,
} from './interaction-principles';

export {
  InteractionResolver,
  type InteractionContext,
} from './interaction-resolver';

export {
  InteractionGovernor,
} from './interaction-governor';
