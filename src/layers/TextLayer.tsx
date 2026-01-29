
import { resolvePosition } from '../layout/resolvePosition';
import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';
import { theme } from '../style/theme';


export const TextLayer = ({
  content,
  position,
  enter_animation,
  loop_animation,
  font_size = 96
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);
  const loopStyle = useLoopAnimation(loop_animation);

  return (
    <div
      style={{
        position: 'absolute',
        ...resolvePosition(position),
        color: theme.text,
        fontSize: font_size,
        fontFamily: theme.font,
        ...enterStyle,
        ...loopStyle
      }}
    >
      {content}
    </div>
  );
};
