// Validator
// Purpose: The final gatekeeper.
// Runs against the compiled JSON to ensure no Forbidden Combinations exist.

import { PRIMITIVES, TemplateType, GRAMMAR_VERSION } from './grammar-rules';

export class SceneValidationError extends Error {
  public errors: string[];
  public sceneId: string | number;

  constructor(sceneId: string | number, errors: string[]) {
    super(`Validation Failed for Scene ${sceneId}: ${errors.join(', ')}`);
    this.name = 'SceneValidationError';
    this.sceneId = sceneId;
    this.errors = errors;
  }
}

export const validateCompiledScene = (scene: { layout: string, layers: any[], scene_id?: number | string, grammarVersion?: string }): void => {
  const errors: string[] = [];

  // 0. Validate Grammar Version
  const expectedVersion = GRAMMAR_VERSION || "1.0";
  if (scene.grammarVersion !== expectedVersion) {
      errors.push(`Grammar Version Mismatch: Scene is '${scene.grammarVersion}', Compiler expected '${expectedVersion}'`);
  }
  
  // Use the Grammar as the source of truth
  const templateKey = scene.layout as TemplateType;
  const contract = PRIMITIVES[templateKey];

  if (!contract) {
    throw new SceneValidationError(scene.scene_id ?? 'unknown', [`Unknown layout template '${scene.layout}'`]);
  }

  const layerTypesPresent = new Set<string>();
  const layerCounts: Record<string, number> = {};
  const PRIMARY_TYPES = ['three', 'video', 'bar_chart', 'timeline', 'image', 'svg'];
  let primaryVisualCount = 0;

  scene.layers.forEach((layer: any) => {
    // 1. Validate Layer Types
    if (!contract.allowedLayerTypes.includes(layer.type)) {
      errors.push(`Layer '${layer.id}' has forbidden type '${layer.type}'. Allowed: ${contract.allowedLayerTypes.join(', ')}`);
    }

    // 2. Validate Layout Regions
    if (typeof layer.position === 'string' && layer.position.includes('.')) {
      const regionKey = layer.position.split('.')[1];
      if (regionKey && !contract.allowedRegions.includes(regionKey)) {
         errors.push(`Layer '${layer.id}' is in forbidden region '${regionKey}'. Allowed: ${contract.allowedRegions.join(', ')}`);
      }
    }
    
    // Track stats for counts
    layerTypesPresent.add(layer.type);
    layerCounts[layer.type] = (layerCounts[layer.type] || 0) + 1;
    if (PRIMARY_TYPES.includes(layer.type)) {
        primaryVisualCount++;
    }
  });

  // 3. Validate Forbidden Pairs
  if (contract.forbiddenPairs) {
    contract.forbiddenPairs.forEach(([a, b]) => {
      if (layerTypesPresent.has(a) && layerTypesPresent.has(b)) {
        errors.push(`Scene mixes forbidden types: '${a}' and '${b}'`);
      }
    });
  }

  // 4. Validate Max Per Type
  if (contract.maxPerType) {
      Object.entries(contract.maxPerType).forEach(([type, max]) => {
          if ((layerCounts[type] || 0) > max) {
              errors.push(`Too many '${type}' layers. Found ${layerCounts[type]}, Max ${max}`);
          }
      });
  }

  // 5. Validate Max Primary Visuals
  if (contract.maxPrimaryVisuals !== undefined) {
      if (primaryVisualCount > contract.maxPrimaryVisuals) {
          errors.push(`Too many primary visuals. Found ${primaryVisualCount}, Max ${contract.maxPrimaryVisuals}`);
      }
  }

  if (errors.length > 0) {
    throw new SceneValidationError(scene.scene_id ?? 'unknown', errors);
  }
};
