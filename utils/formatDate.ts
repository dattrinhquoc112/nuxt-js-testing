export default (date?: string | Date, formatStr = 'YYYY/MM/DD') => {
  if (!date) return '';
  const d = new Date(date);

  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 < 12 ? 'AM' : 'PM';

  const map: Record<string, string | number> = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(hours24).padStart(2, '0'),
    hh: String(hours12).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
    A: ampm,
    a: ampm.toLowerCase(),
  };

  return formatStr.replace(/YYYY|MM|DD|HH|hh|mm|ss|A|a/g, (match) =>
    String(map[match])
  );
};
