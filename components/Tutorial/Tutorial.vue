<template>
  <div class="guild-action" @click="isOpenTutorial = !isOpenTutorial">
    <div class="guild-action__bg"></div>
    <div class="guild-action__icon">
      <vi-icon name="ic_guide" :size="24" color="#fff" />
    </div>
    <vi-typography type="subtitle-large" class="guild-action__text">
      {{ $t('guild') }}
    </vi-typography>
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
</script>
<style scoped lang="scss">
.guild-action {
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-image: url('/assets/icons/bg-guild.svg');
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  &__bg {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 100px;
    border: 2px solid #0091ff;
    filter: blur(4px);
    position: absolute;
    top: 5px;
    left: 5px;
  }
  &__icon {
    width: 40px;
    height: 40px;
    display: inline-flex;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 100px;
    background: #041118;
  }
  &__text {
    display: none;
  }
  &:hover {
    .guild-action {
      width: 96px;
      &__bg {
        border-radius: 100px;
        border: 2px solid #0091ff;
        filter: blur(4px);
        width: 96px;
        height: 40px;
        flex-shrink: 0;
        border: 2px solid transparent; /* Border trong suốt ban đầu */
        border-image: linear-gradient(
            to right,
            #0091ff,
            #2de514,
            #ecc238,
            #ff2cf0
          )
          1;
        border-image-slice: 1;
      }
      &__icon {
        margin-right: 4px;
      }
      &__text {
        display: block;
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
