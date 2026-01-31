import { tokens } from '../style/tokens';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineStep } from './TimelineStep';
import { useEnterAnimation } from '../animation/enter';

export const TimelineLayer = ({
  steps,
  orientation = 'horizontal',
  position,
  step_duration_sec = 1.5,
  enter_animation,
  sceneLayout
}: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStyle = useEnterAnimation(enter_animation);
  const stepFrames = step_duration_sec * fps;
  const activeIndex = Math.floor(frame / stepFrames);

  const containerStyle: any = {
    display: 'flex',
    gap: tokens.spacing.m,
    flexDirection: orientation === 'vertical' ? 'column' : 'row'
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: tokens.spacing.xxl }}>
      <div
        style={{
          ...containerStyle,
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
