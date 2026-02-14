
import { theme } from '../style/theme';
import { getBorderRadius } from '../visual-language/shape-language';
import { applyTypography } from '../visual-language/helpers';

import { useDrawLine } from '../animation/draw';

export const CalloutLayer = ({
  from,
  to,
  label,
  enter_animation
}: any) => {
  const progress =
    enter_animation === 'draw_line' ? useDrawLine() : 1;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* SVG Line */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute' }}
      >
        <line
          x1={from.x}
          y1={from.y}
          x2={`calc(${from.x} + (${to.x} - ${from.x}) * ${progress})`}
          y2={`calc(${from.y} + (${to.y} - ${from.y}) * ${progress})`}
          stroke={theme.primary}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          left: to.x,
          top: to.y,
          transform: 'translate(-50%, -50%)',
          background: theme.primary,
          color: '#020617', // Dark slate for high contrast on bright primary
          padding: '12px 18px',
          borderRadius: getBorderRadius('full'),
          fontWeight: 600,
          ...applyTypography('caption'),
          opacity: progress
        }}
      >
        {label}
      </div>
    </div>
  );
};
