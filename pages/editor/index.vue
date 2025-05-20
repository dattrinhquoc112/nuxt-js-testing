<template>
  <LayoutEditor
    @handle-undo="handleEvent"
    @handle-redo="handleEvent"
    @handle-switcher-layout="handleEvent"
    @handle-play="handleEvent"
    @handle-store-changes="handleEvent"
    @handle-release="handleEvent"
    @click-sidebar="handleClickSideBar"
  >
    <editor
      :is-show-list-section="isShowListSection"
      @close-section="isShowListSection = false"
    />
  </LayoutEditor>
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';

definePageMeta({
  layout: 'editor',
});
const isShowListSection = ref(false);
const handleEvent = () => {};

const handleClickSideBar = (keyAction: string) => {
  if (keyAction === 'toggle-section') {
    isShowListSection.value = !isShowListSection.value;
  }
};
</script>
