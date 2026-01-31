
import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';
import { theme } from '../style/theme';


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
        width: '100%',
        height: '100%',
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
