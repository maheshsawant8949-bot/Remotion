import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../style/theme';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';

export const MeterLayer = ({
  value,
  max = 100,
  label
}: any) => {
  const frame = useCurrentFrame();
  const angle = interpolate(
    frame,
    [0, 30],
    [0, (value / max) * 180],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_TOP,
        left: 0,
        right: 0,
        bottom: SAFE_BOTTOM,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: 300,
          height: 150,
          borderRadius: '150px 150px 0 0',
          border: `8px solid ${theme.primary}`,
          position: 'relative'
        }}
      >
        <div
          style={{
            width: 6,
            height: 140,
            backgroundColor: theme.accent,
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${angle - 90}deg)`
          }}
        />
      </div>
      <div style={{ marginTop: 16, fontSize: 28, color: theme.text }}>
        {label}
      </div>
    </div>
  );
};
