import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../style/theme';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';
import { useEnterAnimation } from '../animation/enter';

export const CounterLayer = ({
  label,
  from = 0,
  to,
  duration_sec = 2,
  enter_animation
}: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterStyle = useEnterAnimation(enter_animation);

  const progress = interpolate(
    frame,
    [0, duration_sec * fps],
    [from, to],
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
        alignItems: 'center',
        flexDirection: 'column',
        ...enterStyle
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700, color: theme.primary }}>
        {Math.round(progress)}
      </div>
      <div style={{ fontSize: 32, color: theme.text, marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};
