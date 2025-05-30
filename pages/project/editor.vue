<template>
  <LayoutEditor
    @handle-undo="handleUndo"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handle-switcher-layout="handleEvent"
    @handle-play="handleEvent"
    @handle-store-changes="handleSaveTemplate"
    @handle-release="handleEvent"
    @click-sidebar="handleClickSideBar"
    @handle-back="handleBack"
    @scroll-editor="handleHiddenAllControl"
  >
    <editor
      ref="editorRef"
      :list-template="listTemplateCurrent"
      :is-show-list-section="isShowListSection"
      @close-section="isShowListSection = false"
    />
  </LayoutEditor>

  <vi-modal
    modal-title="離開前是否儲存目前編輯"
    :is-show="isShowModal"
    @close="isShowModal = false"
    size="small"
  >
    <vi-typography type="body-small" class="editor-leave__title">
      離開將遺失目前進度，是否儲存編輯？
    </vi-typography>
    <template #footer>
      <div class="editor-leave__footer">
        <vi-button
          type="standard-default"
          width="fit-content"
          @click="handleLeave"
        >
          不儲存直接離開
        </vi-button>
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="handleSaveDraft"
        >
          儲存進度
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { TEMPLATES_SECTION, TEMPLATES_AUDIO } from '~/types/templates';

definePageMeta({
  layout: 'editor',
});
const isShowListSection = ref(false);
const historyStatus = ref();
const isShowModal = ref(false);
const editorRef = ref();
const listTemplateCurrent = ref<any[]>(TEMPLATES_SECTION);
const handleEvent = () => {};
watch(
  () => editorRef.value?.historyStatus,
  (newVal) => {
    historyStatus.value = newVal;
  }
);

const handleSaveTemplate = () => {
  editorRef.value.handleSaveTemplate();
};

const handleClickSideBar = (keyAction: string) => {
  isShowListSection.value = true;
  if (keyAction === 'toggle-section') {
    listTemplateCurrent.value = TEMPLATES_SECTION;
  }
  if (keyAction === 'toggle-audio') {
    listTemplateCurrent.value = TEMPLATES_AUDIO;
  }
};

const handleHiddenAllControl = () => {
  editorRef.value?.hiddenBoxControl();
};

const handleLeave = () => {
  isShowModal.value = false;
  navigateTo('/project-list');
};

const handleSaveDraft = () => {
  // TODO: implement save draft logic
  isShowModal.value = false;
  navigateTo('/project-list');
  alert('Draft saved successfully!');
};
const handleBack = () => {
  const isSectionDirty = editorRef.value?.isSectionDirty();
  if (isSectionDirty) {
    navigateTo('/project-list');
  } else {
    isShowModal.value = true;
  }
};
const handleUndo = () => {
  editorRef.value?.undo();
};
const handleRedo = () => {
  editorRef.value?.redo();
};
</script>

<style lang="scss" scoped>
.editor-leave {
  &__footer {
    display: flex;
    justify-content: end;
    gap: 16px;
  }
  &__title {
    margin-bottom: 16px;
  }
}
</style>
