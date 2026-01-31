import { SceneLayoutMap } from "./types";

export const DataLayout: SceneLayoutMap = {
  counter: {
    id: 'data.counter',
    x: 'center',
    y: '18%', // Replaces SAFE.TOP + 40
    width: 800,
    height: 300
  },
  chart: {
    id: 'data.chart',
    x: 'center',
    y: '63%', // Replaces SAFE.HEIGHT - SAFE.BOTTOM - 200
    width: 1000,
    height: 400
  }
};
