export default {
  beforeMount(element: any, binding: any) {
    // eslint-disable-next-line no-param-reassign
    element.clickOutsideEvent = (event: MouseEvent) => {
      if (
        !(element === event.target || element.contains(event.target as Node))
      ) {
        binding.value(event);
      }
    };
    document.addEventListener('click', element.clickOutsideEvent);
  },
  unmounted(element: any) {
    document.removeEventListener('click', element.clickOutsideEvent);
  },
};
