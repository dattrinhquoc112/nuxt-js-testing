import type { MATERIAL_ITEM } from '~/types/templates';

export const convertFileSize = (bytes: number): string => {
  const KB = 1024;
  const MB = 1024 * KB;

  if (bytes < KB) {
    return '0KB';
  }
  if (bytes < MB) {
    return `${Math.round(bytes / KB)}KB`;
  }
  return `${(bytes / MB).toFixed(1)}MB`;
};

export const convertToFileSize = () => {
  return '';
};

export function convertToKB(valueStr: string) {
  if (typeof valueStr !== 'string') {
    return null;
  }

  const cleanedValueStr = valueStr.trim().toUpperCase();

  if (cleanedValueStr.endsWith('KB')) {
    const value = parseFloat(cleanedValueStr.slice(0, -2));
    return Number.isNaN(value) ? null : value;
  }

  if (cleanedValueStr.endsWith('MB')) {
    const value = parseFloat(cleanedValueStr.slice(0, -2));
    return Number.isNaN(value) ? null : value * 1024;
  }

  if (cleanedValueStr.endsWith('GB')) {
    const value = parseFloat(cleanedValueStr.slice(0, -2));
    return Number.isNaN(value) ? null : value * 1024 * 1024;
  }

  if (cleanedValueStr.endsWith('B')) {
    const value = parseFloat(cleanedValueStr.slice(0, -1));
    return Number.isNaN(value) ? null : value / 1024;
  }

  return null;
}

export function parseFileSize(sizeStr: string): number {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const match = sizeStr
    .trim()
    .toUpperCase()
    .match(/^([\d.]+)\s*(B|KB|MB|GB|TB)$/);
  if (!match) throw new Error('Invalid file size format');

  const value = parseFloat(match[1]);
  const unit = match[2] as keyof typeof units;

  return value * units[unit];
}

export const getFileName = (url: string): string[] => {
  const filename = url.split('/').pop();
  if (!filename) {
    return [];
  }
  const [name, extension] = filename.split('.');
  return extension ? [name, `.${extension}`] : [name];
};

export const checkReachLimit = (
  currentSize: number,
  limit: number,
  currentFileSize: number,
  threshHold: number
): Boolean => {
  const totalMaterial = currentSize + currentFileSize;
  return totalMaterial >= limit * threshHold;
};
