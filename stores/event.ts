import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';

export const useEventStore = defineStore('event', () => {
  const apiStore = useApiStore();

  const getPublishedContent = async (
    tenantName: string,
    eventEnglishName: string
  ) => {
    const host = window.location.origin;
    const url = new URL(`${host}/${tenantName}/${eventEnglishName}`).href;
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/published-content?tenantName=${tenantName}&eventEnglishName=${eventEnglishName}`,
      proxy: true,
      landingWeb: true,
      headers: {
        'X-PATH': url,
      },
    });
  };

  return {
    getPublishedContent,
  };
});
