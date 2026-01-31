import { staticFile } from 'remotion';

import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';


export const SvgLayer = ({
  src,
  position,
  enter_animation,
  loop_animation,
  size = 400,
  sceneLayout
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);
  const loopStyle = useLoopAnimation(loop_animation);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Center content within the allocated layout box
        alignItems: 'center',
        width: '100%',
        height: '100%',
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
