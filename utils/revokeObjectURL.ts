export default (url: string) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};
