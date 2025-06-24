<template>
  <vi-scroll class="wrap" v-click-outside="handleClosePopupTemplate">
    <div class="header">
      <vi-icon
        name="ic_section"
        size="24"
        color="#fff"
        v-if="activeSideBar === SIDE_BAR_ACTION.CLICKED_SESSION"
      ></vi-icon>

      <vi-icon
        name="ic_chevron_left"
        @click="onHandleBack"
        size="24"
        color="#fff"
        class="cursor-pointer"
        v-if="activeSideBar === SIDE_BAR_ACTION.CLICKED_AI_TOOLS_LIST"
      ></vi-icon>

      <div class="ml-8 mr-auto neutral-white-alpha-90-text">
        <vi-typography type="subtitle-large">
          {{
            activeSideBar === SIDE_BAR_ACTION.CLICKED_SESSION
              ? $t('landing-editor-menu-title_section')
              : $t('landing-editor-section-title_audio_tts')
          }}
        </vi-typography>
      </div>
      <vi-icon
        class="neutral-white-alpha-60-text cursor-pointer"
        name="ic_close"
        size="24"
        @click="handleClose"
      ></vi-icon>
    </div>
    <div class="neutral-white-alpha-60-text mb-16">
      <vi-typography
        type="subtitle-large"
        v-if="activeSideBar === SIDE_BAR_ACTION.CLICKED_SESSION"
        >Hero</vi-typography
      >
    </div>
    <div class="templates" :class="{ disabled: !PERMISSION.isEditor }">
      <div
        v-for="(template, index) in listTemplate.slice(0, 4)"
        :key="index"
        class="template"
        :class="{
          selected: templateSelected?.id === template.id,
        }"
        @click="() => emit('click-template', template)"
      >
        <img :src="template.imageDemo" alt="" />
      </div>
      <div class="neutral-white-alpha-60-text mb-16">
        <vi-typography
          type="subtitle-large"
          v-if="activeSideBar === SIDE_BAR_ACTION.CLICKED_SESSION"
          >Gallery / Showcase</vi-typography
        >
      </div>

      <div
        v-for="(template, index) in listTemplate.slice(4, 7)"
        :key="index"
        class="template"
        :class="{
          selected: templateSelected?.id === template.id,
        }"
        @click="() => emit('click-template', template)"
      >
        <img :src="template.imageDemo" alt="" />
      </div>

      <div class="neutral-white-alpha-60-text mb-16">
        <vi-typography
          type="subtitle-large"
          v-if="activeSideBar === SIDE_BAR_ACTION.CLICKED_SESSION"
          >Features / Benefits</vi-typography
        >
      </div>
    </div>
  </vi-scroll>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import useCheckPermission from '~/composables/checkPermission';
import { SIDE_BAR_ACTION } from '~/constants/common';
import { useEditorStore } from '~/stores/editor';
import {
  TEMPLATES_SECTION,
  TEMPLATES_AUDIO,
  type SECTION_ITEM,
} from '@/types/templates';

const emit = defineEmits(['click-template', 'close']);
const editorStore = useEditorStore();
const { activeSideBar } = storeToRefs(editorStore);
const listTemplate = ref<SECTION_ITEM[]>([]);
defineProps({
  templateSelected: {
    type: Object,
    default: () => ({}),
  },
});

watch(
  activeSideBar,
  (newVal) => {
    if (newVal === SIDE_BAR_ACTION.CLICKED_SESSION) {
      listTemplate.value = TEMPLATES_SECTION;
    }
    if (newVal === SIDE_BAR_ACTION.CLICKED_AI_TOOLS_LIST) {
      listTemplate.value = TEMPLATES_AUDIO;
    }
  },
  { immediate: true }
);
const { PERMISSION } = useCheckPermission();

const handleClosePopupTemplate = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.closest('tool-tip-open-template')) return;
  editorStore.setActiveSideBar('');
};
const onHandleBack = () => {
  editorStore.setActiveSideBar(SIDE_BAR_ACTION.CLICKED_AI_TOOLS_TUTORIAL);
};
const handleClose = () => {
  editorStore.setActiveSideBar('');
};
</script>

<style lang="scss" scoped>
.wrap {
  position: fixed;
  top: 88px;
  left: 72px;
  z-index: 31;
  min-height: calc(100vh - 112px);
  max-height: calc(100vh - 112px);
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid $neutral-white-alpha-10;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  background: $brand-navy-800;
  border-radius: 8px;
  width: 320px;
  .header {
    padding: 0 16px 8px 16px;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }
  .templates {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    .template {
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img {
        width: 100%;
        object-fit: contain;
      }
      &.selected {
        border-radius: 1px;
        border: 3px solid #fff;
      }
      &:hover {
        border: 2px dashed #2589ff;
        background: rgba(37, 137, 255, 0.3);
      }
    }
  }
}
</style>
