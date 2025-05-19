export default function useCheckHeightPopup(
  props: any,
  popupElement: Ref<HTMLElement | undefined>,
  emit: any
) {
  watch(
    () => props.isShow,
    () => {
      if (popupElement.value && props.isShow) {
        if (
          props.positionControlCurrent.pageY +
            popupElement.value.clientHeight +
            20 >
          window.innerHeight
        ) {
          popupElement.value.classList.add('show-on-top');
          popupElement.value.classList.remove('show-on-bottom');
          emit('move-popup-to-top');
        } else {
          popupElement.value.classList.remove('show-on-top');
          popupElement.value.classList.add('show-on-bottom');
          emit('move-popup-to-bottom');
        }
      }
    }
  );
}
