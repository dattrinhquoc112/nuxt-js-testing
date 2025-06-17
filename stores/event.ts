import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', () => {
  const sectionsPublic = ref<any>([]);
  const tenantID = ref();
  const isPublish = ref(false);
  const setSessionPublic = (sections: any[]) => {
    sectionsPublic.value = sections;
  };
  const setIsPublish = (isPub: boolean) => {
    isPublish.value = isPub;
  };
  const setTenantID = (id: string) => {
    tenantID.value = id;
  };
  return {
    sectionsPublic,
    isPublish,
    setIsPublish,
    setSessionPublic,
    setTenantID,
    tenantID,
  };
});
