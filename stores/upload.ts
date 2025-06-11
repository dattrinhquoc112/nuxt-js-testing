import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';
import type { IPresignedUrl } from './interface/response/share';

export const useUploadStore = defineStore('upload', () => {
  const apiStore = useApiStore();

  async function uploadFile(file: File, objectType = 'MATERIAL') {
    try {
      const presignedUrl: IPresignedUrl = await apiStore.apiRequest({
        method: MethodEnum.POST,
        endpoint: `/api/v1/general/uploads?contentType=${file.type}&objectType=${objectType}`,
        proxy: true,
      });
      if (presignedUrl.data.uploadUrl) {
        await $fetch(presignedUrl.data.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        return presignedUrl.data;
      }
      throw new Error('Not found pre-signed URL');
    } catch (error) {
      throw new Error('Upload file failed!');
    }
  }

  function getFileURL(path: string) {
    return `/client/api/call?endpoint=/api/v1${path}`;
  }

  return {
    uploadFile,
    getFileURL,
  };
});

export default null;
