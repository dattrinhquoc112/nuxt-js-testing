<template>
  <video v-if="urlVideo" :key="urlVideo" autoplay muted loop playsinline>
    <source :src="getImage(urlVideo)" />
  </video>
</template>

<script setup lang="ts">
import useProjects from '~/composables/projects';

defineProps({
  urlVideo: {
    type: String,
    default: '',
  },
});

const { getImage } = useProjects();
</script>

<style></style>
