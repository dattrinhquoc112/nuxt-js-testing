<template>
  <div v-if="urlVideo" :key="urlVideo" class="video-wrap">
    <video autoplay :muted="isMuted" loop playsinline>
      <source :src="getImage(urlVideo)" />
    </video>
    <div class="icon-sound" @click="isMuted = !isMuted">
      <vi-icon
        class=""
        :key="isMuted"
        :name="isMuted ? 'ic_volume_off' : 'ic_volume_on'"
        color="#fff"
        size="24"
      ></vi-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import useProjects from '~/composables/projects';

defineProps({
  urlVideo: {
    type: String,
    default: '',
  },
});
const isMuted = ref(true);

const { getImage } = useProjects();
</script>
