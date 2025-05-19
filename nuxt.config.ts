// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    serverSideTokenKey: process.env.VITE_APP_CRYPTO_KEY,
    serverSideTokenIV: process.env.VITE_APP_CRYPTO_IV,
    serverSideExpireTime: process.env.VITE_APP_CRYPTO_EXPIRE_TIME,
    apiClientId: process.env.NUXT_API_CLIENT_ID,
    apiCode: process.env.NUXT_API_CODE,
    apiScope: process.env.NUXT_API_SCOPE,
    apiRedirectUri: process.env.NUXT_API_REDIRECT_URI,
    apiState: process.env.NUXT_API_STATE,
    apiNonce: process.env.NUXT_API_NONCE,
    apiChallengeMethod: process.env.NUXT_API_CHALLENGE_METHOD,
    apiGrantType: process.env.NUXT_API_GRANT_TYPE,
    apiClientSecret: process.env.NUXT_API_CLIENT_SECRET,
    public: {
      timeRefreshSessionId: process.env.NUXT_TIME_REFRESH_SESSION_ID,
      apiRedirectUri: process.env.NUXT_API_REDIRECT_URI,
      apiHost: process.env.NUXT_PUBLIC_API_HOST,
      contactLink: process.env.NUXT_PUBLIC_CONTACT_LINK,
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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Unbounded:wght@200..900&display=swap',
        },
      ],
      script: [
        {
          src: 'https://sdk.stg.gamania.dev/webtrackingsdk.min.js.gz', // Đường dẫn tới script bên ngoài
          async: true, // Tải script không đồng bộ
          defer: true, // Chờ cho đến khi DOM được phân tích cú pháp
        },
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
          'https://sdk.stg.gamania.dev',
          'https://dev-ui-kit-aiaas-platform.vyin.ai',
        ],
        'connect-src': [
          "'self'",
          // TODO: 確認 prod 是否需要
          'http://0.0.0.0:3000', // 允許來自任何 IP 的請求
          ...(process.env.NUXT_NODE_ENV === 'local'
            ? ['ws:', 'http://localhost:3000']
            : []),
          import.meta.env.VITE_APP_UI_KIT_LINK,
          import.meta.env.NUXT_PUBLIC_API_HOST,
          import.meta.env.NUXT_API_URL_UPLOAD,
          'https://sdk.stg.gamania.dev',
          'https://dev-ui-kit-aiaas-platform.vyin.ai',
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          import.meta.env.NUXT_API_URL_GET_AVATAR,
          'https://content.voiceclone.dev.vyin.ai',
        ],
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
    strategy: 'no_prefix',
    locales: [
      {
        code: 'zh-TW',
        name: '繁體中文',
        file: 'zh-TW.json',
      },
      {
        code: 'en-US',
        name: 'English',
        file: 'en.json',
      },
    ],
    defaultLocale: 'zh-TW',
    langDir: 'locales/',
  },

  typescript: {
    typeCheck: true,
  },

  css: ['normalize.css', '@/assets/global.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style.scss" as *;',
        },
      },
    },
  },

  compatibilityDate: '2024-11-21',
});
