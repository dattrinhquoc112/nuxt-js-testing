import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';

export const useMaterial = defineStore('material', () => {
  const apiStore = useApiStore();
  async function getMaterials(projectID: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/${projectID}/materials`,
      proxy: true,
    });
  }

  return {
    getMaterials,
  };
});
