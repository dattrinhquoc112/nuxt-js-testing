<template>
  <div class="sidebar-editor">
    <vi-tooltip
      position="right"
      align="start"
      :arrow-visible="false"
      :full-width="false"
      :delay-time="2000"
    >
      <vi-button
        :class="{
          active: activeSidebarButton === SIDEBAR_BUTTONS[0],
        }"
        no-text
        icon-before="ic_section"
        type="standard-subtle"
        size="extra-large"
        width="fit-content"
        @click="
          () =>
            handleAction(SIDEBAR_BUTTONS[0], SIDE_BAR_ACTION.CLICKED_SESSION)
        "
      >
      </vi-button>
      <template #content>
        <ToolTipSection />
      </template>
    </vi-tooltip>

    <div class="ai-tool">
      <vi-button
        type="standard-subtle"
        size="extra-large"
        width="fit-content"
        class="mt-4"
        no-text
        icon-before="ic_ai_section"
        :class="{
          active: activeSidebarButton === SIDEBAR_BUTTONS[1],
        }"
        @click="
          () => {
            activeSidebarButton = SIDEBAR_BUTTONS[1];
            handleAction(SIDEBAR_BUTTONS[1], SIDE_BAR_ACTION.CLICKED_AI_TOOLS);
          }
        "
      />
      <vi-button
        type="standard-subtle"
        size="extra-large"
        icon-before="ic_capacity"
        width="fit-content"
        no-text
        @click="
          () => {
            activeSidebarButton = SIDEBAR_BUTTONS[2];
            isOpenMaterialManagement = true;
            handleAction(SIDEBAR_BUTTONS[2], SIDE_BAR_ACTION.CLICKED_CAPACITY);
          }
        "
        class="mt-auto"
        :class="{
          active: activeSidebarButton === SIDEBAR_BUTTONS[2],
        }"
      >
      </vi-button>
    </div>
  </div>
  <material-management v-model="isOpenMaterialManagement" />
</template>
<script setup lang="ts">
import { SIDE_BAR_ACTION } from '~/constants/common';
import ToolTipSection from '../../ToolTipSection/ToolTipSection.vue';

const isOpenMaterialManagement = ref(false);
const SIDEBAR_BUTTONS = ['ic_section', 'ic_ai_section', 'ic_capacity'];
const activeSidebarButton = inject<Ref<String>>('activeSidebarButton');
const emit = defineEmits(['click-sidebar']);

const props = defineProps({
  isShowListSection: {
    type: String,
    default: '',
  },
});
watch(
  () => activeSidebarButton?.value,
  (newVal) => {
    if (newVal && newVal === SIDEBAR_BUTTONS[2]) {
      isOpenMaterialManagement.value = true;
    }
  }
);
watch(isOpenMaterialManagement, (newVal) => {
  if (!newVal && activeSidebarButton) {
    activeSidebarButton.value = '';
  }
});
watch(
  () => props.isShowListSection,
  (newVal) => {
    if (newVal === '' && activeSidebarButton) {
      activeSidebarButton.value = '';
    }
  }
);

const handleAction = (keyIcon: string, keyAction: any) => {
  if (activeSidebarButton) {
    activeSidebarButton.value = keyIcon;
  }
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
