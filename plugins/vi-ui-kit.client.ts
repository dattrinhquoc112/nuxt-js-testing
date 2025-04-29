import * as Vue from 'vue';
import { useState } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => {
  const loaded = useState('pluginLoaded');
  window.Vue = Vue;
  const script = document.createElement('script');
  script.src = import.meta.env.VITE_APP_UI_KIT_LINK;
  document.body.appendChild(script);

  script.onload = () => {
    if (window.VIUIKit) {
      nuxtApp.vueApp.use(window.VIUIKit, { language: 'zh' });
      loaded.value = true;
    }
  };
});
