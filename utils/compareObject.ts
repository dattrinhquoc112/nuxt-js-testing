export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a == null ||
    b == null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => deepEqual(a[key], b[key]));
};

export const compareFieldsDeep = (
  obj1: any,
  obj2: any,
  fields: string[]
): boolean => {
  return fields.every((field) => deepEqual(obj1[field], obj2[field]));
};
