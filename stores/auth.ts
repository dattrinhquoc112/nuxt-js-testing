import { defineStore } from 'pinia';
import { setCookie, deleteCookie } from '@/utils/storageHelper';
import { useApiStore } from '@/stores/api';
import { auth as authRequest } from '@/stores/entity/request';
import { auth as authResponse } from '@/stores/entity/response';
import type { CustomJwtPayload } from '@/interface/JwtPayload';
import type { RequestLoginPayload } from '@/stores/interface/requestSerialize/auth';
import type { LoginResponseData } from '@/stores/interface/response/auth';
import { MethodEnum } from './interface/api';

const namespace = '/draft';

export const useAuthStore = defineStore('auth', () => {
  const apiStore = useApiStore();

  const token = ref('');
  const jwtPayload = ref<CustomJwtPayload | null>(null);
  const isAuthenticated = ref(false);
  const userLoginRequesting = ref(false);
  function userLoginSuccess(data: LoginResponseData) {
    token.value = data.token;
    jwtPayload.value = new authResponse.AuthToken(data.token).deserialize();
    isAuthenticated.value = true;
    setCookie('token', data.token, {
      expires: new Date(jwtPayload.value.exp),
    });
  }
  function userLoginFailed(e: Error) {
    console.log(e);
  }
  async function userLogin({ userName, password }: RequestLoginPayload) {
    try {
      userLoginRequesting.value = true;
      const response = await apiStore.apiRequest<LoginResponseData>({
        method: MethodEnum.POST,
        endpoint: `${namespace}/login`,
        data: new authRequest.UserLogin({
          userName,
          password,
        }).serialize(),
        proxy: true,
      });
      userLoginSuccess(response);
    } catch (e) {
      userLoginFailed(new Error(JSON.stringify(e)));
    } finally {
      userLoginRequesting.value = false;
    }
  }
  // async function userLogin({
  //   username,
  //   password,
  // }: {
  //   username: string;
  //   password: string;
  // }) {
  //   const response = await apiStore.apiRequest({
  //     method: MethodEnum.POST,
  //     endpoint: `${namespace}/login`,
  //     fetchFunction: {
  //       requesting: userLoginFetching,
  //       success: userLoginSuccess,
  //       error: userLoginFailed,
  //     },
  //     server: false,
  //     body: new authRequest.UserLogin(username, password).serialize(),
  //   });
  //   return response;
  // }
  function userLogout() {
    token.value = '';
    jwtPayload.value = null;
    isAuthenticated.value = false;
    deleteCookie('token');
  }

  return { token, isAuthenticated, userLogin, userLogout };
});

export default null;
