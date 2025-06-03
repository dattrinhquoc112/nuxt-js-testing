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
import { TUTORIAL_TYPE } from '~/constants/common';

const { t } = useI18n();
defineProps({
  tutorialType: {
    type: String,
    required: true,
  },
});

const content = ref({
  [TUTORIAL_TYPE.HOME_PAGE]: {
    title: t('landing-tutorial-title-tutorial_title'),
    desc: t('landing-tutorial-subtitle-project_welcome'),
  },
  [TUTORIAL_TYPE.WEB_EDITOR]: {
    title: t('landing-tutorial-title-tutorial_title'),
    desc: t('landing-tutorial-subtitle-editor_welcome'),
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
