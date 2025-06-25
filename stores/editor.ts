import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';
import type { createDemoAudioPayload } from './interface/request/audio';

export const useEditorStore = defineStore('editor', () => {
  const apiStore = useApiStore();
  const loading = reactive({
    updateContent: false,
    publish: false,
  });
  const activeSideBar = ref('');
  const setLoading = (key: keyof typeof loading, val: boolean) => {
    loading[key] = val;
  };

  const setActiveSideBar = (activeSidebar2: string) => {
    activeSideBar.value = activeSidebar2;
  };
  async function getVoiceModelList() {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects`,
      proxy: true,
      audio: true,
      params: {
        page: 0,
        size: 1000,
        status: 'PUBLISHED',
      },
    });
  }
  async function getListDemos(projectId: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/projects/${projectId}/demos`,
      proxy: true,
      audio: true,
    });
  }
  async function createDemo(projectId: string, data: createDemoAudioPayload) {
    return apiStore.apiRequest(
      {
        method: MethodEnum.POST,
        endpoint: `/api/v1/projects/${projectId}/demos`,
        proxy: true,
        data: {
          text: data.text,
          speed: data.speed,
          pitch: data.pitch,
        },
      },
      {
        showErrorMsg: false,
      }
    );
  }

  return {
    getVoiceModelList,
    getListDemos,
    createDemo,
    loading,
    activeSideBar,
    setActiveSideBar,
    setLoading,
  };
});
