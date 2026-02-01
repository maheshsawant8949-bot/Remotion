import { INTENT_MAP, PRIMITIVES, SceneIntent, TemplateType, NarrativeRole, DecisionTrace, GRAMMAR_VERSION } from './grammar-rules';

export interface CompiledScene {
  layout: TemplateType;
  role?: NarrativeRole;
  grammarVersion: string;
  layers: any[];
  warnings: string[];
  trace?: DecisionTrace;
}

export type ContentPayload = {
  primaryText?: string;
  secondaryText?: string;
  data?: any; // For charts/counters
  assetUrl?: string; // For 3D models, images, SVGs
  items?: string[]; // For timeline steps
};

export const SceneFactory = {
  // Initialize a scene structure based on high-level intent
  create: (intent: SceneIntent): CompiledScene => {
    const mapping = INTENT_MAP[intent.type];
    const templateKey = mapping.primary;
    
    // Augment trace with selection logic
    const finalTrace = {
        ...intent.trace,
        templateSelection: `Selected '${templateKey}' for intent '${intent.type}'`
    };
    
    // Fallback validation to prevent "undefined" error if import order is messed up
    const safeVersion = GRAMMAR_VERSION || "1.0";

    return {
      layout: templateKey,
      role: intent.role,
      grammarVersion: safeVersion,
      trace: finalTrace,
      layers: [],
      warnings: []
    };
  },

  // "Correct by Construction": Only add layers if they satisfy the Contract
  addLayer: (scene: CompiledScene, layer: { id: string; type: string; position?: string; [key: string]: any }) => {
    const contract = PRIMITIVES[scene.layout];
    
    // 1. Check Layer Type
    if (!contract.allowedLayerTypes.includes(layer.type)) {
      console.warn(`[SceneFactory] Rejected layer '${layer.id}': Type '${layer.type}' is forbidden in '${scene.layout}'.`);
      return; 
    }

    // 2. Check Region (if explicit)
    if (typeof layer.position === 'string' && layer.position.includes('.')) {
      const region = layer.position.split('.')[1];
      if (!contract.allowedRegions.includes(region)) {
        console.warn(`[SceneFactory] Rejected layer '${layer.id}': Region '${region}' is not defined in '${scene.layout}'.`);
        return;
      }
    }

    // 3. Check Forbidden Pairs
    if (contract.forbiddenPairs) {
        const existingTypes = new Set(scene.layers.map(l => l.type));
        for (const [a, b] of contract.forbiddenPairs) {
            if ((layer.type === a && existingTypes.has(b)) || (layer.type === b && existingTypes.has(a))) {
                 console.warn(`[SceneFactory] Rejected layer '${layer.id}': Cannot mix '${layer.type}' with existing type in '${scene.layout}'.`);
                 return;
            }
        }
    }

    // 4. Check Max Per Type
    if (contract.maxPerType && contract.maxPerType[layer.type]) {
        const currentCount = scene.layers.filter(l => l.type === layer.type).length;
        if (currentCount >= contract.maxPerType[layer.type]) {
            console.warn(`[SceneFactory] Rejected layer '${layer.id}': Max limit (${contract.maxPerType[layer.type]}) reached for type '${layer.type}'.`);
            return;
        }
    }

    // 5. Check Max Primary Visuals
    // Primary Visuals = Heavy/Main elements
    const PRIMARY_TYPES = ['three', 'video', 'bar_chart', 'timeline', 'image', 'svg'];
    if (contract.maxPrimaryVisuals && PRIMARY_TYPES.includes(layer.type)) {
        const currentPrimaryCount = scene.layers.filter(l => PRIMARY_TYPES.includes(l.type)).length;
        if (currentPrimaryCount >= contract.maxPrimaryVisuals) {
            console.warn(`[SceneFactory] Rejected layer '${layer.id}': Scene allows only ${contract.maxPrimaryVisuals} primary visual.`);
            return;
        }
    }

    scene.layers.push(layer);
  },

  // Full Builder: Intent + Content -> Valid Scene
  buildScene: (intent: SceneIntent, payload: ContentPayload): CompiledScene => {
      const scene = SceneFactory.create(intent);

      // MAPPING STRATEGY pattern based on Layout
      switch (scene.layout) {
          case 'title':
              if (payload.primaryText) {
                  SceneFactory.addLayer(scene, { 
                      id: 'title_text', type: 'text', position: 'main', 
                      content: payload.primaryText, fontSize: 80 
                  });
              }
              if (payload.assetUrl) {
                  SceneFactory.addLayer(scene, {
                      id: 'title_logo', type: 'image', position: 'main',
                      src: payload.assetUrl
                  });
              }
              break;

          case 'hero':
              if (payload.assetUrl) {
                  SceneFactory.addLayer(scene, {
                      id: 'hero_model', type: 'three', position: 'hero.heroVisual',
                      model: payload.assetUrl
                  });
              }
              if (payload.primaryText) {
                  SceneFactory.addLayer(scene, {
                      id: 'hero_caption', type: 'text', position: 'hero.caption',
                      content: payload.primaryText, fontSize: 40
                  });
              }
              break;

          case 'data':
               if (payload.data && Array.isArray(payload.data)) {
                   SceneFactory.addLayer(scene, {
                       id: 'chart_main', type: 'bar_chart', position: 'chart',
                       data: payload.data
                   });
               } else if (payload.primaryText && payload.primaryText.match(/\d+/)) {
                   // Fallback: Text contains number -> Counter
                   SceneFactory.addLayer(scene, {
                       id: 'stat_counter', type: 'counter', position: 'counter',
                       value: parseInt(payload.primaryText.match(/\d+/)![0]),
                       label: payload.secondaryText || "Value"
                   });
               }
               break;

           case 'process':
               if (payload.items) {
                   SceneFactory.addLayer(scene, {
                       id: 'process_timeline', type: 'timeline', position: 'timeline',
                       steps: payload.items
                   });
               }
               break;

           case 'diagram':
               if (payload.assetUrl) {
                    SceneFactory.addLayer(scene, {
                        id: 'diagram_svg', type: 'svg', position: 'diagram.mainVisual',
                        src: payload.assetUrl
                    });
               }
               if (payload.primaryText) {
                   // Note: 'text' type is forbidden in strict Diagram. Must use Callout or Group.
                   // But let's try 'callout' which allows text content.
                   SceneFactory.addLayer(scene, {
                       id: 'diagram_note', type: 'callout', position: 'diagram.supporting',
                       text: payload.primaryText
                   });
               }
               break;
      }

      return scene;
  }
};
