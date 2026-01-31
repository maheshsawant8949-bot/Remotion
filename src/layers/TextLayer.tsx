

import { tokens } from '../style/tokens';
import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';


export const TextLayer = ({
  content,
  position,
  enter_animation,
  loop_animation,
  font_size = tokens.font.size.display,
  sceneLayout
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);
  const loopStyle = useLoopAnimation(loop_animation);

  return (
    <div
      style={{
        width: '100%',
        color: tokens.colors.text,
        fontSize: font_size,
        fontFamily: tokens.font.family,
        textAlign: 'center', // Content alignment, not layout positioning
        ...enterStyle,
        ...loopStyle
      }}
    >
      {content}
    </div>
  );
};
