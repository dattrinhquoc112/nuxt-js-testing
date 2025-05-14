<template>
  <div class="tutorial-step-1">
    <vi-typography type="headline-xs">
      {{ content[tutorialType].title }}
    </vi-typography>
    <vi-typography type="body-small">
      {{ content[tutorialType].desc }}
    </vi-typography>
    <div
      class="tutorial-step-1__image"
      v-if="tutorialType === TUTORIAL_TYPE.HOME_PAGE"
    >
      <span class="tutorial-step-1__image__pointer">
        <img src="/assets/icons/pointer.svg" alt="" />
      </span>
      <img src="/assets/images/tutorial-step-1.png" alt="" />
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
    title: t('planning-an-event-webpage-process'),
    desc: t('planning-an-event-webpage-process_ai-tools-desc'),
  },
});
</script>
<style scoped lang="scss">
.tutorial-step-1 {
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
      top: 24px;
      right: 44px;
    }
  }
}
</style>
