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
    <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => {
        // Generate a deterministic pseudo-random seed for this index
        const seed = (i * 1337.1 + 42.5) % 1;
        
        // Randomize Y slightly around the base grid
        const baseY = (i / count) * 100 + (seed * 5 - 2.5); // Percent based Y
        
        // Fully random start X based on seed, no correlation to 'i'
        const startX = seed * 100; // Percent
        
        // Move continuously
        // Use a large period to avoid frequent wrapping visual artifacts
        const totalMovement = (frame * velocity * 0.1); 
        const currentX = (startX + totalMovement) % 120 - 10; // Wrap from -10% to 110%

        const style: React.CSSProperties = {
          left: `${currentX}%`,
          top: `${baseY}%`,
          position: 'absolute'
        };

        return (
          <div
            key={i}
            style={{
              width: 150 + seed * 200, // Variable length
              height: 3,
              backgroundColor:
                color === 'primary' ? theme.primary : theme.accent,
              borderRadius: 4,
              opacity: 0.3 + seed * 0.5,
              boxShadow: `0 0 8px ${color === 'primary' ? theme.primary : theme.accent}`,
              ...style
            }}
          />
        );
      })}
    </div>
  );
};
