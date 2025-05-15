<template>
  <div
    class="guild-action"
    @click="isOpenTutorial = !isOpenTutorial"
    v-if="!isOpenTutorial"
  >
    <div class="guild-action__bg"></div>
    <div class="guild-action__container">
      <div class="guild-action__container--box">
        <div class="guild-action__container--icon">
          <vi-icon name="ic_guide" :size="24" color="#fff" />
        </div>
        <vi-typography
          type="subtitle-large"
          class="guild-action__container--text cursor-pointer"
        >
          {{ $t('guild') }}
        </vi-typography>
      </div>
    </div>
  </div>
  <div class="tutorial" v-if="isOpenTutorial">
    <vi-icon
      name="ic_close"
      :size="16"
      color="#fff"
      class="tutorial__close-icon"
      @click="handleCloseTutorial"
    />
    <div class="tutorial__container">
      <TutorialStep0
        v-if="tutorialStep === STEPS.STEP_0"
        :tutorial-type="tutorialType"
      />
      <TutorialStep1
        v-if="tutorialStep === STEPS.STEP_1"
        :tutorialType="tutorialType"
      />
      <TutorialStep2
        v-if="tutorialStep === STEPS.STEP_2"
        :tutorialType="tutorialType"
      />
      <TutorialStep3
        v-if="tutorialStep === STEPS.STEP_3"
        :tutorialType="tutorialType"
      />
    </div>
    <div class="tutorial__actions">
      <div class="tutorial__actions__step">
        <vi-typography
          type="caption-large-500"
          class="cursor-pointer"
          v-if="tutorialStep !== STEPS.STEP_0"
        >
          {{ `${tutorialStep} of ${TOTAL_STEP}` }}
        </vi-typography>
      </div>
      <div class="tutorial__actions__buttons">
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="tutorialStep = STEPS.STEP_1"
          v-if="tutorialStep === STEPS.STEP_0"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            {{ $t('start') }}
          </vi-typography>
        </vi-button>
        <vi-button
          type="standard-subtle"
          width="fit-content"
          class="tutorial__actions__buttons--cancel"
          v-if="tutorialStep !== STEPS.STEP_0 && tutorialStep !== STEPS.STEP_3"
          @click="handlePrevStep"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            {{ $t('return') }}
          </vi-typography></vi-button
        >
        <vi-button
          type="standard-primary"
          width="fit-content"
          v-if="tutorialStep !== STEPS.STEP_0 && tutorialStep !== STEPS.STEP_3"
          @click="handleNextStep"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            {{ $t('next-step') }}
          </vi-typography></vi-button
        >
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="handleCompleteGuild"
          v-if="tutorialStep === STEPS.STEP_3"
        >
          <vi-typography type="subtitle-small" class="cursor-pointer">
            {{ $t('finish') }}
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
import { USER_VISITED } from '@/constants/storage';

defineProps({
  tutorialType: {
    type: String,
    required: true,
  },
});
const STEPS = {
  STEP_0: 0,
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3,
};
const TOTAL_STEP = 3;
const tutorialStep = ref(0);
const isOpenTutorial = ref(false);
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
const handleCompleteGuild = () => {
  isOpenTutorial.value = false;
  tutorialStep.value = STEPS.STEP_0;
};
onMounted(() => {
  // Check if the user is visiting the site for the first time. If so, show the guide.
  const isVisited = localStorage.getItem(USER_VISITED);
  if (!isVisited) {
    isOpenTutorial.value = true;
    localStorage.setItem(USER_VISITED, USER_VISITED);
  }
});
</script>
<style scoped lang="scss">
.guild-action {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  flex-shrink: 0;

  &__bg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
    z-index: 1;
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(
        70.38deg,
        #0091ff 0%,
        #2de514 33%,
        #ecc238 66%,
        #ff2cf0 100%
      );
      left: 2px;
      filter: blur(5px);
      opacity: 0.8;
      z-index: 0;
    }
  }
  &__container {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: 100px;
    height: 40px;
    &--icon {
      display: inline-flex;
      padding: 8px;
      justify-content: center;
      align-items: center;
      gap: 4px;
      border-radius: 100px;
      background: $brand-navy-700;
    }
    &--box {
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: 100px;
    }
    &--text {
      opacity: 0;
      position: relative;
      left: -40px;
    }
  }

  &:hover {
    .guild-action {
      padding: 4px;
      &__bg {
        border-radius: 100px;
        width: 90px;
        height: 40px;
        flex-shrink: 0;
        &::before {
          width: 92px;
          height: 42px;
          right: -8px;
          top: -2px;
          border-radius: 100px;
        }
      }
      &__container {
        background: linear-gradient(
          70.38deg,
          #0091ff 0%,
          #2de514 33%,
          #ecc238 66%,
          #ff2cf0 100%
        );
        height: 40px;
        padding: 1px;
        border: none;
        border-radius: 100px;
        &--text {
          opacity: 1;
          left: 0;
          padding-right: 8px;
        }
        &--box {
          background: $brand-navy-700;

          width: 100%;
          height: 100%;
          border-radius: 100px;
        }
        &--icon {
          background-color: transparent;
          padding: 6px 4px 6px 6px;
        }
      }
    }
  }
}
.tutorial {
  width: fit-content;
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 16px;
  border-radius: 4px;
  background-color: $brand-navy-700;
  box-shadow: 0px 0px 4px 0px $neutral-black-alpha-15;
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
