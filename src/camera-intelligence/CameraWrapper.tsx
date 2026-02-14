import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CameraShot } from './camera-types';

interface CameraWrapperProps {
  shot: CameraShot | undefined;
  children: React.ReactNode;
}

const SHOT_SCALES: Record<string, number> = {
  wide: 1.0,
  standard: 1.2,
  focus: 1.6,
  macro: 2.5,
};

export const CameraWrapper: React.FC<CameraWrapperProps> = ({ shot, children }) => {
  const shotType = shot?.type || 'standard';
  const scale = SHOT_SCALES[shotType];

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
