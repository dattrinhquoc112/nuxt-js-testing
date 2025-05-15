<template>
  <div class="bg-black">
    <div class="editor__bg">
      <NavigatorEditor
        @handle-undo="$emit('handleUndo')"
        @handle-redo="$emit('handleRedo')"
        @handle-switcher-layout="$emit('handleSwitchLayout')"
        @handle-play="$emit('handlePlay')"
        @hanlde-store-changes="$emit('hanldeStoreChanges')"
        @handle-release="$emit('handleRelease')"
      />
      <div class="editor__container">
        <SideBarEditor />
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import NavigatorEditor from '@/components/Editor/LayoutEditor/components/NavigatorEditor.vue';
import SideBarEditor from '@/components/Editor/LayoutEditor/components/SideBarEditor.vue';

defineEmits<{
  handleUndo: [];
  handleRedo: [];
  handleSwitchLayout: [];
  handlePlay: [];
  hanldeStoreChanges: [];
  handleRelease: [];
}>();
</script>

<style lang="scss" scoped>
.editor {
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
