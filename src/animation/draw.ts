import { interpolate, useCurrentFrame } from 'remotion';

export const useDrawLine = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return progress;
};
