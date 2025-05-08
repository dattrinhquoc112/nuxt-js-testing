import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { MethodEnum } from './interface/api';
import { useAuthStore } from './auth';
import type { IUserInfoResponse } from './interface/response/share';
import type { RequestAcceptInvitationPayload } from './interface/request/shared';

export const useUserStore = defineStore('user', () => {
  const apiStore = useApiStore();
  const { getInfoUserFromCookie } = useAuthStore();
  const userInfo = getInfoUserFromCookie();

  async function getDetailInfoUser() {
    return apiStore.apiRequest<IUserInfoResponse>({
      method: MethodEnum.GET,
      endpoint: `/api/v1/users/${getInfoUserFromCookie()?.sub}`,
      proxy: true,
    });
  }

  function registrationCheck(email: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/users/registration-check?email=${email}`,
      proxy: true,
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
    registrationCheck,
    acceptInvitation,
    userInfo,
    getDetailInfoUser,
  };
});

export default null;
