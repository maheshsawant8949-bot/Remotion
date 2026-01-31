import { Sequence } from 'remotion';
import videoData from './data/video.json';
import { LayerRenderer } from './LayerRenderer';
import { Captions } from './captions/Captions';
import { FocusProvider } from './focus/FocusContext';
import { FocusOverlay } from './focus/FocusOverlay';
import { LayoutDebugger } from './layout/LayoutDebugger';



import { validateCompiledScene } from './scene-compiler/validator';
import { AbsoluteFill } from 'remotion';

export const Scene = () => {
  const fps = videoData.meta.fps;

  let currentFrame = 0;

  return (
    <FocusProvider>
      {videoData.scenes.map((scene: any) => {
        const duration = Math.round(scene.duration_sec * fps);
        const start = currentFrame;
        currentFrame += duration;

        // PIPELINE ENFORCEMENT:
        // The Renderer acts as the final gatekeeper.
        try {
            validateCompiledScene(scene);
        } catch (e: any) {
            console.error(e);
            return (
                <Sequence key={scene.scene_id} from={start} durationInFrames={duration}>
                    <AbsoluteFill style={{backgroundColor: 'red', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', padding: 40}}>
                        <div style={{marginBottom: 20}}>PIPELINE ERROR: Scene {scene.scene_id} Invalid</div>
                        <ul style={{textAlign: 'left', fontSize: 18}}>
                            {e.errors && e.errors.map((err: string, i: number) => (
                                <li key={i}>{err}</li>
                            ))}
                            {!e.errors && <li>{e.message}</li>}
                        </ul>
                    </AbsoluteFill>
                </Sequence>
            );
        }

        return (
          <Sequence
            key={scene.scene_id}
            from={start}
            durationInFrames={duration}
            >
            {scene.layers.map((layer) => (
                <LayerRenderer key={layer.id} layer={layer} sceneLayout={scene.layout} />
            ))}

            <LayoutDebugger sceneLayout={scene.layout} />

            {scene.caption && (
                <Captions words={scene.caption.words} />
            )}
            <FocusOverlay />
            </Sequence>

        );
      })}
    </FocusProvider>
  );
};
