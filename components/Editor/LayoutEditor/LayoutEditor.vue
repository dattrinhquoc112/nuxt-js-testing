<template>
  <div class="bg-black">
    <NavigatorEditor
      :rwdMode="rwdMode"
      :projectName="projectName"
      :historyStatus="historyStatus"
      :disableUndoRedo
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
      <div v-show="rwdMode === RWD_MODE.DESKTOP">
        <SideBarEditor
          @click-sidebar="(keyAction) => $emit('clickSidebar', keyAction)"
          :isShowListSection="isShowListSection"
        />
      </div>
      <vi-scroll class="editor__content">
        <slot />
      </vi-scroll>
    </div>
  </div>
  <Tutorial :tutorial-type="TUTORIAL_TYPE.WEB_EDITOR" />
</template>
<script setup lang="ts">
import NavigatorEditor from '@/components/Editor/LayoutEditor/components/NavigatorEditor.vue';
import SideBarEditor from '@/components/Editor/LayoutEditor/components/SideBarEditor.vue';
import { RWD_MODE, TUTORIAL_TYPE } from '@/constants/common';

import { defineProps } from 'vue';

defineProps<{
  historyStatus: {
    redoButtonEnable: boolean;
    undoButtonEnable: boolean;
  };
  projectName: string;
  isShowListSection: string;
  rwdMode: string;
  disableUndoRedo: boolean;
}>();

defineEmits<{
  handleUndo: [];
  handleRedo: [];
  handleSwitchLayout: [mode: string];
  handlePlay: [];
  handleStoreChanges: [];
  handleRelease: [];
  clickSidebar: [string];
  handleBack: [];
  handleEditInfo: [];
  handleActivitySettings: [];
}>();
const editorContainer = ref<HTMLElement>();
</script>

<style lang="scss" scoped>
.editor {
  &__content {
    width: 100%;
    height: calc(100vh - 64px);
  }
  &__container {
    display: flex;
    background: rgba(3, 12, 17, 0.6);
  }
}
.bg-black {
  background-image: url(@/assets/images/image-bg.svg);
  background-position: top;
  background-size: cover;
}
</style>
