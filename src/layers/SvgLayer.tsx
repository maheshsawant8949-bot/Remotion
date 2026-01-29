import { staticFile } from 'remotion';
import { resolvePosition } from '../layout/resolvePosition';
import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';


export const SvgLayer = ({
  src,
  position,
  enter_animation,
  loop_animation,
  size = 400
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);
  const loopStyle = useLoopAnimation(loop_animation);

  return (
    <div
      style={{
        position: 'absolute',
        ...resolvePosition(position),
        ...enterStyle,
        ...loopStyle
      }}
    >
      <img
        src={staticFile(src)}
        style={{
          width: size,
          height: size
        }}
      />
    </div>
  );
};
