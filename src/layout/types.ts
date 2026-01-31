export type LayoutRegion = {
  id: string;
  x: number | string;
  y: number | string;
  width: number;
  height: number;
};

export type SceneLayoutMap = Record<string, LayoutRegion>;
