import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', () => {
  const sectionsPublic = ref<any>([]);

  const setSessionPublic = (sections: any[]) => {
    sectionsPublic.value = sections;
  };

  return {
    sectionsPublic,
    setSessionPublic,
  };
});
