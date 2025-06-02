<template>
  <div class="bg-black">
    <div class="editor__bg">
      <NavigatorEditor
        :projectName="projectName"
        :historyStatus="historyStatus"
        @handle-undo="$emit('handleUndo')"
        @handle-redo="$emit('handleRedo')"
        @handleSwitchLayout="
          (e) => {
            $emit('handleSwitchLayout', e);
          }
        "
        @handle-activity-settings="$emit('handleActivitySettings')"
        @handle-edit-info="$emit('handleEditInfo')"
        @handle-play="$emit('handlePlay')"
        @handle-store-changes="$emit('handleStoreChanges')"
        @handle-release="$emit('handleRelease')"
        @handle-back="$emit('handleBack')"
      />
      <div ref="editorContainer" class="editor__container">
        <SideBarEditor
          @click-sidebar="(keyAction) => $emit('clickSidebar', keyAction)"
        />
        <vi-scroll id="editor_content" class="editor__content">
          <slot />
        </vi-scroll>
      </div>
    </div>
    <Tutorial :tutorial-type="TUTORIAL_TYPE.WEB_EDITOR" />
  </div>
</template>
<script setup lang="ts">
import NavigatorEditor from '@/components/Editor/LayoutEditor/components/NavigatorEditor.vue';
import SideBarEditor from '@/components/Editor/LayoutEditor/components/SideBarEditor.vue';
import { TUTORIAL_TYPE } from '@/constants/common';

import { defineProps } from 'vue';

defineProps<{
  historyStatus: {
    redoButtonEnable: boolean;
    undoButtonEnable: boolean;
  };
  rwdMode: string;
  projectName: string;
}>();

const emit = defineEmits<{
  handleUndo: [];
  handleRedo: [];
  handleSwitchLayout: [e: any];
  handlePlay: [];
  handleStoreChanges: [];
  handleRelease: [];
  clickSidebar: [string];
  handleBack: [];
  scrollEditor: [];
  handleEditInfo: [];
  handleActivitySettings: [];
}>();
const editorContainer = ref<HTMLElement>();

const editorContentElement = computed(() =>
  editorContainer.value?.querySelector('#editor_content')
);

const handleScrollEditorContent = () => {
  emit('scrollEditor');
};

onMounted(() => {
  if (!editorContentElement.value) return;
  editorContentElement.value.addEventListener(
    'scroll',
    handleScrollEditorContent
  );
});

onUnmounted(() => {
  if (!editorContentElement.value) return;
  editorContentElement.value.removeEventListener(
    'scroll',
    handleScrollEditorContent
  );
});
</script>

<style lang="scss" scoped>
.editor {
  &__content {
    width: 100%;
    height: calc(100vh - 64px);
  }
  &__bg {
    background: linear-gradient(0deg, #030c11 0%, rgba(3, 12, 17, 0) 100%),
      linear-gradient(
        270deg,
        rgba(130, 136, 255, 0.4) 0%,
        rgba(90, 216, 255, 0.4) 50%,
        rgba(225, 96, 255, 0.4) 100%
      ),
      $brand-navy-900-main;
  }
  &__container {
    display: flex;
    background: rgba(3, 12, 17, 0.6);
  }
}
.bg-black {
  background: $brand-navy-900-main;
  width: 100%;
}
</style>
