export default (event: MouseEvent) => {
  const element = event.target as HTMLElement;
  const customEvent = new MouseEvent('mousemove', event);
  element.parentElement?.dispatchEvent(customEvent);
};
