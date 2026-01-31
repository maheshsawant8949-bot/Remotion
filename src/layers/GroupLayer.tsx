import { tokens } from '../style/tokens';
import { useEnterAnimation } from '../animation/enter';
import { LayerRenderer } from '../LayerRenderer';

export const GroupLayer = ({
  children,
  sceneLayout,
  enter_animation,
  alignment = 'center' // Default to center
}: any) => {
  const enterStyle = useEnterAnimation(enter_animation);

  const getJustifyContent = () => {
      switch (alignment) {
          case 'top': return 'flex-start';
          case 'optical': return 'center'; // Optical often implies center with visual offset, handled via padding below
          case 'center': default: return 'center';
      }
  };

  const getPaddingBottom = () => {
       if (alignment === 'optical') return '10%'; // Push layout slightly up for optical center
       return 0;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.l,
      alignItems: 'center',
      justifyContent: getJustifyContent(),
      paddingBottom: getPaddingBottom(),
      width: '100%',
      height: '100%',
      ...enterStyle,
    }}
    >
      {children.map((child: any, i: number) => (
        <LayerRenderer key={i} layer={child} isChild={true} />
      ))}
    </div>
  );
};
