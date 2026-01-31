import { SceneLayoutMap } from "./types";

export const DiagramLayout: SceneLayoutMap = {
  mainVisual: {
    id: 'diagram.mainVisual',
    x: 'center',
    y: 'center',
    width: 1200,
    height: 800
  },
  supporting: {
    id: 'diagram.supporting',
    x: 'center',
    y: '63%', // Replaces SAFE.CENTER_Y + 140
    width: 1200,
    height: 100
  },
  timeline: {
    id: 'diagram.timeline',
    x: 'center',
    y: 'center',
    width: 1600,
    height: 400
  }
};
