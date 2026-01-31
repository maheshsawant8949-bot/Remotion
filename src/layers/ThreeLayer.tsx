import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds } from '@react-three/drei';
import { Model } from '../three/Model';
import { useEnterAnimation } from '../animation/enter';

const Rotator = ({ children }: any) => {
  useFrame((state) => {
    state.scene.rotation.y += 0.002;
  });

  return children;
};

export const ThreeLayer = ({
  model,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  camera,
  ambient_light = 0.6,
  loop_animation,
  enter_animation
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        ...enterStyle
      }}
    >
      <Canvas
        camera={{
          position: camera?.position || [0, 0, 5],
          fov: camera?.fov || 50
        }}
      >
        <ambientLight intensity={ambient_light} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Bounds fit clip observe margin={1.2}>
          <Rotator>
            <Model
              src={model}
              scale={scale}
              rotation={rotation}
              position={position}
            />
          </Rotator>
        </Bounds>
      </Canvas>
    </div>
  );
};
