import { SceneLayoutMap } from "./types";

export const TitleLayout: SceneLayoutMap = {
  main: {
    id: 'title.main',
    x: 'center',
    y: 'center',
    width: 1400,
    height: 600
  },
  title: {
    id: 'title.title',
    x: 'center',
    y: '42%', // Replaces SAFE.CENTER_Y - 80
    width: 1400,
    height: 200
  },
  subtitle: {
    id: 'title.subtitle',
    x: 'center',
    y: '54%', // Replaces SAFE.CENTER_Y + 40
    width: 1400,
    height: 100
  }
};
