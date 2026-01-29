import { theme } from '../style/theme';

export const TimelineStep = ({
  label,
  active
}: any) => {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 999,
        fontSize: 28,
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
