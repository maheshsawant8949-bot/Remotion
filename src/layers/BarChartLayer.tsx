import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../style/theme';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';
import { useEnterAnimation } from '../animation/enter';

export const BarChartLayer = ({
  bars,
  max_value = 100,
  enter_animation
}: any) => {
  const frame = useCurrentFrame();
  const enterStyle = useEnterAnimation(enter_animation);

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
        alignItems: 'flex-end',
        gap: 32,
        paddingBottom: 200,
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
                width: 80,
                height,
                backgroundColor: theme.primary,
                borderRadius: 12
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 20,
                color: theme.text
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
