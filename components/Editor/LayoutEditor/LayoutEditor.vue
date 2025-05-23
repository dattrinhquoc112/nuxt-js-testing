<template>
  <div class="bg-black">
    <div class="editor__bg">
      <NavigatorEditor
        :historyStatus="historyStatus"
        @handle-undo="$emit('handleUndo')"
        @handle-redo="$emit('handleRedo')"
        @handleSwitchLayout="
          (e) => {
            $emit('handleSwitchLayout', e);
          }
        "
        @handle-play="$emit('handlePlay')"
        @hanlde-store-changes="$emit('hanldeStoreChanges')"
        @handle-release="$emit('handleRelease')"
        @handle-back="$emit('handleBack')"
      />
      <div class="editor__container">
        <SideBarEditor
          v-show="rwdMode === RWD_MODE.DESKTOP"
          @click-sidebar="(keyAction) => $emit('clickSidebar', keyAction)"
        />
        <vi-scroll class="editor__content">
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
import { RWD_MODE, TUTORIAL_TYPE } from '@/constants/common';

import { defineProps } from 'vue';

defineProps<{
  historyStatus: {
    redoButtonEnable: boolean;
    undoButtonEnable: boolean;
  };
  rwdMode: string;
}>();

import { defineProps } from 'vue';

defineProps<{
  historyStatus: {
    redoButtonEnable: boolean;
    undoButtonEnable: boolean;
  };
}>();

defineEmits<{
  handleUndo: [];
  handleRedo: [];
  handleSwitchLayout: [mode: string];
  handlePlay: [];
  hanldeStoreChanges: [];
  handleRelease: [];
  clickSidebar: [string];
  handleBack: [];
}>();
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
