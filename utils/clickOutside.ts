import type { DirectiveBinding, ObjectDirective } from 'vue';

const clickOutsideDirective: ObjectDirective<
  HTMLElement,
  (event: MouseEvent) => void
> = {
  beforeMount(
    el: HTMLElement,
    binding: DirectiveBinding<(event: MouseEvent) => void>
  ) {
    const handler = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    (el as any).__clickOutsideHandler__ = handler;

    document.addEventListener('click', handler, true);
  },

  unmounted(el: HTMLElement) {
    const handler = (el as any).__clickOutsideHandler__;
    if (handler) {
      document.removeEventListener('click', handler, true);
      delete (el as any).__clickOutsideHandler__;
    }
  },
};

export default clickOutsideDirective;
