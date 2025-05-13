<template>
  <div class="tutorial-step-0">
    <vi-typography type="headline-xs">
      {{ content[tutorialType].title }}
    </vi-typography>
    <vi-typography type="body-small">
      {{ content[tutorialType].desc }}
    </vi-typography>
  </div>
</template>
<script setup lang="ts">
import { TUTORIAL_TYPE } from '@/constants/commom';

const { t } = useI18n();
defineProps({
  tutorialType: {
    type: String,
    required: true,
  },
});

const content = ref({
  [TUTORIAL_TYPE.HOME_PAGE]: {
    title: t('planning-an-event-webpage-process'),
    desc: t('welcome-to-the-web-application-module'),
  },
  [TUTORIAL_TYPE.WEB_EDITOR]: {
    title: '新手教學',
    desc: '歡迎使用網頁編輯器，我們將帶你一起製作活動網頁。',
  },
});
</script>
<style scoped lang="scss">
.tutorial-step-0 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
