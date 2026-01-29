import { interpolate, useCurrentFrame } from 'remotion';

export const useLoopAnimation = (type?: string) => {
  const frame = useCurrentFrame();

  if (!type) return {};

  switch (type) {
    case 'float': {
      const y = interpolate(
        frame % 120,
        [0, 60, 120],
        [0, -10, 0]
      );

      return {
        transform: `translateY(${y}px)`
      };
    }

    case 'pulse': {
      const scale = interpolate(
        frame % 90,
        [0, 45, 90],
        [1, 1.05, 1]
      );

      return {
        transform: `scale(${scale})`
      };
    }

    default:
      return {};
  }
};
