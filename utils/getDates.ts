export default (dates: string[] = [], separator = '-', formatStr = '') => {
  if (dates.length > 0) {
    return dates
      .filter((elem) => elem)
      .map((date) => formatDate(date, formatStr))
      .join(separator);
  }
  return '';
};
