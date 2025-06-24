import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';
import type { IPresignedUrl } from './interface/response/share';
import type { UPLOAD_RESPONSE } from './interface/response/upload';

export const useUploadStore = defineStore('upload', () => {
  const apiStore = useApiStore();

  async function uploadFile(
    file: File,
    objectType = 'MATERIAL'
  ): Promise<UPLOAD_RESPONSE | undefined> {
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
        return presignedUrl.data as UPLOAD_RESPONSE;
      }
      throw new Error('Not found pre-signed URL');
    } catch (error) {
      throw new Error('Upload file failed!');
    }
  }

  return {
    uploadFile,
  };
});

export default null;
