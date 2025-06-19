<template>
  <div class="sidebar-item">
    <div class="sidebar-item--title">
      <slot name="title"></slot>
    </div>
    <div
      class="sidebar-item--content"
      :class="{ disabled: !PERMISSION.isEditor }"
    >
      <slot name="content"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCheckPermission from '~/composables/checkPermission';

const { PERMISSION } = useCheckPermission();
</script>

<style scoped lang="scss">
.sidebar-item {
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
  position: fixed;
  z-index: 30;
  left: 72px;
  top: 88px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  &--title {
    display: flex;
    width: 100%;
    color: $neutral-white-alpha-90;
    align-items: center;
    padding: 16px 16px 8px 16px;
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
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    & img {
      width: 100%;
    }
  }
}
</style>
