<template>
  <div class="tutorial-step-2">
    <vi-typography type="headline-xs">
      {{ content[tutorialType].title }}
    </vi-typography>
    <vi-typography type="body-small">
      {{ content[tutorialType].desc }}
    </vi-typography>
    <div class="tutorial-step-2__image">
      <img
        src="/assets/images/tutorial-step2-web-editor.png"
        alt="tutorial step 2"
        v-if="tutorialType === TUTORIAL_TYPE.WEB_EDITOR"
      />
      <img
        src="/assets/images/tutorial-step-2.png"
        alt="tutorial step 2"
        v-if="tutorialType === TUTORIAL_TYPE.HOME_PAGE"
      />
    </div>
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
    title: t('landing-tutorial-title-tutorial_2'),
    desc: t('landing-tutorial-subtitle-project_tutorial_2'),
  },
  [TUTORIAL_TYPE.WEB_EDITOR]: {
    title: t('landing-tutorial-title-tutorial_2'),
    desc: t('landing-tutorial-subtitle-project_tutorial_2'),
  },
});
</script>
<style scoped lang="scss">
.tutorial-step-2 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
