export default (obj: Record<string, any>, keys: string[] = []) => {
  const newObj: Record<string, any> = {};
  keys.forEach((key) => {
    if (key in obj && obj[key]) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
