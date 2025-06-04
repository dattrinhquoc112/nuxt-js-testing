<template>
  <editor-section-render
    v-for="(section, index) in sectionsPublic"
    :key="index"
    :section="section"
    :rwd-mode="rwdMode"
    is-public
  />
</template>

<script lang="ts" setup>
import { useEventStore } from '~/stores/event';
import useSDKTracking from '@/composables/SDKTracking';
import useCheckRWD from '~/composables/checkRwd';

definePageMeta({
  layout: 'public',
});

const { sectionsPublic } = useEventStore();
const { rwdMode } = useCheckRWD();
// handle add Tracking SDK
// const { handleClickEvent } = useSDKTracking({ pageName: '', tenantID: '' });
</script>
