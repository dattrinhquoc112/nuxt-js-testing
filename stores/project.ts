import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import type { IProjectListPayload } from '~/types/project';
import type { IUpdateProjectPayload } from '~/types/project';
import { MethodEnum } from './interface/api';

export const useProjectStore = defineStore('project', () => {
  const apiStore = useApiStore();

  async function getProjectList(payload: IProjectListPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects`,
      proxy: true,
      params: payload,
    });
  }

  async function getProject(id: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/${id}`,
      proxy: true,
    });
  }

  async function createProject(name: string) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/projects`,
      proxy: true,
      data: {
        name,
      },
    });
  }

  async function copyProject(id: string, newName: string) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/projects/${id}`,
      proxy: true,
      data: {
        newName,
      },
    });
  }

  async function editProject(id: string, data: IUpdateProjectPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.PATCH,
      endpoint: `/api/v1/projects/${id}`,
      proxy: true,
      data,
    });
  }

  return {
    getProjectList,
    createProject,
    copyProject,
    editProject,
    getProject,
  };
});
