import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { MethodEnum, type Payload } from '@/stores/interface/api';

export const useApiStore = defineStore('api', () => {
  const authStore = useAuthStore();
  async function apiRequest<ResponseDataType>(payload: Payload) {
    let { headers } = payload;
    if (payload.auth) {
      headers = {
        ...headers,
        Authorization: `Bearer ${authStore.token}`,
      };
    }

    try {
      let response = null;
      if (payload?.proxy) {
        response = await $fetch<ResponseDataType>('/api/call', {
          method: MethodEnum.POST,
          body: {
            ...payload,
            headers,
          },
        });
      }
      if (payload?.isServerSide) {
        const iv = decodeBase64(import.meta.env.VITE_APP_CRYPTO_IV as string);
        const key = decodeBase64(import.meta.env.VITE_APP_CRYPTO_KEY as string);
        const token = encryptWithCBC({ time: new Date().getTime() }, key, iv);
        response = await requestHelper<ResponseDataType>({
          ...payload,
          headers: {
            ...headers,
            Authorization: token,
          },
        });
      } else {
        response = await requestHelper<ResponseDataType>({
          ...payload,
          headers,
        });
      }
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  return { apiRequest };
});

export default null;
