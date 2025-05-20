import { type RGBA } from '@/types/color';

export default (color: RGBA): RGBA => {
  const oppositeR = 255 - color.r;
  const oppositeG = 255 - color.g;
  const oppositeB = 255 - color.b;

  return {
    r: oppositeR,
    g: oppositeG,
    b: oppositeB,
    a: color.a,
  };
};
