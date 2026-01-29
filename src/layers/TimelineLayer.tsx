import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineStep } from './TimelineStep';
import { useEnterAnimation } from '../animation/enter';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';

export const TimelineLayer = ({
  steps,
  orientation = 'horizontal',
  position = { x: 'center', y: '80%' },
  step_duration_sec = 1.5,
  enter_animation
}: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStyle = useEnterAnimation(enter_animation);
  const stepFrames = step_duration_sec * fps;
  const activeIndex = Math.floor(frame / stepFrames);

  const containerStyle: any = {
    display: 'flex',
    gap: 16,
    flexDirection: orientation === 'vertical' ? 'column' : 'row'
  };

  const posStyle: any = { position: 'absolute' };

  if (position.x === 'center') {
    posStyle.left = '50%';
    posStyle.transform = 'translateX(-50%)';
  } else {
    posStyle.left = position.x;
  }

  if (position.y === 'center') {
    posStyle.top = '50%';
    posStyle.transform += ' translateY(-50%)';
  } else {
    posStyle.top = position.y;
  }

  return (
    <div style={{ position: 'absolute', top: SAFE_TOP, left: 0, right: 0, bottom: SAFE_BOTTOM }}>
      <div
        style={{
          ...containerStyle,
          ...posStyle,
          ...enterStyle
        }}
      >
        {steps.map((step: any, i: number) => (
          <TimelineStep
            key={step.id}
            label={step.label}
            active={i === activeIndex}
          />
        ))}
      </div>
    </div>
  );
};
