import { useAuthStore } from '@/stores/auth';
import { KEY_LOCAL_STORAGE } from '@/utils/constants';

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    const {
      public: { apiRedirectUri, timeRefreshSessionId },
    } = useRuntimeConfig();

    const { getAuthenticatedStatus, getTemporaryToken, setSessionId } =
      useAuthStore();

    const code = to.query?.code as string;
    const state = to.query?.state as string;
    const pathRedirect = new URL(apiRedirectUri).pathname;

    if (code && state && to.path === pathRedirect) {
      await getTemporaryToken({ code, state });
      return navigateTo('/tenant');
    }
    const routeNotAllow = [
      '/auth',
      '/auth/',
      '/auth/register',
      '/auth/register/',
      '/user/update',
      '/user/update/',
    ];
    const routeAllowInTemporaryToken = [
      '/tenant',
      '/tenant/',
      '/tenant/create',
      '/tenant/create/',
      '/user/update',
      '/user/update/',
    ];
    const isAuthenticated = getAuthenticatedStatus();

    if (!isAuthenticated) {
      const response = await setSessionId();

      const idInterval = setInterval(
        setSessionId,
        Number(timeRefreshSessionId)
      );

      setStorage(KEY_LOCAL_STORAGE.ID_REFRESH_SESSION_ID, idInterval);

      if (response?.redirect && to.path !== response.redirect) {
        return navigateTo(response.redirect);
      }
    } else {
      clearInterval(getStorage(KEY_LOCAL_STORAGE.ID_REFRESH_SESSION_ID));
    }

    if (
      isAuthenticated === KEY_LOCAL_STORAGE.TOKEN_TEMPORARY &&
      !routeAllowInTemporaryToken.includes(to.path)
    ) {
      return navigateTo('/tenant');
    }
    if (
      isAuthenticated === KEY_LOCAL_STORAGE.TOKEN_TENANT &&
      routeNotAllow.includes(to.path)
    ) {
      return navigateTo('/dashboard');
    }
  }
});
