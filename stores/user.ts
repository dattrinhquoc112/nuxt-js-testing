import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';
import { useAuthStore } from './auth';
import type {
  IUserInfoResponse,
  IUserPayload,
} from './interface/response/share';
import type { RequestAcceptInvitationPayload } from './interface/request/shared';

export const useUserStore = defineStore('user', () => {
  const apiStore = useApiStore();
  const { getInfoUserFromCookie } = useAuthStore();
  const userInfo = getInfoUserFromCookie();

  async function getDetailInfoUser() {
    if (!getInfoUserFromCookie()?.sub) {
      return null;
    }
    return apiStore.apiRequest<IUserInfoResponse>({
      method: MethodEnum.GET,
      endpoint: `/api/v1/users/${getInfoUserFromCookie()?.sub}`,
      proxy: true,
      platform: true,
    });
  }

  async function updateUser(
    data: IUserPayload,
    id = getInfoUserFromCookie()?.sub || ''
  ) {
    if (id) {
      return apiStore.apiRequest<IUserInfoResponse>({
        method: MethodEnum.PATCH,
        endpoint: `/api/v1/users/${id}`,
        data,
        proxy: true,
        platform: true,
      });
    }
    return null;
  }

  function registrationCheck(email: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/users/registration-check?email=${email}`,
      proxy: true,
      platform: true,
    });
  }

  function acceptInvitation(data: RequestAcceptInvitationPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/users/accept-invitation`,
      data,
      proxyCustom: true,
    });
  }

  return {
    userInfo,
    registrationCheck,
    acceptInvitation,
    getDetailInfoUser,
    updateUser,
  };
});

export default null;
