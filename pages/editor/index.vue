<template>
  <LayoutEditor
    @handle-undo="handleUndo"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handle-switcher-layout="handleEvent"
    @handle-play="handleEvent"
    @handle-store-changes="handleEvent"
    @handle-release="handleEvent"
    @click-sidebar="handleClickSideBar"
  >
    <editor
      ref="editorRef"
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
const historyStatus = ref();

const editorRef = ref();
const handleEvent = () => {};
watch(
  () => editorRef.value?.historyStatus,
  (newVal) => {
    historyStatus.value = newVal;
  }
);
const handleClickSideBar = (keyAction: string) => {
  if (keyAction === 'toggle-section') {
    isShowListSection.value = !isShowListSection.value;
  }
};
const handleUndo = () => {
  editorRef.value?.undo();
};
const handleRedo = () => {
  editorRef.value?.redo();
};
</script>
