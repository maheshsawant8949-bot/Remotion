import { AbsoluteFill } from 'remotion';
import { useFocus } from './FocusContext';

export const FocusOverlay = () => {
  const { focus } = useFocus();

  if (!focus.targetId) return null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0,0,0,${focus.dimOpacity})`,
        backdropFilter: `blur(${focus.blur}px)`,
        pointerEvents: 'none'
      }}
    />
  );
};
