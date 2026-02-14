import { Word } from './Word';
import { Z_INDEX } from '../style/zIndex';
import { applyTypography } from '../visual-language/helpers';

export const Captions = ({ words }: any) => {
  if (!words || !words.length) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        display: 'flex',
        paddingBottom: 120,
        pointerEvents: 'none',
        zIndex: Z_INDEX.CAPTIONS
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          textAlign: 'center',
          ...applyTypography('title'),
          fontWeight: 600,
        }}
      >
        {words.map((word: any, i: number) => (
          <Word key={i} {...word} />
        ))}
      </div>
    </div>
  );
};
