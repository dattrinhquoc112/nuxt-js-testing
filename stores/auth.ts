import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import type { CustomJwtPayload } from '@/interface/JwtPayload';
import type {
  RequestLoginPayload,
  RequestResetPasswordPayload,
} from '@/stores/interface/request/auth';
import type { EmailRegistrationResponse } from '@/stores/interface/response/auth';
import type { UserInfo } from '@/stores/interface/userInfo';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';
import { MethodEnum } from './interface/api';
import type {
  IUsersRegisterRequest,
  RequestUpdatePayload,
} from './interface/request/shared';
import type {
  IForgotPasswordResponse,
  IPresignedUrl,
} from './interface/response/share';

export const useAuthStore = defineStore('auth', () => {
  const apiStore = useApiStore();
  const { $i18n } = useNuxtApp();
  const { t } = $i18n;

  const userInfo = reactive<UserInfo>({
    email: '',
    name: '',
  });
  const token = ref('');

  const userLoginRequesting = ref(false);

  function setUserInfo(info: UserInfo) {
    userInfo.email = info.email;
    userInfo.name = info.name;
  }

  function getAuthenticatedStatus() {
    return getCookie(KEY_LOCAL_STORAGE.IS_AUTHENTICATED);
  }

  function setIsAuthenticated(value: any) {
    setCookie(KEY_LOCAL_STORAGE.IS_AUTHENTICATED, value);
  }

  function getInfoUserFromCookie(): CustomJwtPayload | null {
    return getDataFromCookie<CustomJwtPayload>(KEY_LOCAL_STORAGE.INFO_USER);
  }

  async function checkEmail(email: Record<string, string>) {
    const response: EmailRegistrationResponse = await apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: '/api/v1/users/registration-check',
      params: email,
    });
    return response.data.registered;
  }

  async function getTemporaryToken({ code, state }: Record<string, string>) {
    const data = { code, state };
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: '/oauth2/token',
      data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      proxyCustom: true,
    });
  }

  function setSessionId() {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: '/oauth2/auth',
      credentials: 'include',
      proxyCustom: true,
    });
  }

  async function userLogin({ identifier, password }: RequestLoginPayload) {
    try {
      userLoginRequesting.value = true;
      const response = await apiStore.apiRequest({
        method: MethodEnum.POST,
        endpoint: '/auth/login',
        data: { identifier, password },
        credentials: 'include',
        proxyCustom: true,
      });
      if (response?.redirect) {
        const urlDecode = new URL(response?.redirect);
        navigateTo(`${urlDecode.pathname}${urlDecode.search}`);
      } else if (response?.otpVerificationId) {
        navigateTo(`/auth/check-otp/${response.otpVerificationId}`);
        window.VIUIKit.VIMessage({
          title: t('notification-status-action-send_email_success'),
          width: '348px',
        });
      }
    } catch (e) {
      return Promise.reject(e);
    } finally {
      userLoginRequesting.value = false;
    }
  }

  function register(data: IUsersRegisterRequest) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: '/api/v1/users',
      data,
      proxy: true,
    });
  }

  function checkOtp(otpVerificationId: string) {
    return apiStore.apiRequest({
      method: MethodEnum.GET,
      endpoint: `/api/v1/general/otp/${otpVerificationId}`,
    });
  }

  function resendOtp(otpVerificationId: string) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/general/otp/${otpVerificationId}/resend`,
      data: { otpVerificationId },
      proxy: true,
    });
  }

  function confirmEmail(data: object) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/users/confirm-email`,
      data,
      proxyCustom: true,
    });
  }

  async function uploadAvatar(file: File) {
    try {
      const presignedUrl: IPresignedUrl = await apiStore.apiRequest({
        method: MethodEnum.POST,
        endpoint: `/api/v1/general/uploads?contentType=${file.type}&objectType=AVATAR`,
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
        return presignedUrl.data.fileKey;
      }
      throw new Error('Not found pre-signed URL');
    } catch (error) {}
  }
  function updateUser(payload: RequestUpdatePayload) {
    return apiStore.apiRequest({
      method: MethodEnum.PATCH,
      endpoint: `/api/v1/users/${getInfoUserFromCookie()?.sub}`,
      data: payload,
      proxy: true,
    });
  }

  function unLockAccount(data: object) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/users/unlock`,
      data,
      proxy: true,
    });
  }

  function resetPassword(data: RequestResetPasswordPayload) {
    return apiStore.apiRequest({
      method: MethodEnum.POST,
      endpoint: `/api/v1/users/reset-password`,
      data,
      proxy: true,
    });
  }

  function sendOtpForgotPassword(email: string) {
    return apiStore.apiRequest<IForgotPasswordResponse>({
      method: MethodEnum.POST,
      endpoint: `/api/v1/users/forget-password?email=${email}`,
      proxy: true,
    });
  }

  async function userLogout() {
    try {
      await apiStore.apiRequest({
        method: MethodEnum.POST,
        endpoint: '/auth/logout',
        proxyCustom: true,
      });
      navigateTo('/auth');
    } catch (error) {}
  }

  return {
    token,
    userLogin,
    userLogout,
    userInfo,
    setUserInfo,
    getTemporaryToken,
    checkEmail,
    setSessionId,
    getAuthenticatedStatus,
    setIsAuthenticated,
    register,
    checkOtp,
    resendOtp,
    confirmEmail,
    getInfoUserFromCookie,
    updateUser,
    uploadAvatar,
    unLockAccount,
    sendOtpForgotPassword,
    resetPassword,
  };
});

export default null;
