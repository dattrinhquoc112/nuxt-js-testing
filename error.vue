<template>
  <div v-if="loaded" class="error-page">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="" />
    </div>
    <div class="error-box">
      <div class="font-unbounded">
        <vi-typography
          type="featured-extra-large"
          language-input="en"
          class="error-title"
        >
          {{ $t('error_fe-page-status-title_404_page_not_found') }}
        </vi-typography>
      </div>
      <div class="mt-8 font-inner">
        <vi-typography
          type="subtitle-large"
          language-input="en"
          class="error-content"
        >
          {{ $t('error_fe-page-status-description_404_page_not_found') }}
        </vi-typography>
      </div>
      <div class="mt-20">
        <NuxtLink to="/">
          <vi-button type="standard-default">{{
            $t('common-action-button-button_back')
          }}</vi-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useState } from '#app';

defineProps({
  error: Object,
});
const loaded = useState('pluginLoaded', () => false);
</script>

<style scoped lang="scss">
.error-page {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: url(@/assets/images/error/bg.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $brand-navy-800;
  box-sizing: border-box;
  .logo {
    position: absolute;
    top: 40px;
    left: 48px;
    display: flex;
    width: 83px;
    img {
      width: 100%;
      object-fit: contain;
    }
  }
  .error-box {
    text-align: center;
    width: 370px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $neutral-white-alpha-80;

    .error-title {
      font-style: normal;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 1),
        rgba(0, 145, 255, 1),
        rgba(30, 221, 0, 1),
        rgba(255, 255, 255, 1)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .error-content {
      font-style: normal;
      font-weight: 500 !important;
      white-space: pre-line;
    }
  }
}
</style>
