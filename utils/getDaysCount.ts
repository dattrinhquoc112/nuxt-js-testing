export default (
  fromDate?: string | Date,
  toDate?: string | Date,
  includeLastDay = true
): number => {
  if (!fromDate || !toDate) return 0;
  const from = new Date(fromDate);
  const to = new Date(toDate);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const diffInMs: number = to.getTime() - from.getTime();
  const diffInDays: number = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays + (includeLastDay ? 1 : 0);
};
