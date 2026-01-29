import { Sequence } from 'remotion';
import videoData from './data/video.json';
import { LayerRenderer } from './LayerRenderer';
import { Captions } from './captions/Captions';
import { FocusProvider } from './focus/FocusContext';
import { FocusOverlay } from './focus/FocusOverlay';



export const Scene = () => {
  const fps = videoData.meta.fps;

  let currentFrame = 0;

  return (
    <FocusProvider>
      {videoData.scenes.map((scene) => {
        const duration = Math.round(scene.duration_sec * fps);
        const start = currentFrame;
        currentFrame += duration;

        return (
          <Sequence
            key={scene.scene_id}
            from={start}
            durationInFrames={duration}
            >
            {scene.layers.map((layer) => (
                <LayerRenderer key={layer.id} layer={layer} />
            ))}

            {scene.caption && (
                <Captions words={scene.caption.words} />
            )}
            </Sequence>

        );
      })}
      <FocusOverlay />
    </FocusProvider>
  );
};
