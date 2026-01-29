import { interpolate, useCurrentFrame } from 'remotion';

export const Camera = ({ children }: any) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 300], [1, 1.05], {
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${scale})`,
        transformOrigin: 'center'
      }}
    >
      {children}
    </div>
  );
};
