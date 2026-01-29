import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const useEnterAnimation = (type?: string) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!type) return {};

  switch (type) {
    case 'fade_up': {
      const progress = spring({
        frame,
        fps,
        config: { damping: 200 }
      });

      return {
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`
      };
    }

    case 'slide_in_left': {
      const progress = spring({
        frame,
        fps,
        config: { damping: 200 }
      });

      return {
        transform: `translateX(${interpolate(progress, [0, 1], [-200, 0])}px)`
      };
    }

    case 'scale_pop': {
      const progress = spring({
        frame,
        fps,
        config: { damping: 150 }
      });

      return {
        transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
        opacity: progress
      };
    }

    case 'slide_up': {
        const progress = spring({
            frame,
            fps,
            config: { damping: 180 }
        });

        return {
            transform: `translateY(${interpolate(progress, [0, 1], [80, 0])}px)`,
            opacity: progress
        };
    }

    default:
      return {};
  }
};
