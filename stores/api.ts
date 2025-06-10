import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { MethodEnum, type Payload } from '@/stores/interface/api';

export const useApiStore = defineStore('api', () => {
  const authStore = useAuthStore();
  const route = useRoute();
  const { $i18n } = useNuxtApp();
  const { t } = $i18n;

  const handleError = (error: any) => {
    const message = getMessageErrorBackend(error, t) || error?.data?.message;
    const pathNotAllow = ['/auth', '/auth/'];

    switch (error?.data?.statusCode) {
      case HTTP_ERRORS.UNAUTHORIZED:
        if (!pathNotAllow.includes(route.path)) {
          window.VIUIKit.VIMessage({
            title: message,
            width: '348px',
            type: 'error',
          });
          navigateTo('/auth/logout');
        }
        break;
      default:
        // window.VIUIKit.VIMessage({
        //   title: message,
        //   width: '348px',
        //   type: 'error',
        // });
        break;
    }
    return Promise.reject(error);
  };

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
      if (payload?.proxyCustom && payload.endpoint) {
        response = await $fetch<any>(`/client/api${payload.endpoint}`, {
          method: payload.method,
          body: {
            ...payload,
            headers,
          },
        });
      } else if (payload?.proxy) {
        let endpoint = 'call';
        if (payload.platform) {
          endpoint = 'platformCall';
        }
        if (payload.audio) {
          endpoint = 'audioCall';
        }
        response = await $fetch<ResponseDataType>(`/client/api/${endpoint}`, {
          method: MethodEnum.POST,
          body: {
            ...payload,
            headers,
          },
        });
      } else if (payload?.isServerSide) {
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
      }
      return response;
    } catch (error) {
      return handleError(error);
    }
  }

  return { apiRequest };
});

export default null;
