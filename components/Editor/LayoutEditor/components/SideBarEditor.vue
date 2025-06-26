<template>
  <div class="sidebar-editor">
    <vi-tooltip
      class="tool-tip-open-template"
      position="right"
      align="start"
      :arrow-visible="false"
      :full-width="false"
      :delay-time="2000"
    >
      <vi-button
        :class="{
          active: activeSideBar === SIDE_BAR_ACTION.CLICKED_SESSION,
        }"
        no-text
        icon-before="ic_section"
        type="standard-subtle"
        size="extra-large"
        width="fit-content"
        @click="() => handleAction(SIDE_BAR_ACTION.CLICKED_SESSION)"
      >
      </vi-button>
      <template #content>
        <ToolTipSection type="section" />
      </template>
    </vi-tooltip>

    <div class="ai-tool">
      <vi-tooltip
        class="tool-tip-open-template"
        position="right"
        align="start"
        :arrow-visible="false"
        :full-width="false"
        :delay-time="2000"
      >
        <vi-button
          type="standard-subtle"
          size="extra-large"
          width="fit-content"
          class="mt-4"
          no-text
          icon-before="ic_ai_section"
          :class="{
            active:
              activeSideBar === SIDE_BAR_ACTION.CLICKED_AI_TOOLS_TUTORIAL ||
              activeSideBar === SIDE_BAR_ACTION.CLICKED_AI_TOOLS_LIST,
          }"
          @click="
            () => {
              handleAction(SIDE_BAR_ACTION.CLICKED_AI_TOOLS_TUTORIAL);
            }
          "
        />
        <template #content>
          <ToolTipSection type="audio" />
        </template>
      </vi-tooltip>
      <vi-button
        type="standard-subtle"
        size="extra-large"
        icon-before="ic_capacity"
        width="fit-content"
        no-text
        @click="
          () => {
            handleAction(SIDE_BAR_ACTION.CLICKED_CAPACITY);
          }
        "
        class="mt-auto"
        :class="{
          active: activeSideBar === SIDE_BAR_ACTION.CLICKED_CAPACITY,
        }"
      >
      </vi-button>
    </div>
  </div>
  <material-management
    v-model="isOpenMaterialManagement"
    v-if="activeSideBar === SIDE_BAR_ACTION.CLICKED_CAPACITY"
  />
</template>
<script setup lang="ts">
import { SIDE_BAR_ACTION } from '~/constants/common';
import { useEditorStore } from '~/stores/editor';
import { storeToRefs } from 'pinia';
import ToolTipSection from '../../ToolTipSection/ToolTipSection.vue';

const isOpenMaterialManagement = ref(false);

const emit = defineEmits(['click-sidebar']);
const editorStore = useEditorStore();
const { activeSideBar } = storeToRefs(editorStore);
defineProps({
  isShowListSection: {
    type: String,
    default: '',
  },
});

const handleAction = (keyAction: any) => {
  emit('click-sidebar', keyAction);
};
</script>

<style lang="scss" scoped>
.sidebar-editor {
  padding: 24px 4px;
  width: fit-content;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: $neutral-white-alpha-7;
  & .mt-auto {
    margin-top: auto;
  }
  & .mt-4 {
    margin-top: 4px;
  }
}
.active {
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid $neutral-white-alpha-10;
  background: $neutral-white-alpha-15 !important;
}

:deep(.vyin-ui-kit-tooltip-content.right.start) {
  background-color: transparent !important;
}
.ai-tool {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
