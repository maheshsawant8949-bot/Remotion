import React from 'react';
import { Img, AbsoluteFill } from 'remotion';

export const ImageLayer: React.FC<any> = ({ src, style, sceneLayout }) => {
  return (
    <AbsoluteFill style={{ ...style, justifyContent: 'center', alignItems: 'center' }}>
        <Img 
          src={src} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        />
    </AbsoluteFill>
  );
};
