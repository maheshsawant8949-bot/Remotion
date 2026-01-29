import { TextLayer } from './layers/TextLayer';
import { SvgLayer } from './layers/SvgLayer';
import { ShapeLayer } from './layers/ShapeLayer';
import { GroupLayer } from './layers/GroupLayer';
import { MotionLines } from './layers/MotionLines';
import { Transition } from './layers/Transition';
import { CalloutLayer } from './layers/CalloutLayer';
import { TimelineLayer } from './layers/TimelineLayer';
import { CounterLayer } from './layers/CounterLayer';
import { BarChartLayer } from './layers/BarChartLayer';
import { MeterLayer } from './layers/MeterLayer';
import { ThreeLayer } from './layers/ThreeLayer';




import { FocusLayer } from './layers/FocusLayer';
import { useFocus } from './focus/FocusContext';


const LayerWrapper = ({ id, children }: any) => {
  const { focus } = useFocus();

  const isFocused = focus.targetId === id;
  const isTargetSet = !!focus.targetId;

  return (
    <div
      style={{
        filter: isFocused
          ? 'none'
          : isTargetSet
          ? `blur(${focus.blur || 2}px)`
          : 'none',
        opacity: isFocused ? 1 : isTargetSet ? 0.2 : 1,
        transition: 'filter 0.3s ease, opacity 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

const Z_INDEX: any = {
  motion_lines: 1,
  svg: 2,
  image: 2,
  group: 3,
  counter: 3,
  bar_chart: 3,
  timeline: 3,
  callout: 4,
  focus: 5,
  three: 3,
  text: 3
};

export const LayerRenderer = ({ layer }: any) => {
  const zIndex = Z_INDEX[layer.type] ?? 2;

  const renderLayer = () => {
    switch (layer.type) {
      case 'text':
        return <TextLayer {...layer} />;
      case 'svg':
        return <SvgLayer {...layer} />;
      case 'shape':
        return <ShapeLayer {...layer} />;
      case 'group':
        return <GroupLayer {...layer} />;
      case 'motion_lines':
        return <MotionLines {...layer} />;
      case 'transition':
        return <Transition {...layer} />;
      case 'callout':
        return <CalloutLayer {...layer} />;
      case 'timeline':
        return <TimelineLayer {...layer} />;
      case 'counter':
        return <CounterLayer {...layer} />;
      case 'bar_chart':
        return <BarChartLayer {...layer} />;
      case 'meter':
        return <MeterLayer {...layer} />;
      case 'three':
        return <ThreeLayer {...layer} />;

      default:
        return null;
    }
  };

  const content = layer.type === 'focus' ? <FocusLayer {...layer} /> : <LayerWrapper id={layer.id}>{renderLayer()}</LayerWrapper>;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex }}>
      {content}
    </div>
  );
};
