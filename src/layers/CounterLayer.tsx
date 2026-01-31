import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../style/theme';
import { tokens } from '../style/tokens';
import { useEnterAnimation } from '../animation/enter';


export const CounterLayer = ({
  label,
  from = 0,
  to,
  duration_sec = 2,
  position,
  enter_animation,
  sceneLayout
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
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        ...enterStyle
      }}
    >
      <div style={{ fontSize: tokens.font.size.display, fontWeight: tokens.font.weight.bold, color: tokens.colors.primary }}>
        {Math.round(progress)}
      </div>
      <div style={{ fontSize: tokens.font.size.label, color: tokens.colors.text, marginTop: tokens.spacing.s }}>
        {label}
      </div>
    </div>
  );
};
