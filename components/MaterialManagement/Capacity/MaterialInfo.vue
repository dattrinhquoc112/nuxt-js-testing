<template>
  <div class="material-info">
    <div
      class="material-info--img"
      v-if="!isVideo"
      :style="{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getImage(
          material.thumbnail || material.fileUri
        )}') center/cover no-repeat`,
        backgroundColor: 'lightgray',
      }"
    ></div>
    <div class="video-wrapper">
      <video
        v-if="isVideo"
        :muted="true"
        loop
        playsinline
        @canplay="false"
        style="pointer-events: none"
        class="video-style"
      >
        <source :src="getImage(material.fileUri)" />
      </video>
      <div class="gradient-overlay"></div>
    </div>
    <div
      class="material-info--file"
      :title="
        getFileName(material.fileUri ?? '')[0] +
        getFileName(material.fileUri ?? '')[1]
      "
    >
      <span class="material-info--file__name">
        {{ getFileName(material.fileUri ?? '')[0] }}
      </span>
      <span class="material-info--file__format">
        {{ fileExtension }}
      </span>
      <span class="material-info--file__size">
        {{ convertFileSize(material?.fileSize ?? 0) }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { MATERIAL_ITEM } from '~/types/templates';

const videoExtensions = [
  'mp4',
  'webm',
  'ogg',
  'mov',
  'avi',
  'mkv',
  'flv',
  'wmv',
  '3gp',
  'm4v',
];
const props = defineProps({
  material: {
    type: Object as PropType<MATERIAL_ITEM>,
    required: true,
  },
});

const fileExtension = computed(() => {
  return getFileName(props.material.fileUri ?? '')[1]
    ? getFileName(props.material.fileUri ?? '')[1]
    : props.material?.extension;
});
const isVideo = computed(() => {
  return videoExtensions.includes(fileExtension.value);
});
</script>

<style scoped lang="scss">
.material-info {
  position: relative;
  &--img {
    height: 164px;
    cursor: pointer;
  }
  &--file {
    bottom: 8px;
    left: 8px;
    right: 8px;
    position: absolute;
    display: flex;
    cursor: pointer;
    &__name {
      max-width: 166px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__size {
      margin-left: auto;
    }
  }
}
.video-style {
  width: 100%;
  height: auto;
}
.video-wrapper {
  position: relative;
  cursor: pointer;
}
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
  pointer-events: none;
  cursor: pointer;
}
</style>
