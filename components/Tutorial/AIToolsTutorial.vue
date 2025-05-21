<template>
  <div class="ai-tools-tutorial">
    <div class="ai-tools-tutorial--title">
      <span class="ai-tools-tutorial--title__icon">
        <vi-icon name="ic_ai_section" :size="16" color="#fff" />
      </span>
      <vi-typography type="subtitle-large">{{ $t('ai-tools') }}</vi-typography>
      <span
        class="ai-tools-tutorial--title__icon-close"
        @click="handleCloseTooltip"
      >
        <vi-icon name="ic_close" :size="16" color="#fff" />
      </span>
    </div>
    <div class="ai-tools-tutorial--content">
      <vi-typography type="subtitle-large">{{ $t('audio-tts') }}</vi-typography>
      <vi-typography type="body-small">{{
        $t('ai-tools-tutorial-description')
      }}</vi-typography>
      <img
        src="/assets/images/ai-tool-tutorial-banner.png"
        alt=""
        @click="openTorialModal"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  openTorialModal: [];
  handleCloseTooltip: [];
}>();
const openTorialModal = () => {
  emit('openTorialModal');
};

const handleCloseTooltip = () => {
  emit('handleCloseTooltip');
};
</script>
<style scoped lang="scss">
.ai-tools-tutorial {
  display: flex;
  width: 320px;
  z-index: 30;
  height: calc(100vh - 112px);
  max-height: 912px;
  padding-bottom: 16px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 8px;
  position: absolute;
  z-index: 30;
  right: -330px;
  top: -64px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  &--title {
    display: flex;
    width: 100%;
    color: $neutral-white-alpha-90;
    align-items: center;
    padding: 16px 24px 8px 24px;
    &__icon {
      display: flex;
      width: 24px;
      height: 24px;
      padding: 4px;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
      margin-right: 8px;
    }
    &__icon-close {
      cursor: pointer;
      margin-left: auto;
    }
  }
  &--content {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: white;
    text-align: left;
    text-wrap: auto;
    & img {
      width: 100%;
    }
  }
}
</style>
