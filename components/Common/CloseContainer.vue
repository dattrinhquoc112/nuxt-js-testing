<template>
  <div class="close-container">
    <slot></slot>
    <vi-typography type="subtitle-large" class="close-container--label">{{
      label
    }}</vi-typography>
    <span class="close-container__icon-close" @click="$emit('handleClose')">
      <vi-icon name="ic_close" :size="24" class="neutral-white-alpha-60-text" />
    </span>
  </div>
</template>
<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
    required: true,
  },
});
defineEmits<{
  (event: 'handleClose'): void;
}>();
</script>

<style scoped lang="scss">
.close-container {
  display: flex;
  justify-items: center;
  align-items: center;
  width: 100%;
  &__icon-close {
    cursor: pointer;
    margin-left: auto;
  }
  &--label {
    margin-left: 8px;
  }
}
</style>
