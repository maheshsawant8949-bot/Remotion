import { Composition } from 'remotion';
import videoData from './data/video.json';
import { Scene } from './Scene';

export const Video = () => {
  const { fps, width, height } = videoData.meta;

  return (
    <>
      <Composition
        id="AutoVideo"
        component={MainVideo}
        durationInFrames={Math.round(
          videoData.scenes.reduce((acc: number, scene: any) => acc + scene.duration_sec, 0) * fps
        )}
        fps={fps}
        width={width}
        height={height}
      />
    </>
  );
};

const MainVideo = () => {
  return <Scene />;
};
