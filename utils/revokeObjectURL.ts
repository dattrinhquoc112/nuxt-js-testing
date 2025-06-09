export default (url: string | undefined) => {
  if (!url) return;
  URL.revokeObjectURL(url);
};
