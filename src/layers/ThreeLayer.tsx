import { Canvas, useFrame } from '@react-three/fiber';
import { Model } from '../three/Model';
import { useEnterAnimation } from '../animation/enter';
import { SAFE_BOTTOM, SAFE_TOP } from '../style/layout';

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
        position: 'absolute',
        top: SAFE_TOP,
        left: 0,
        right: 0,
        bottom: SAFE_BOTTOM,
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
        <Rotator>
          <Model
            src={model}
            scale={scale}
            rotation={rotation}
            position={position}
          />
        </Rotator>
      </Canvas>
    </div>
  );
};
