<template>
  <LayoutEditor
    @handle-undo="handleEvent"
    @handle-redo="handleEvent"
    @handle-switcher-layout="handleEvent"
    @handle-play="handleEvent"
    @hanlde-store-changes="handleEvent"
    @handle-release="handleEvent"
  >
  </LayoutEditor>
</template>
<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';

definePageMeta({
  layout: 'app',
});
const handleEvent = () => {};
</script>
