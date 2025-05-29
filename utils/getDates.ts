export default (dates: string[] = [], separator = '-') => {
  if (dates.length > 0) {
    return dates
      .filter((elem) => elem)
      .map((date) => formatDate(date))
      .join(separator);
  }
  return '';
};
