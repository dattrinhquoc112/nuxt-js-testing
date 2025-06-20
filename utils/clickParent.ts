export default (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  element.parentElement?.click();
};
