<template>
  <editor-section-render
    v-for="(section, index) in sectionsPublic"
    :key="index"
    :section="section"
    :rwd-mode="rwdMode"
    is-public
    @handle-play-audio="handleAudioClick"
  />
</template>

<script lang="ts" setup>
import { useEventStore } from '~/stores/event';
import useSDKTracking from '@/composables/SDKTracking';
import useCheckRWD from '~/composables/checkRwd';

const route = useRoute();
const eventEnglishName = route.params.eventEnglishName as string;

definePageMeta({
  layout: 'public',
});

const { sectionsPublic, tenantID } = useEventStore();
const { rwdMode } = useCheckRWD();
const { handleClickEvent } = useSDKTracking({
  pageName: eventEnglishName,
  tenantID,
});

const handleAudioClick = (audioId: number) => {
  handleClickEvent(audioId);
};
</script>
