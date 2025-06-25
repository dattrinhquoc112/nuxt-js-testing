<template>
  <div v-if="urlVideo" :key="urlVideo" class="video-wrap">
    <vi-spin
      v-if="isLoading"
      icon-size="30px"
      :loading="isLoading"
      height="100%"
      width="100%"
    />
    <video
      v-show="!isLoading"
      :class="isTypeVideo"
      autoplay
      :muted="isMuted"
      loop
      playsinline
      @canplay="onVideoLoaded"
    >
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
defineProps({
  urlVideo: {
    type: String,
    default: '',
  },
  isTypeVideo: {
    type: String,
    default: 'video-background-section',
  },
});
const isMuted = ref(true);
const isLoading = ref(true);

const onVideoLoaded = () => {
  isLoading.value = false;
};
</script>
