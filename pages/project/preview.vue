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
import { WEB_EDITOR_PREVIEW } from '@/constants/storage';
import useCheckRWD from '~/composables/checkRwd';

definePageMeta({
  layout: 'editor',
});

const { rwdMode } = useCheckRWD();
const sectionList = ref();

onMounted(() => {
  const sections = sessionStorage.getItem(WEB_EDITOR_PREVIEW);
  sectionList.value = JSON.parse(sections || '{}');
});
</script>
