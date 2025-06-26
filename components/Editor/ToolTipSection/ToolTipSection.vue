<template>
  <div class="tooltip-container">
    <img
      v-if="type === 'section'"
      src="/assets/images/banner-tooltip.png"
      alt=""
      class="tooltip-container__banner"
    />
    <img
      v-if="type === 'audio'"
      src="/assets/images/section-tutorial.png"
      alt=""
      class="tooltip-container__banner"
    />
    <div class="tooltip-container__desc">
      <vi-typography type="subtitle-large">
        {{
          type === 'section'
            ? $t('landing-editor-menu-title_section')
            : $t('landing-tutorial-title-title_ai_section')
        }}
      </vi-typography>
      <vi-typography type="body-small" class="text-wrap-auto">
        {{
          type === 'section'
            ? $t('landing-tutorial-subtitle-subtitle_general_section')
            : $t('landing-tutorial-subtitle-subtitle_ai_section')
        }}
      </vi-typography>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'section',
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.tooltip-container {
  padding: 16px;
  width: 360px;
  text-align: left;
  color: white;
  flex-wrap: wrap;
  height: fit-content;
  border: 1px solid $neutral-white-alpha-15;
  border-radius: 4px;
  background-color: $brand-navy-700;
  box-shadow: 0px 0px 4px 0px $neutral-white-alpha-15;
  &__banner {
    width: 100%;
    height: 156px;
    object-fit: contain;
  }
  &__desc {
    gap: 8px;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    overflow-wrap: break-word;
  }
}
</style>
