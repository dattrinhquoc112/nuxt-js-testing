import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    const route = useRoute();
    const {
      getAuthenticatedStatus,
      getTemporaryToken,
      setSessionId,
      setIsAuthenticated,
    } = useAuthStore();

    const code = route.query?.code as string;
    const state = route.query?.state as string;
    const pathRedirect = new URL(
      useRuntimeConfig().public.apiRedirectUri as string
    ).pathname;

    if (code && state && to.path === pathRedirect) {
      await getTemporaryToken({ code, state });
      setIsAuthenticated(true);
      return navigateTo('/tenant');
    }

    const isAuthenticated = getAuthenticatedStatus();
    if (!isAuthenticated) {
      await setSessionId();
    }
  }
});
