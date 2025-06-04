import { RWD_MODE } from '@/constants/common';
import { BREAK_POINT_MOBILE } from '@/constants/common';

export default function useCheckRWD() {
  const rwdMode = ref('');

  function handleResize() {
    const width = window.innerWidth;
    if (width <= BREAK_POINT_MOBILE) {
      rwdMode.value = RWD_MODE.MOBILE;
    } else {
      rwdMode.value = RWD_MODE.DESKTOP;
    }
  }
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  return {
    rwdMode,
  };
}
