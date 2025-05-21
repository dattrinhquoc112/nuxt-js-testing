<template>
  <LayoutEditor
    @handle-undo="handleEvent"
    @handle-redo="handleEvent"
    @handleSwitchLayout="(e) => SwitchToRWD(e)"
    @handle-play="handleEvent"
    @handle-store-changes="handleEvent"
    @handle-release="handleEvent"
    @click-sidebar="handleClickSideBar"
  >
    <editor
      :rwd-mode="RWDMode"
      :is-show-list-section="isShowListSection"
      @close-section="isShowListSection = false"
    />
  </LayoutEditor>
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { RWD_MODE } from '~/constants/common';

definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);
const isShowListSection = ref(false);
const handleEvent = () => {};

const handleClickSideBar = (keyAction: string) => {
  if (keyAction === 'toggle-section') {
    isShowListSection.value = !isShowListSection.value;
  }
};

const SwitchToRWD = (e: any) => {
  RWDMode.value = e;
};
</script>
