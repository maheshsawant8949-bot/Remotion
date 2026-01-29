import { SAFE } from "./constants";

export const DiagramLayout: any = {
  mainVisual: { x: 'center', y: '45%' },
  bottomCaption: { x: 'center', y: '80%' },
  center: { x: 'center', y: 'center' },
  topTitle: { x: 'center', y: '15%' }, // Inferred from Scene 1 title which was 45% Y? Wait.
};

export const DataLayout = {
  counter: {
    x: 'center',
    y: SAFE.TOP + 40
  },
  chart: {
    x: 'center',
    y: SAFE.HEIGHT - SAFE.BOTTOM - 200
  }
};
