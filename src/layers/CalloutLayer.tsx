
import { theme } from '../style/theme';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';
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
    <div style={{ position: 'absolute', top: SAFE_TOP, left: 0, right: 0, bottom: SAFE_BOTTOM }}>
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
          color: '#020617',
          padding: '12px 18px',
          borderRadius: 999,
          fontWeight: 600,
          fontSize: 28,
          opacity: progress
        }}
      >
        {label}
      </div>
    </div>
  );
};
