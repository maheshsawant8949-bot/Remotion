import { useEffect } from 'react';

import { useFocus } from '../focus/FocusContext';

export const FocusLayer = ({
  target_id,
  dim_opacity = 0.6,
  blur = 6,
  enter_animation
}: any) => {
  const { setFocus } = useFocus();

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
  }, [target_id, dim_opacity, blur, setFocus]);

  return null;
};
