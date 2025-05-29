<template>
  <div v-if="!isLoading" class="icon-play">
    <vi-icon name="ic_play" size="16px" color="#000"></vi-icon>
  </div>
  <div v-else class="spin-loading-play">
    <vi-spin v height="32px" width="32px" :loading="true" />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
<style lang="scss" scoped>
.icon-play {
  min-width: 32px;
  max-width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.spin-loading-play {
  :deep() {
    .spin-loading.is-loading {
      border-radius: 50%;
      background-color: transparent;
    }
  }
}
</style>
