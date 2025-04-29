import {
  UnleashClient,
  plugin as unleashPlugin,
} from '@unleash/proxy-client-vue';

let unleashClient: UnleashClient | undefined;

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.env.VITE_APP_ENABLE_UNLEASH === 'true' && !unleashClient) {
    unleashClient = new UnleashClient({
      url: import.meta.env.VITE_APP_UNLEASH_URL as string,
      clientKey: import.meta.env.VITE_APP_UNLEASH_CLIENT_TOKEN as string,
      refreshInterval:
        Number(import.meta.env.VITE_APP_UNLEASH_REFRESH_INTERVAL) || 15,
      appName: import.meta.env.VITE_APP_UNLEASH_APP_NAME as string,
    });
    nuxtApp.vueApp.use(unleashPlugin, { unleashClient });
  }

  // MEMO: 目前 server side 暫不導入
  // if (process.server) {}

  return {
    provide: {
      unleashClient,
    },
  };
});
