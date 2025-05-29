import { ref, onMounted, onUnmounted } from 'vue';

type UseFocusedTimeOptions = {
  onEvery30s?: () => void;
  onUnfocus?: () => void;
  onRefocus?: () => void;
  onClose?: () => void;
  onEnter?: () => void;
};

export function useFocusedTime(options: UseFocusedTimeOptions = {}) {
  const focusedTime = ref<number>(0);
  let intervalId: number | null = null;
  let lastFocusTimestamp: number | null = null;
  let nextTriggerAt = 30000;
  let wasUnfocused = false;
  let hasEntered = false;

  const runEvery30s = () => {
    options.onEvery30s?.();
    nextTriggerAt += 30000;
  };

  const startTimer = (): void => {
    if (intervalId !== null) return;

    if (!hasEntered) {
      options.onEnter?.();
      hasEntered = true;
    }

    lastFocusTimestamp = Date.now();

    if (wasUnfocused) {
      options.onRefocus?.();
      wasUnfocused = false;
    }

    intervalId = window.setInterval(() => {
      const now = Date.now();
      if (lastFocusTimestamp !== null) {
        const elapsed = now - lastFocusTimestamp;
        focusedTime.value += elapsed;
        lastFocusTimestamp = now;

        if (focusedTime.value >= nextTriggerAt) {
          runEvery30s();
        }
      }
    }, 1000);
  };

  const stopTimer = (): void => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (lastFocusTimestamp !== null) {
      const now = Date.now();
      focusedTime.value += now - lastFocusTimestamp;
      lastFocusTimestamp = null;

      options.onUnfocus?.();
      wasUnfocused = true;
    }
  };

  const handleBeforeUnload = () => {
    stopTimer();
    options.onClose?.();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      startTimer();
    } else {
      stopTimer();
    }
  };

  onMounted(() => {
    if (document.visibilityState === 'visible') {
      startTimer();
    }
    window.addEventListener('focus', startTimer);
    document.addEventListener('visibilitychange', () => {
      handleVisibilityChange();
    });
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onUnmounted(() => {
    stopTimer();
    window.removeEventListener('focus', startTimer);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return {
    focusedTime,
  };
}
