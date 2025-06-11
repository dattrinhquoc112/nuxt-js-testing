<template>
  <div class="material-info">
    <div
      class="material-info--img"
      :style="{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getImage(
          material.fileUri
        )}') center/cover no-repeat`,
        backgroundColor: 'lightgray',
      }"
    ></div>

    <div
      class="material-info--file"
      :title="
        getFileName(material.fileUri)[0] + getFileName(material.fileUri)[1]
      "
    >
      <span class="material-info--file__name">
        {{ getFileName(material.fileUri)[0] }}
      </span>
      <span class="material-info--file__format">
        {{
          getFileName(material.fileUri)[1]
            ? getFileName(material.fileUri)[1]
            : material?.extension
        }}
      </span>
      <span class="material-info--file__size">
        {{ convertFileSize(material?.fileSize) }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import useProjects from '~/composables/projects';

const { getImage } = useProjects();
interface MaterialItem {
  extension: string;
  type: string;
  fileUri: string;
  fileSize: number;
}

defineProps<{
  material: MaterialItem;
}>();
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
</style>
