import React from 'react';
import { Sequence } from 'remotion';
import videoData from './data/video-compiled.json';
import { LayerRenderer } from './LayerRenderer';
import { Captions } from './captions/Captions';
import { FocusProvider } from './focus/FocusContext';
import { FocusOverlay } from './focus/FocusOverlay';
import { LayoutDebugger } from './layout/LayoutDebugger';



import { validateCompiledScene } from './scene-compiler/validator';
import { AbsoluteFill } from 'remotion';

import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { getTransition, TRANSITION_MAP } from './transitions';

export const Scene = () => {
  const fps = videoData.meta.fps;

  const elements: React.ReactNode[] = [];

  videoData.scenes.forEach((scene: any, index: number) => {
    const duration = Math.round(scene.duration_sec * fps);
    
    // Add Transition (if not first scene)
    if (index > 0) {
      const transitionType = scene.trace?.transitionFromPrevious?.type;
      const transition = getTransition(transitionType);
      
      if (transition) {
        const transitionSpec = TRANSITION_MAP[transitionType!] || {duration: 30};
        elements.push(
          <TransitionSeries.Transition
            key={`transition-${scene.scene_id}`}
            presentation={transition}
            timing={linearTiming({ durationInFrames: transitionSpec.duration })}
          />
        );
      }
    }
    
    // Add Sequence
    elements.push(
      <TransitionSeries.Sequence 
        key={`sequence-${scene.scene_id}`}
        durationInFrames={duration}
      >
        {(() => {
          try {
              validateCompiledScene(scene);
              return (
                  <>
                      {scene.layers.map((layer: any) => (
                          <LayerRenderer key={layer.id} layer={layer} sceneLayout={scene.layout} />
                      ))}
                      <LayoutDebugger sceneLayout={scene.layout} />
                      {scene.caption && <Captions words={scene.caption.words} />}
                      <FocusOverlay />
                  </>
              );
          } catch (e: any) {
              return (
                    <AbsoluteFill style={{backgroundColor: 'red', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', padding: 40}}>
                      <div style={{marginBottom: 20}}>PIPELINE ERROR: Scene {scene.scene_id} Invalid</div>
                      <div>{e.message}</div>
                  </AbsoluteFill>
              );
          }
        })()}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <FocusProvider>
      <TransitionSeries>
        {elements}
      </TransitionSeries>
    </FocusProvider>
  );
};
