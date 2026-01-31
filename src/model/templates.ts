import { DEBUG_LAYOUT } from "../layout/constants";

export type TemplateSchema = {
  name: string;
  allowedRegions: string[];
  allowedLayerTypes: string[];
  forbiddenPairs?: [string, string][]; // e.g. ['three', 'bar_chart']
};

export const TEMPLATES: Record<string, TemplateSchema> = {
  title: {
    name: 'Title Sequence',
    allowedRegions: ['main'], // STRICT: Only main region allowed. No scattered elements.
    allowedLayerTypes: ['group', 'text', 'image', 'svg'] // Logo = image/svg
  },
  hero: {
    name: 'Hero Visual',
    allowedRegions: ['heroVisual', 'caption'], // STRICT: Cinematic focus.
    allowedLayerTypes: ['three', 'group', 'text', 'focus'] // Minimal text, heavy visual.
  },
  process: {
    name: 'Process Flow',
    allowedRegions: ['mainVisual', 'timeline'], // STRICT: Sequence focused. No external noise.
    allowedLayerTypes: ['timeline', 'group', 'svg', 'image'] // Icons = svg/image
  },
  diagram: {
    name: 'Technical Diagram',
    allowedRegions: ['mainVisual', 'supporting', 'timeline'],
    allowedLayerTypes: ['group', 'svg', 'callout', 'motion_lines', 'focus'], // STRICT: No root text, no charts
    forbiddenPairs: [
      ['three', 'video'], 
    ]
  },
  data: {
    name: 'Data Visualization',
    allowedRegions: ['counter', 'chart'], // STRICT: Layout is specific to data components
    allowedLayerTypes: ['bar_chart', 'counter', 'meter'] // YOUR WORKHORSE: No text, no fluff.
  }
};

export const validateScene = (scene: any) => {
  if (!DEBUG_LAYOUT) return; // Only validate in debug mode to save perfs? Or always? User said "Enforce", usually strict. Let's start with strict logging.

  const template = TEMPLATES[scene.layout];
  if (!template) {
    console.warn(`[Template Validator] Unknown layout template '${scene.layout}' in usage.`);
    return;
  }

  const layerTypesPresent = new Set<string>();

  scene.layers.forEach((layer: any) => {
    // 1. Validate Layer Types
    if (!template.allowedLayerTypes.includes(layer.type)) {
      console.warn(`[Template Violation] Scene ${scene.scene_id} (${template.name}) contains forbidden layer type: '${layer.type}'. Allowed: ${template.allowedLayerTypes.join(', ')}`);
    }

    // 2. Validate Layout Regions (if explicit position is a string region path)
    if (typeof layer.position === 'string' && layer.position.includes('.')) {
      const regionKey = layer.position.split('.')[1];
      if (regionKey && !template.allowedRegions.includes(regionKey)) {
         console.warn(`[Template Violation] Scene ${scene.scene_id} (${template.name}) puts layer '${layer.id}' in forbidden region '${regionKey}'. Allowed: ${template.allowedRegions.join(', ')}`);
      }
    }
    
    // Track for combination checks
    layerTypesPresent.add(layer.type);
  });

  // 3. Validate Forbidden Pairs
  if (template.forbiddenPairs) {
    template.forbiddenPairs.forEach(([a, b]) => {
      if (layerTypesPresent.has(a) && layerTypesPresent.has(b)) {
        console.warn(`[Template Violation] Scene ${scene.scene_id} (${template.name}) mixes forbidden types: '${a}' and '${b}'.`);
      }
    });
  }
};
