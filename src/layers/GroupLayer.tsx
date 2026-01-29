
import { useEnterAnimation } from '../animation/enter';
import { useLoopAnimation } from '../animation/loops';
import { LayerRenderer } from '../LayerRenderer';
import { resolvePosition } from '../layout/resolvePosition';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';

export const GroupLayer = ({
  position = { x: '50%', y: '35%' },
  enter_animation,
  loop_animation,
  children
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);
  const loopStyle = useLoopAnimation(loop_animation);
  const posStyle = resolvePosition(position);

  return (
    <div style={{ position: 'absolute', top: SAFE_TOP, left: 0, right: 0, bottom: SAFE_BOTTOM }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
        ...posStyle,
        ...enterStyle,
        ...loopStyle
      }}
      >

        {children.map((child: any, i: number) => (
          <LayerRenderer key={i} layer={child} />
        ))}
      </div>
    </div>
  );
};
