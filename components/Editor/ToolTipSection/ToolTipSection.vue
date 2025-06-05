<template>
  <div class="tooltip-container">
    <img
      src="/assets/images/banner-tooltip.png"
      alt=""
      class="tooltip-container__banner"
    />
    <div class="tooltip-container__desc">
      <vi-typography type="subtitle-large">
        {{ $t('section') }}
      </vi-typography>
      <vi-typography type="body-small" class="text-wrap-auto">
        提供多樣活動網頁模板，添加 Section 到你的網頁，讓你的網頁更有特色
      </vi-typography>
    </div>
  </div>
</template>
<script setup lang="ts">
const { locale } = useI18n();
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
    text-transform: capitalize;
  }
}
</style>
