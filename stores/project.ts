import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { getQueryFromObj } from '~/utils/getQueryFromObj';
import type { IProjectListPayload } from '~/types/project';
import { MethodEnum } from './interface/api';

export const useProjectStore = defineStore('project', () => {
  const apiStore = useApiStore();

  async function getProjectList(payload: IProjectListPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects?${getQueryFromObj(payload)}`,
      proxy: true,
    });
  }

  return {
    getProjectList,
  };
});
