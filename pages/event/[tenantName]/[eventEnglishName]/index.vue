<template>
  <editor-section-render
    v-for="(section, index) in sectionsPublic"
    :key="index"
    :section="section"
    is-public
  />
</template>

<script lang="ts" setup>
import { useEventStore } from '~/stores/event';

definePageMeta({
  layout: 'public',
});

const { sectionsPublic } = useEventStore();
</script>
