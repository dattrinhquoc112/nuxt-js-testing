import _ from 'lodash';

function resetAllFilesToNullImmutable<T>(input: T): T {
  const cloned = _.cloneDeep(input);

  function traverseAndReset(obj: any): void {
    if (Array.isArray(obj)) {
      obj.forEach((item) => traverseAndReset(item));
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (key === 'file' && obj[key] !== null) {
          obj[key] = null;
        } else {
          traverseAndReset(obj[key]);
        }
      }
    }
  }

  traverseAndReset(cloned);
  return cloned;
}

export default resetAllFilesToNullImmutable;
