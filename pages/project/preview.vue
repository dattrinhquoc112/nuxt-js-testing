<template>
  <div>
    <editor-section-render
      :read-only="true"
      v-for="(section, index) in sectionList"
      :key="index"
      :section="section"
      :rwd-mode="rwdMode"
      @show-option="(event) => {}"
      @handle-change-text="(event) => {}"
    />
  </div>
</template>
<script setup lang="ts">
import { RWD_MODE } from '@/constants/common';
import { WEB_EDITOR_PREVIEW } from '@/constants/storage';

const rwdMode = ref('');
const sectionList = ref();

function handleResize() {
  const width = window.innerWidth;
  if (width <= 375) {
    rwdMode.value = RWD_MODE.MOBILE;
  } else {
    rwdMode.value = RWD_MODE.DESKTOP;
  }
}
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
onMounted(() => {
  const sections = sessionStorage.getItem(WEB_EDITOR_PREVIEW);
  sectionList.value = JSON.parse(sections || '{}');
  handleResize();
  window.addEventListener('resize', handleResize);
});
definePageMeta({
  layout: 'editor',
});
</script>
