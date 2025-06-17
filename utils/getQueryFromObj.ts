export default (obj: any) => {
  const query: string[] = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key].toString()) {
      query.push(`${key}=${obj[key]}`);
    }
  });
  return query.join('&');
};
