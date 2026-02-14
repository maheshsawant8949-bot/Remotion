import { TextLayer } from './layers/TextLayer';
import { SvgLayer } from './layers/SvgLayer';
import { ShapeLayer } from './layers/ShapeLayer';
import { GroupLayer } from './layers/GroupLayer';
import { MotionLines } from './layers/MotionLines';
import { Transition } from './layers/Transition';
import { CalloutLayer } from './layers/CalloutLayer';
import { TimelineLayer } from './layers/TimelineLayer';
import { CounterLayer } from './layers/CounterLayer';
import { BarChartLayer } from './layers/BarChartLayer';
import { MeterLayer } from './layers/MeterLayer';
import { ThreeLayer } from './layers/ThreeLayer';
import { ImageLayer } from './layers/ImageLayer';


import { FocusLayer } from './layers/FocusLayer';
import { useFocus } from './focus/FocusContext';
import { resolvePosition } from './layout/resolver';
import { Z_INDEX } from './style/zIndex';

import { layerHasCapability } from './model/capabilities';

const PRIMARY_LAYERS = ['group', 'three', 'text', 'svg', 'timeline', 'chart', 'bar_chart', 'counter', 'meter', 'image', 'video'];
const ALLOWED_DEFAULTS = ['callout', 'motion_lines', 'captions', 'highlight'];

const LayerWrapper = ({ id, layer, sceneLayout, children, isChild }: any) => {
  const { focus } = useFocus();

  const isFocused = focus.targetId === id;

  // INVARIANT 1: Capability Enforcement
  if (isFocused && !layerHasCapability(layer.type, 'focusable')) {
      console.warn(`[Layout Invariant Violation] Layer '${id}' (type: ${layer.type}) is targeted by Focus but is not 'focusable'.`);
  }

  // Resolve position using the new unified resolver
  let positionProp = layer.position;
  
  // 1. Semantic Parent (Explicit) - Takes precedence over 'position'
  if (layer.parent) {
      positionProp = layer.parent;
  }
  
  // INVARIANT 3: Child Layer Safety
  // Child layers must NEVER define layout/position. They must flow.
  if (isChild) {
      if (positionProp) {
        console.error(`[Layout Invariant Violation] Child Layer '${id}' (type: ${layer.type}) is defining 'position' or 'parent'. Children MUST NOT control their own layout. They must flow within the parent Group.`);
      }
      // Force disable layout resolution for children
      positionProp = undefined; 
  }
  
  // INVARIANT 2: Primary Layer Explicit Placement
  // Primary layers must strictly define their position or parent. No implicit fallbacks.
  // Exception: If it's a child, we already cleared positionProp and we expect it to be empty.
  const isPrimary = PRIMARY_LAYERS.includes(layer.type);
  if (!isChild && isPrimary && !positionProp) {
      console.error(`[Layout Invariant Violation] Primary Layer '${id}' (type: ${layer.type}) missing explicit 'position' or 'parent'.`);
  }

  // 2. Smart Defaults (Implicit fallback for legacy/unspecified layers)
  // Only apply defaults to Root layers. Children don't get smart defaults.
  // STRICT RULE: Only specific layer types are allowed to have defaults.
  if (!isChild && !positionProp && ALLOWED_DEFAULTS.includes(layer.type)) {
      if (sceneLayout === 'diagram') {
          positionProp = 'mainVisual';
      }
  }

  const layoutStyle = isChild ? { position: 'relative' } as React.CSSProperties : resolvePosition(positionProp, sceneLayout);

  let style: React.CSSProperties = {
    ...layoutStyle, // This will be empty/relative for children
    zIndex: isFocused ? Z_INDEX.FOCUSED_ITEM : (Z_INDEX[layer.type.toUpperCase()] ?? Z_INDEX.CONTENT_DEFAULT),
  };

  if (isChild) {
      // Explicitly prevent absolute positioning for children even if leaked from elsewhere
      // style.position = 'relative'; // Already set via layoutStyle above
      style.top = 'auto';
      style.left = 'auto';
      style.transform = undefined; // Children typically don't transform themselves for layout
      style.width = '100%'; // Children fill the flow slot
  }

  const hasResolvedPosition = !!layoutStyle.position && layoutStyle.position === 'absolute';

  if (!hasResolvedPosition && !isChild) {
      // STRICT ENFORCEMENT: No fallback logic. No magic 'inset: 0'.
      // If layout is missing, we warn. We do not try to fix it.
      // Primary layers already errored above. This catches everything else.
      console.warn(`[Layout Missing] Root Layer '${id}' (type: ${layer.type}) has no resolved position. It will flow statically (top-left) which is likely incorrect.`);
      
      // Removed: style.position = 'absolute'; style.inset = 0;
  }
  // Else if isChild is true, we leave position undefined (static flow)

  return (
    <div style={style}>
      {children}
    </div>
  );
};



export const LayerRenderer = ({ layer, sceneLayout, isChild = false }: any) => {
  const renderLayer = () => {
    // Pass sceneLayout to all layers
    const layerProps = { ...layer, sceneLayout };

    switch (layer.type) {
      case 'text':
        return <TextLayer {...layerProps} />;
      case 'svg':
        return <SvgLayer {...layerProps} />;
      case 'shape':
        return <ShapeLayer {...layerProps} />;
      case 'group':
        // Groups need to render children, LayerRenderer handles that recursion if GroupLayer uses it.
        return <GroupLayer {...layerProps} />;
      case 'motion_lines':
        return <MotionLines {...layerProps} />;
      case 'transition':
        return <Transition {...layerProps} />;
      case 'callout':
        return <CalloutLayer {...layerProps} />;
      case 'timeline':
        return <TimelineLayer {...layerProps} />;
      case 'counter':
        return <CounterLayer {...layerProps} />;
      case 'bar_chart':
        return <BarChartLayer {...layerProps} />;
      case 'meter':
        return <MeterLayer {...layerProps} />;
      case 'three':
        return <ThreeLayer {...layerProps} />;
      case 'image':
        return <ImageLayer {...layerProps} />;

      default:
        return null; // Don't crash on unknown types
    }
  };

  if (layer.type === 'focus') {
    return <FocusLayer {...layer} />;
  }

  return (
    <LayerWrapper id={layer.id} layer={layer} sceneLayout={sceneLayout} isChild={isChild}>
      {renderLayer()}
    </LayerWrapper>
  );
};
