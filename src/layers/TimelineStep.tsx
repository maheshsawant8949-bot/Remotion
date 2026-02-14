import { theme } from '../style/theme';
import { getFontSize } from '../visual-language/typography-scale';
import { getBorderRadius } from '../visual-language/shape-language';

export const TimelineStep = ({
  label,
  active
}: any) => {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: getBorderRadius('full'),
        fontSize: getFontSize('caption'),
        fontWeight: 600,
        backgroundColor: active ? theme.primary : '#1E293B',
        color: active ? '#020617' : theme.text,
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </div>
  );
};
