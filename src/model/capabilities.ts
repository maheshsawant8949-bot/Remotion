export type LayerCapability = 
  | 'focusable'        // Can be highlighted by FocusLayer
  | 'callout-target'   // Can be pointed to by CalloutLayer
  | 'effect-parent'    // Can contain/parent effects like MotionLines
  | 'animatable'       // Supports enter/loop animations
  | 'layout-root';     // Can be a top-level layout anchor

export const LAYER_CAPABILITIES: Record<string, LayerCapability[]> = {
  group: ['focusable', 'callout-target', 'effect-parent', 'animatable'],
  three: ['focusable', 'effect-parent', 'animatable'], // 3D models can be focused and have effects
  svg: ['focusable', 'callout-target', 'animatable'],
  text: ['focusable', 'animatable'],
  image: ['focusable', 'animatable'],
  shape: ['focusable', 'animatable'],
  
  // specialized layers
  timeline: ['focusable', 'animatable'],
  bar_chart: ['focusable', 'animatable'], // alias chart to bar_chart
  chart: ['focusable', 'animatable'],
  
  // effects/utilities (cannot be targets)
  motion_lines: ['animatable'],
  callout: ['animatable'],
  focus: [],
  transition: []
};

/**
 * Helper to check if a layer type supports a capability
 */
export const layerHasCapability = (type: string, capability: LayerCapability): boolean => {
  const caps = LAYER_CAPABILITIES[type] || [];
  return caps.includes(capability);
};
