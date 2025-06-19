import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import type {
  IProjectListPayload,
  IUpdateProjectPayload,
} from '~/types/project';
import { MethodEnum } from './interface/api';

export const useProjectStore = defineStore('project', () => {
  const apiStore = useApiStore();
  type versionContentType = {
    version: number;
    idProject: string;
  };
  const versionContent = ref<versionContentType>();

  const setVersionContent = ({ version, idProject }: versionContentType) => {
    versionContent.value = { version, idProject };
  };

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
    return apiStore.apiRequest(
      {
        method: MethodEnum.POST,
        endpoint: `/api/v1/projects/${id}/copy`,
        proxy: true,
        data: {
          newName,
        },
      },
      { showErrorMsg: false }
    );
  }

  async function editProject(id: string, data: IUpdateProjectPayload) {
    return apiStore.apiRequest(
      {
        method: MethodEnum.PATCH,
        endpoint: `/api/v1/projects/${id}`,
        proxy: true,
        data,
      },
      {
        showErrorMsg: false,
      }
    );
  }

  async function publishProject(id: string) {
    return apiStore.apiRequest(
      {
        method: MethodEnum.POST,
        endpoint: `/api/v1/projects/${id}/publish`,
        proxy: true,
      },
      {
        showErrorMsg: false,
      }
    );
  }

  async function unpublishProject(id: string) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/projects/${id}/unpublish`,
      proxy: true,
    });
  }

  async function closeProject(id: string) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/projects/${id}/close`,
      proxy: true,
    });
  }

  async function getProjectAnalysis(id: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/${id}/analysis`,
      proxy: true,
    });
  }

  async function updateContentProject(id: string, data: any) {
    return apiStore.apiRequest({
      method: MethodEnum.PATCH,
      endpoint: `/api/v1/projects/${id}/content`,
      proxy: true,
      data,
    });
  }

  async function getContentProject(id: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/${id}/content`,
      proxy: true,
    });
  }

  async function checkIsLatestVersion() {
    try {
      if (!versionContent.value?.idProject || !versionContent.value.version)
        return true;
      const latestVersion = (
        await apiStore.apiRequest({
          method: MethodEnum.GET,
          endpoint: `/api/v1/projects/${versionContent.value.idProject}/latest-version`,
          proxy: true,
        })
      ).data.version;
      return Number(versionContent.value?.version) === Number(latestVersion);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return {
    getProjectList,
    createProject,
    copyProject,
    editProject,
    getProject,
    publishProject,
    unpublishProject,
    closeProject,
    getProjectAnalysis,
    updateContentProject,
    getContentProject,
    setVersionContent,
    checkIsLatestVersion,
  };
});
