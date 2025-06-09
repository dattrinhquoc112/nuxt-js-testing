<template>
  <div class="info-bar" :style="{ color: color }">
    <vi-typography type="body-small" class="info-bar--left">
      {{ labelLeft }}</vi-typography
    >

    <vi-typography type="body-small" class="info-bar--right">
      {{ labelRight }}</vi-typography
    >
  </div>
</template>
<script setup lang="ts">
defineProps({
  labelLeft: {
    type: String,
    default: '',
    required: true,
  },
  labelRight: {
    type: String,
    default: '',
    required: true,
  },
  color: {
    type: String,
    default: '',
    required: true,
  },
});
</script>
<style scoped lang="scss">
.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  &--left {
    flex: 1;
    margin-right: 8px;
    word-break: break-word;
  }
  &--right {
    white-space: nowrap;
  }
}
</style>
