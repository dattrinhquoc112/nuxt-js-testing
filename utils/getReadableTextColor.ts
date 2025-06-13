import { type RGBA } from '@/types/color';

export default (color: RGBA): RGBA => {
  const { r, g, b } = color;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  const isLight = luminance > 128;

  return isLight
    ? { r: 0, g: 0, b: 0, a: 100 }
    : { r: 255, g: 255, b: 255, a: 100 };
};
