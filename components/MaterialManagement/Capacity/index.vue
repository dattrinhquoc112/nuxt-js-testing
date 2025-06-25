<template>
  <div class="capacity-list" v-if="materialList?.length > 0">
    <vi-typography type="subtitle-large" class="container--title">
      {{ $t('landing-editor-section-material_title_material') }}</vi-typography
    >
    <vi-typography type="body-small" class="capacity-list--desc">
      {{ $t('landing-editor-section-section_media') }}</vi-typography
    >
    <div class="capacity-list--media">
      <MaterialInfo
        v-for="(item, index) in materialListMedia"
        :key="index"
        :material="item"
      />
    </div>
    <div class="capacity-list--audio">
      <MaterialInfo
        v-for="(item, index) in materialListAudio"
        :key="index"
        :material="item"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { MaterialItem } from '~/types/material';
import MaterialInfo from './MaterialInfo.vue';

const props = defineProps<{
  materialList: MaterialItem[];
}>();

const materialListMedia = computed(() => {
  return props.materialList?.filter((item) => item.type === 'MEDIA');
});

const materialListAudio = computed(() => {
  return props.materialList?.filter((item) => item.type === 'AUDIO_TTS');
});
</script>
<style scoped lang="scss">
.capacity-list {
  margin-top: 24px;
  &--desc {
    margin: 16px 0px;
    color: $neutral-white-alpha-80;
  }
  &--media,
  &--audio {
    gap: 8px;
    display: flex;
    flex-direction: column;
  }
  &--audio {
    margin-top: 8px;
  }
}
</style>
