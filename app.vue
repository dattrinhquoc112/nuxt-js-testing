<template>
  <div v-if="loaded">
    <NuxtLayout :key="keyReload">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useState } from '#app';
import useSeo from './composables/seo';
import { KEY_LOCAL_STORAGE } from './utils/constants';
import { getChangeStorage } from './utils/triggerStorage';

await useSeo();

const { setLocale, locale } = useI18n();
const keyReload = ref(0);
const loaded = useState('pluginLoaded', () => false);

watch(locale, () => keyReload.value++);

const setDefaultLanguage = () => {
  const getLanguage = getCookie(KEY_LOCAL_STORAGE.I18N_LANGUAGE) || 'zh-TW';
  setLocale(getLanguage);
};

const handleCheckChange = () => {
  const isChange = getChangeStorage();
  if (isChange) {
    keyReload.value++;
    setDefaultLanguage();
  }
  setTimeout(handleCheckChange, 3000);
};

onMounted(handleCheckChange);
</script>
