import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../style/theme';

export const Transition = ({ style = 'wipe_left' }: any) => {
  const frame = useCurrentFrame();

  const width = interpolate(frame, [0, 20], [0, 100]);

  return (
    <div
      style={{
        height: '100%',
        background: theme.primary,
        width: `${width}%`,
        marginLeft: style === 'wipe_left' ? 0 : 'auto',
        marginRight: style === 'wipe_right' ? 0 : 'auto'
      }}
    />
  );
};
