import { AbsoluteFill } from 'remotion';
import { LAYOUTS, resolvePosition } from './resolver';
import { DEBUG_LAYOUT } from './constants';
import { theme } from '../style/theme';

export const LayoutDebugger = ({ sceneLayout }: { sceneLayout: string }) => {
  if (!DEBUG_LAYOUT) return null;

  const layout = LAYOUTS[sceneLayout];
  if (!layout) return null;

  const regions = Object.entries(layout);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 9999 }}>
      {regions.map(([key, region]: [string, any]) => {
        const style = resolvePosition(region);
        
        // Generate a stable color based on the region name key
        const color = getColorForKey(key);

        return (
          <div
            key={key}
            style={{
              ...style,
              border: `2px dashed ${color}`,
              backgroundColor: `${color}11`, // 11 = very transparent hex
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                backgroundColor: color,
                color: '#fff',
                padding: '2px 6px',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}
            >
              {key} ({typeof region.width === 'number' ? region.width : 'auto'}x{typeof region.height === 'number' ? region.height : 'auto'})
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const getColorForKey = (key: string) => {
  const colors = [
    '#38BDF8', // cyan
    '#FACC15', // yellow
    '#A855F7', // purple
    '#EF4444', // red
    '#22C55E', // green
    '#F97316', // orange
  ];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
