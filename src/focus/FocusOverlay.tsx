
import { useFocus } from './FocusContext';
import { Z_INDEX } from '../style/zIndex';

export const FocusOverlay = () => {
  const { focus } = useFocus();

  if (!focus.targetId) return null;

  return (
    <div
      style={{
        backgroundColor: `rgba(0,0,0,${focus.dimOpacity})`,
        backdropFilter: `blur(${focus.blur}px)`,
        pointerEvents: 'none',
        zIndex: Z_INDEX.FOCUS_OVERLAY,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
};
