export const getQueryFromObj = (obj: any) => {
  const query: string[] = [];
  Object.keys(obj).forEach((key) => {
    query.push(`${key}=${obj[key]}`);
  });
  return query.join('&');
};
