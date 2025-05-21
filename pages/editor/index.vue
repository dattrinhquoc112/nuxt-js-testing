<template>
  <LayoutEditor
    @handle-undo="handleUndo"
    :rwd-mode="RWDMode"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handleSwitchLayout="(e) => SwitchToRWD(e)"
    @handle-play="handleEvent"
    @handle-store-changes="handleEvent"
    @handle-release="handleEvent"
    @click-sidebar="handleClickSideBar"
    @handle-back="handleBack"
  >
    <vi-scroll
      class="editor__content"
      :class="{ 'editor__content--mobile': RWDMode === RWD_MODE.MOBILE }"
    >
      <editor
        :rwd-mode="RWDMode"
        ref="editorRef"
        :is-show-list-section="isShowListSection"
        @close-section="isShowListSection = false"
      />
    </vi-scroll>
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
import { RWD_MODE } from '~/constants/common';

definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);
const isShowListSection = ref(false);
const historyStatus = ref();
const isShowModal = ref(false);
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

const SwitchToRWD = (e: any) => {
  RWDMode.value = e;
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

.editor {
  &__content {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    height: calc(100vh - 64px);
    &--mobile {
      width: 375px;
    }
  }
}
</style>
