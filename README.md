# aiaas-landing-frontend

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## About This Project

    1. This project consists of two parts:
    	- the Landing Editor
    	- the Landing Event Page (i.e., the page shown after the editor publishes).

    2. Routing Structure:
    	- Root: page/index -> Represents the Landing Editor.
    	- Event: page/event -> Represents the Landing Event Page.

#### Note： All asset types (e.g., CSS) should clearly differentiate between the editor and the event page.

## About UI Framework

Use Vyin-ai-ui-kit

1. Doc dev : https://dev-ui-kit-aiaas-platform.vyin.ai/

## Setup

### Environment

    node: 20.18.2

Make sure to install the dependencies and cookie values (required the first time you start)

```bash
1. Run npm install to install dependencies.

2. Use the .env file for local environment configuration.

3. Run the project aiaas-platform-client locally and log in to get/set cookie values in localhost. You can use the following methods：
  - Manually set the cookie in aiaas-landing-frontend after logging in from dev environment to obtain the cookie.
  - Run aiaas-platform-client locally and log in first to use aiaas-landing-frontend.
  - Login and OTP flow doc：https://gitlab.gamania.com/bdds/alice/aiaas-platform/aiaas-platform-frontend-client/-/wikis/OTP-flowchart
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## About environment variables

### Dev

1. use `.env` to local development
2. set environment variables in `.env` file like:
   ```
   NUXT_...=... // private variable (using server side)
   NUXT_PUBLIC_...=... // public variable (using client side)
   ```
3. init variables key in nuxt.config.ts

   ```typescript
   // nuxt.config.ts

   runtimeConfig: {
     somePrivateKey: '', // mapping NUXT_SOME_PRIVATE_KEY
     public: {
       somePublicKey: '', // mapping NUXT_PUBLIC_SOME_PUBLIC_KEY
     },
   },
   ```

4. npm run dev, variables will be injected

### Publish (build)

1. npm run build
2. runtime inject variables
   ```
   // on terminal
   node .output/server/index.mjs NUXT_PUBLIC_SOME_PUBLIC_KEY=publicKey NUXT_SOME_PRIVATE_KEY=privateKey ...
   ```

#### can visit [Nuxt 3 Runtime Config](https://nuxt.com/docs/guide/going-further/runtime-config) find more detail

## About extend "window"

You can extend the global Window interface in global.d.ts like this:

```typescript
// global.d.ts

export {};

declare global {
  interface Window {
    thirdPartyLib: any;
    ...
  }
}
```

then you can use it in project

```typescript
// *.ts, *.vue

let sdk = window.thirdPartyLib; // ok now
```

## robots

This configuration controls the crawling behavior of search engines using the [Nuxt Robots Module](https://nuxt.com/modules/robots).

```typescript
// nuxt.config.ts

robots: {
  rules: {
    UserAgent: '*',
    Disallow: process.env.NUXT_NODE_ENV === 'prod' ? '' : '/',
  },
},
```

## security

This configuration enhances the security settings for your application by applying several security measures to protect against common web vulnerabilities. ([Nuxt Security Module](https://nuxt.com/modules/security))

Previous security-related issues can be referenced in the document ([前後端資安風險](https://gamania-group.atlassian.net/wiki/spaces/BP/pages/672366827)).

```typescript
// nuxt.config.ts

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
      'script-src': ["'self'", "'unsafe-inline'", "'nonce-{{nonce}}'"],
      'connect-src': [
        "'self'",
        ...(process.env.NUXT_NODE_ENV === 'local'
          ? ['ws:', 'http://localhost:3000']
          : []),
        process.env.NUXT_PUBLIC_API_HOST as 'string',
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
```

## i18n

This configuration handles the internationalization (i18n) setup for your application, enabling support for multiple languages and managing translations. ([Nuxt I18n Module](https://nuxt.com/modules/i18n))

```typescript
// nuxt.config.ts

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
}
```

### Recommended Extensions (VSCode)

- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)
