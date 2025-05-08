export function countCharacters(str: string) {
  const counts = {
    digits: 0,
    lowercase: 0,
    uppercase: 0,
    special: 0,
  };

  for (const char of str) {
    if (char >= '0' && char <= '9') {
      counts.digits++;
    } else if (char >= 'a' && char <= 'z') {
      counts.lowercase++;
    } else if (char >= 'A' && char <= 'Z') {
      counts.uppercase++;
    } else if (/^(?=.*[!@#$%^&*]).{1,}$/.test(char)) {
      counts.special++;
    }
  }

  return counts;
}

export function objectToUrlEncoded(
  obj: Record<string, any>,
  prefix: string = ''
): URLSearchParams {
  const formData = new URLSearchParams();

  const buildParams = (data: any, parentKey: string = ''): void => {
    if (Array.isArray(data)) {
      data.forEach((value, index) => {
        buildParams(value, `${parentKey}[${index}]`);
      });
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        buildParams(value, parentKey ? `${parentKey}[${key}]` : key);
      });
    } else if (parentKey) {
      formData.append(parentKey, String(data));
    }
  };

  buildParams(obj, prefix);
  return formData;
}

// Date - Time
export function convertMillisecondsToTime(ms: number): string {
  let seconds: number = Math.floor(ms / 1000);
  const minutes: number = Math.floor(seconds / 60);
  seconds %= 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
}
