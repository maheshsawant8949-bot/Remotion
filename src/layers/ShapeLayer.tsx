
import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';
import { theme } from '../style/theme';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';

export const ShapeLayer = ({
  shape = 'circle',
  size = 200,
  color = 'primary',
  enter_animation,
  loop_animation
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);
  const loopStyle = useLoopAnimation(loop_animation);

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_TOP,
        left: 0,
        right: 0,
        bottom: SAFE_BOTTOM,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...enterStyle,
        ...loopStyle
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? '50%' : 0,
          backgroundColor:
            color === 'primary' ? theme.primary : theme.accent
        }}
      />
    </div>
  );
};
