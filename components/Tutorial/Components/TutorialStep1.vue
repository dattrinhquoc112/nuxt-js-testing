<template>
  <div class="tutorial-step-1">
    <vi-typography type="headline-xs">
      {{ $t('planning-an-event-webpage-process') }}
    </vi-typography>
    <vi-typography type="body-small">
      活動有以下階段：待發布與已開始
    </vi-typography>
    <div class="tutorial-step-1__image">
      <span class="tutorial-step-1__image__pointer">
        <img src="/assets/icons/pointer.svg" alt="" />
      </span>
      <img src="/assets/images/tutorial-step-1.png" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
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

      position: absolute;
      top: 24px;
      right: 44px;
    }
  }
}
</style>
