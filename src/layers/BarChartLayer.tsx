import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../style/theme';
import { tokens } from '../style/tokens';
import { useEnterAnimation } from '../animation/enter';


export const BarChartLayer = ({
  bars,
  max_value = 100,
  position,
  enter_animation,
  sceneLayout
}: any) => {
  const frame = useCurrentFrame();
  const enterStyle = useEnterAnimation(enter_animation);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: tokens.spacing.xl,
        flexDirection: 'row',
        ...enterStyle
      }}
    >
      {bars.map((bar: any, i: number) => {
        const height = interpolate(
          frame,
          [0, 30],
          [0, (bar.value / max_value) * 300],
          { extrapolateRight: 'clamp' }
        );

        return (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 80, // Could be tokenized but width is often specific to chart density
                height,
                backgroundColor: tokens.colors.primary,
                borderRadius: tokens.radius.m
              }}
            />
            <div
              style={{
                marginTop: tokens.spacing.s,
                fontSize: tokens.font.size.small,
                color: tokens.colors.text
              }}
            >
              {bar.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
