<template>
  <vi-scroll class="wrap">
    <div class="header">
      <vi-icon name="ic_section" size="24" color="#fff"></vi-icon>
      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">Section</vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="emit('close')"
      ></vi-icon>
    </div>
    <div class="neutral-white-alpha-60-text mb-16">
      <vi-typography type="subtitle-large">Hero</vi-typography>
    </div>
    <div class="templates">
      <div
        v-for="(template, index) in TEMPLATES_OBJ"
        :key="index"
        class="template"
        :class="{
          selected: templateSelected?.id === template.id,
        }"
        @click="() => emit('click-template', template)"
      >
        <img :src="template.imageDemo" alt="" />
      </div>
    </div>
  </vi-scroll>
</template>

<script lang="ts" setup>
import { TEMPLATES_OBJ } from '~/types/templates';

const emit = defineEmits(['click-template', 'close']);

defineProps({
  templateSelected: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="scss" scoped>
.wrap {
  position: fixed;
  top: 88px;
  left: 72px;
  z-index: 30;
  min-height: calc(100vh - 112px);
  max-height: calc(100vh - 112px);
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid $neutral-white-alpha-10;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  background: $brand-navy-800;
  border-radius: 8px;
  width: 320px;
  .header {
    padding: 0 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }
  .templates {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .template {
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img {
        width: 100%;
        object-fit: contain;
      }
      &.selected {
        border-radius: 1px;
        border: 3px solid #fff;
      }
      &:hover {
        border: 2px dashed #2589ff;
        background: rgba(37, 137, 255, 0.3);
      }
    }
  }
}
</style>
