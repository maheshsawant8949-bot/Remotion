/**
 * Camera Movement Intelligence
 * 
 * Adds subtle camera movement intent after framing and motion curves.
 * 
 * Stillness is what makes movement feel expensive.
 * Movement should be felt — not noticed.
 */

export { 
  type CameraMovement, 
  type CameraMovementResult 
} from './movement-types';

export { 
  MOVEMENT_CHARACTERISTICS,
  MOVEMENT_TARGETS,
  MOVEMENT_LIMITS,
  getMovementCharacteristics,
} from './movement-principles';

export { 
  MovementResolver,
  type MovementContext,
} from './movement-resolver';

export { 
  MovementGovernor,
  type MovementState,
} from './movement-governor';
