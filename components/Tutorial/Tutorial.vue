<template>
  <div class="tutorial" v-if="isOpenTutorial">
    <vi-icon
      name="ic_close"
      :size="16"
      color="#fff"
      class="tutorial__close-icon"
      @click="handleCloseTutorial"
    />
    <div class="tutorial__container">
      <TutorialStep0 v-if="tutorialStep === 0" />
      <TutorialStep1 v-if="tutorialStep === 1" />
      <TutorialStep2 v-if="tutorialStep === 2" />
      <TutorialStep3 v-if="tutorialStep === 3" />
    </div>
    <div class="tutorial__actions">
      <div class="tutorial__actions__step">
        <vi-typography type="caption-large-500" class="cursor-pointer">
          {{ `${tutorialStep} of ${TOTAL_STEP}` }}
        </vi-typography>
      </div>
      <div class="tutorial__actions__buttons">
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="tutorialStep = 1"
          v-if="tutorialStep === 0"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            開始
          </vi-typography>
        </vi-button>
        <vi-button
          type="standard-subtle"
          width="fit-content"
          class="tutorial__actions__buttons--cancel"
          v-if="tutorialStep !== 0 && tutorialStep !== 3"
          @click="handlePrevStep"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            返回
          </vi-typography></vi-button
        >
        <vi-button
          type="standard-primary"
          width="fit-content"
          v-if="tutorialStep !== 0 && tutorialStep !== 3"
          @click="handleNextStep"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            下一步
          </vi-typography></vi-button
        >
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="isOpenTutorial = false"
          v-if="tutorialStep === 3"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            完成
          </vi-typography></vi-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TutorialStep0 from '@/components/Tutorial/Components/TutorialStep0.vue';
import TutorialStep1 from '@/components/Tutorial/Components/TutorialStep1.vue';
import TutorialStep2 from '@/components/Tutorial/Components/TutorialStep2.vue';
import TutorialStep3 from '@/components/Tutorial/Components/TutorialStep3.vue';

const TOTAL_STEP = 3;
const tutorialStep = ref(0);
const isOpenTutorial = ref(true);
const handleCloseTutorial = () => {
  isOpenTutorial.value = false;
};
const handleNextStep = () => {
  if (tutorialStep.value < TOTAL_STEP) {
    tutorialStep.value++;
  }
};
const handlePrevStep = () => {
  tutorialStep.value--;
};
</script>
<style scoped lang="scss">
.tutorial {
  width: fit-content;
  padding: 16px;
  border-radius: 4px;
  background-color: $brand-navy-700;
  box-shadow: 0px 0px 4px 0px $neutral-black-alpha-15;
  position: relative;
  &__close-icon {
    position: absolute;
    top: 4px;
    cursor: pointer;
    right: 4px;
  }
  &__container {
    width: 328px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  &__actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
    &__buttons {
      margin-left: auto;
      &--cancel {
        margin-right: 16px;
      }
    }
    &__step {
      color: $neutral-white-alpha-80;
    }
  }
}
</style>
