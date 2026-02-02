import { DiagramLayout } from './diagram.layout';
import { TitleLayout } from './title.layout';
import { DataLayout } from './data.layout';
import { HeroLayout } from './hero.layout';

export const LAYOUTS: any = {
  title: TitleLayout,
  diagram: DiagramLayout,
  data: DataLayout,
  hero: HeroLayout,
  process: DiagramLayout,
  timeline: DiagramLayout, // Alias: Uses exact same geometry as Diagram for now
};

export const resolvePosition = (position: any, sceneLayout?: string): React.CSSProperties => {
  let resolved = position;

  // 1. Resolve string paths
  // CASE A: Explicit "layout.key" (e.g. "diagram.mainVisual")
  if (typeof position === 'string' && position.includes('.')) {
    const parts = position.split('.');
    if (parts.length === 2) {
      const [layoutName, key] = parts;
      const layout = LAYOUTS[layoutName];
      if (layout && layout[key]) {
        resolved = layout[key];
      } else {
         console.warn(`Layout not found: ${position}`);
         return {}; 
      }
    }
  } 
  // CASE B: Implicit key using sceneLayout (e.g. "mainVisual" with sceneLayout="diagram")
  else if (typeof position === 'string' && sceneLayout) {
     const layout = LAYOUTS[sceneLayout];
     if (layout && layout[position]) {
       resolved = layout[position];
     }
  }

  // 2. Convert to CSS
  const style: React.CSSProperties = {};

  if (!resolved) return {};

  // X / Left
  if (resolved.x === 'center') {
    style.left = '50%';
    style.transform = 'translateX(-50%)';
    style.position = 'absolute';
  } else if (typeof resolved.x === 'number') {
    style.left = resolved.x;
    style.position = 'absolute';
  } else if (typeof resolved.x === 'string') {
    style.left = resolved.x;
    style.position = 'absolute';
  }

  // Y / Top
  if (resolved.y === 'center') {
    style.top = '50%';
    // Combine transforms if both are centered
    if (style.transform) {
        style.transform += ' translateY(-50%)';
    } else {
        style.transform = 'translateY(-50%)';
    }
    style.position = 'absolute';
  } else if (typeof resolved.y === 'number') {
    style.top = resolved.y;
    style.position = 'absolute';
  } else if (typeof resolved.y === 'string') {
    style.top = resolved.y;
    style.position = 'absolute';
  }

  // Width / Height if explicitly set in layout
  if (resolved.width) style.width = resolved.width;
  if (resolved.height) style.height = resolved.height;

  return style;
};
