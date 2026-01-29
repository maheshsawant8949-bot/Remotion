import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../style/theme';

export const Word = ({ text, start, end }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = start * fps;
  const endFrame = end * fps;

  const isActive = frame >= startFrame && frame <= endFrame;

  const opacity = interpolate(
    frame,
    [startFrame - 5, startFrame],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  const scale = isActive ? 1.1 : 1;

  return (
    <span
      style={{
        marginRight: 8,
        opacity,
        transform: `scale(${scale})`,
        color: isActive ? theme.primary : theme.text,
        transition: 'transform 0.1s linear'
      }}
    >
      {text}
    </span>
  );
};
