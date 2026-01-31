import { SceneLayoutMap } from "./types";

export const HeroLayout: SceneLayoutMap = {
  heroVisual: {
    id: 'hero.heroVisual',
    x: 'center',
    y: 'center',
    width: 1400, // Wide cinematic canvas
    height: 800
  },
  caption: {
    id: 'hero.caption',
    x: 'center',
    y: '80%', // Low, subtle placement
    width: 1000,
    height: 100
  }
};
