export default function formatDate(
  date?: string | Date,
  formatStr = 'YYYY/MM/DD'
) {
  if (!date) return '';
  const d = new Date(date);

  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 < 12 ? 'AM' : 'PM';

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const map: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(hours24).padStart(2, '0'),
    hh: String(hours12).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
    A: ampm,
    a: ampm.toLowerCase(),
    MMMM: monthNames[d.getMonth()],
  };

  return formatStr
    .replace(/MMMM/g, map['MMMM'])
    .replace(/YYYY|MM|DD|HH|hh|mm|ss|A|a/g, (match) => map[match]);
}
