import { useGLTF, Center } from '@react-three/drei';
import { staticFile } from 'remotion';

export const Model = ({ src, scale, rotation, position }: any) => {
  const { scene } = useGLTF(staticFile(src));

  return (
    <Center>
      <primitive
        object={scene}
        scale={scale}
        rotation={rotation}
        position={position}
      />
    </Center>
  );
};
