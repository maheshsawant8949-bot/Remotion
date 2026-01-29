import { useEffect } from 'react';
import { useEnterAnimation } from '../animation/enter';
import { useFocus } from '../focus/FocusContext';

export const FocusLayer = ({
  target_id,
  dim_opacity = 0.6,
  blur = 6,
  enter_animation
}: any) => {
  const { setFocus } = useFocus();
  const enterStyle = useEnterAnimation(enter_animation);

  useEffect(() => {
    setFocus({
      targetId: target_id,
      dimOpacity: dim_opacity,
      blur
    });

    return () =>
      setFocus({
        targetId: null,
        dimOpacity: 0,
        blur: 0
      });
  }, [target_id]);

  return <div style={enterStyle} />;
};
