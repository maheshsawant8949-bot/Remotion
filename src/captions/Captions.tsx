import { AbsoluteFill } from 'remotion';
import { Word } from './Word';

export const Captions = ({ words }: any) => {
  if (!words || !words.length) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 120,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          textAlign: 'center',
          fontSize: 48,
          fontWeight: 600,
          lineHeight: 1.4
        }}
      >
        {words.map((word: any, i: number) => (
          <Word key={i} {...word} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
