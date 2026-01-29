import { useCurrentFrame } from 'remotion';
import { theme } from '../style/theme';

export const MotionLines = ({
  direction = 'left_to_right',
  count = 10,
  speed = 'medium',
  color = 'primary'
}: any) => {
  const frame = useCurrentFrame();
  const velocity = speed === 'fast' ? 4 : speed === 'slow' ? 1 : 2;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const height = 1080;
        const width = 1920;
        
        const y = (i / count) * 100; // Using % for vertical distribution
        const x = (frame * velocity + i * 200) % width;

        const style: React.CSSProperties =
          direction === 'left_to_right'
            ? { 
                top: `${y}%`,
                left: 0,
                transform: `translateX(${x}px)` 
              }
            : { 
                left: `${(i / count) * 100}%`,
                top: 0,
                transform: `translateY(${(frame * velocity + i * 200) % height}px)` 
              };

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: direction === 'left_to_right' ? 200 : 4, // Increased width for visibility? User didn't specify, keeping logical
              height: direction === 'left_to_right' ? 4 : 200,
              backgroundColor:
                color === 'primary' ? theme.primary : theme.accent,
              opacity: 0.6,
              ...style
            }}
          />
        );
      })}
    </div>
  );
};
