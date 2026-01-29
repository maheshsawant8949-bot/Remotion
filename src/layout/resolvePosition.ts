import { SAFE } from './constants';

import { DiagramLayout } from './data.layout';

export const resolvePosition = (position: any): any => {
  if (typeof position === 'string') {
    const key = position.split('.')[1];
    return resolvePosition(DiagramLayout[key] || {});
  }

  const style: any = { position: 'absolute' };

  if (position?.x === 'center') {
    style.left = '50%';
    style.transform = 'translateX(-50%)';
  } else if (typeof position?.x === 'number') {
    style.left = position.x;
  } else if (typeof position?.x === 'string') {
    style.left = position.x;
  }

  if (position?.y === 'center') {
    style.top = '50%';
    style.transform = (style.transform || '') + ' translateY(-50%)';
  } else if (typeof position?.y === 'number') {
    style.top = position.y;
  } else if (typeof position?.y === 'string') {
    style.top = position.y;
  }

  return style;
};
