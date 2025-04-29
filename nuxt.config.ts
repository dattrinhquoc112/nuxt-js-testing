// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    serverSideTokenKey: process.env.VITE_APP_CRYPTO_KEY,
    serverSideTokenIV: process.env.VITE_APP_CRYPTO_IV,
    serverSideExpireTime: process.env.VITE_APP_CRYPTO_EXPIRE_TIME,
    public: {
      apiHost: process.env.NUXT_PUBLIC_API_HOST,
    },
  },

  app: {
    head: {
      title: process.env.NUXT_TITLE,
      htmlAttrs: {
        lang: 'zh',
      },
      meta: [
        { name: 'version', content: process.env.NUXT_GIT_TAG || 'unknown' },
      ],
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    'nuxt-security',
    '@nuxtjs/robots',
  ],

  // NOTE: robots.txt setting
  robots: {
    rules: {
      UserAgent: '*',
      Disallow: process.env.NUXT_NODE_ENV === 'prod' ? '' : '/',
    },
  },

  // NOTE: security setting
  security: {
    rateLimiter: {
      tokensPerInterval: 1000,
      interval: '1000',
    },
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      crossOriginResourcePolicy: 'same-origin',
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          import.meta.env.VITE_APP_UI_KIT_LINK,
        ],
        'connect-src': [
          "'self'",
          // TODO: 確認 prod 是否需要
          'http://0.0.0.0:3000', // 允許來自任何 IP 的請求
          ...(process.env.NUXT_NODE_ENV === 'local'
            ? ['ws:', 'http://localhost:3000']
            : []),
          process.env.NUXT_PUBLIC_API_HOST as 'string',
          import.meta.env.VITE_APP_UI_KIT_LINK,
        ],
        'img-src': ["'self'"],
        'object-src': ["'none'"],
        'frame-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'worker-src': ["'self'"],
      },
      xContentTypeOptions: 'nosniff',
      xXSSProtection: '1; mode=block',
    },
  },

  // NOTE: i18n setting
  i18n: {
    locales: [
      {
        code: 'zh-TW',
        name: '中文 - 台灣',
        file: 'zh-TW.json',
      },
    ],
    defaultLocale: 'zh-TW',
    langDir: 'locales/',
  },

  typescript: {
    typeCheck: true,
  },

  css: ['normalize.css'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/global.scss" as *;',
        },
      },
    },
  },

  compatibilityDate: '2024-11-21',
});
