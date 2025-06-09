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
  return null;
}

export const getFileName = (url: string): string[] => {
  const filename = url.split('/').pop();
  if (!filename) {
    return [];
  }
  const [name, extension] = filename.split('.');
  return [name, `.${extension}`];
};
