import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', () => {
  const sectionsPublic = ref<any>([]);
  const tenantID = ref();
  const setSessionPublic = (sections: any[]) => {
    sectionsPublic.value = sections;
  };
  const setTenantID = (id: string) => {
    tenantID.value = id;
  };
  return {
    sectionsPublic,
    setSessionPublic,
    setTenantID,
    tenantID,
  };
});
