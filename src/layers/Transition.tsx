import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../style/theme';

export const Transition = ({ style = 'wipe_left' }: any) => {
  const frame = useCurrentFrame();

  const width = interpolate(frame, [0, 20], [0, 100]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: theme.primary,
        width: `${width}%`,
        left: style === 'wipe_left' ? 0 : undefined,
        right: style === 'wipe_right' ? 0 : undefined
      }}
    />
  );
};
