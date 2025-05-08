export default (event: KeyboardEvent) => {
  if (/^[a-zA-Z0-9 ]$/.test(event.key)) return;
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'Enter',
  ];
  if (allowedKeys.includes(event.key)) return;
  event.preventDefault();
};
