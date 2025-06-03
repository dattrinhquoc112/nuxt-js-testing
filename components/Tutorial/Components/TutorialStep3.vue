<template>
  <div class="tutorial-step-3">
    <vi-typography type="headline-xs">
      {{ content[tutorialType].title }}
    </vi-typography>
    <vi-typography type="body-small">
      {{ content[tutorialType].desc }}
    </vi-typography>
    <div class="tutorial-step-3__image">
      <img
        src="/assets/images/tutorial-step-3.png"
        alt="tutorial step 3"
        v-if="tutorialType === TUTORIAL_TYPE.HOME_PAGE"
      />
      <span
        class="tutorial-step-3__image__pointer"
        v-if="tutorialType === TUTORIAL_TYPE.WEB_EDITOR"
      >
        <img src="/assets/icons/pointer.svg" alt="" />
      </span>
      <img
        src="/assets/images/tutorial-web-editor-step-3.png"
        alt="tutorial step 3"
        v-if="tutorialType === TUTORIAL_TYPE.WEB_EDITOR"
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
    title: t('landing-tutorial-title-tutorial_3'),
    desc: t('landing-tutorial-subtitle-project_tutorial_3'),
  },
  [TUTORIAL_TYPE.WEB_EDITOR]: {
    title: t('landing-tutorial-title-tutorial_3'),
    desc: t('landing-tutorial-subtitle-editor_tutorial_3'),
  },
});
</script>
<style scoped lang="scss">
.tutorial-step-3 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__image {
    position: relative;
    &__pointer {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 12px;
      right: 6px;
    }
  }
}
</style>
