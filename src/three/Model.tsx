import { useGLTF } from '@react-three/drei';
import { staticFile } from 'remotion';

export const Model = ({ src, scale, rotation, position }: any) => {
  const { scene } = useGLTF(staticFile(src));

  return (
    <primitive
      object={scene}
      scale={scale}
      rotation={rotation}
      position={position}
    />
  );
};
