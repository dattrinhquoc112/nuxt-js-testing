import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';

export const useEventStore = defineStore('event', () => {
  const apiStore = useApiStore();

  async function getEvent() {
    // Example
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/example`,
      proxy: true,
      landingWeb: true,
    });
  }

  return {
    getEvent,
  };
});
