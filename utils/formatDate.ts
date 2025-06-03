export default (date: string | Date, formatStr = 'YYYY/MM/DD') => {
  if (!date) return '';
  const d = new Date(date);

  const map: any = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    hh: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  };

  return formatStr.replace(/YYYY|MM|DD|hh|mm|ss/g, (match) => map[match]);
};
