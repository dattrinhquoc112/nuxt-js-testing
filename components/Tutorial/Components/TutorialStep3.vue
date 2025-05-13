<template>
  <div class="tutorial-step-3">
    <vi-typography type="headline-xs">
      {{ $t('create-a-web-application-project') }}
    </vi-typography>
    <vi-typography type="body-small">
      {{ $t('edit-web-page-content-and-set-event-information') }}
    </vi-typography>
    <div class="tutorial-step-3__image">
      <img src="/assets/images/tutorial-step-3.png" alt="tutorial step 3" />
    </div>
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
    desc: t('activities-have-the-following-stages'),
  },
  [TUTORIAL_TYPE.WEB_EDITOR]: {
    title: '規劃活動網頁流程',
    desc: '這個空間可以製作你的活動網頁，可以輕鬆將 AI Tool 工具放在網頁。',
  },
});
</script>
<style scoped lang="scss">
.tutorial-step-3 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
