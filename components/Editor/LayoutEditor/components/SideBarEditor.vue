<template>
  <div class="sidebar-editor">
    <vi-tooltip
      position="right"
      align="start"
      :arrow-visible="false"
      :default-padding="false"
      :visible="true"
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
        @click="() => handleAction(SIDEBAR_BUTTONS[0], 'toggle-section')"
      >
      </vi-button>
      <template #content>
        <ToolTipSection />
      </template>
    </vi-tooltip>

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
      @click="activeSidebarButton = SIDEBAR_BUTTONS[1]"
    >
    </vi-button>
    <vi-button
      type="standard-subtle"
      size="extra-large"
      icon-before="ic_capacity"
      width="fit-content"
      no-text
      @click="activeSidebarButton = SIDEBAR_BUTTONS[2]"
      class="mt-auto"
      :class="{
        active: activeSidebarButton === SIDEBAR_BUTTONS[2],
      }"
    >
    </vi-button>
  </div>
</template>
<script setup lang="ts">
import ToolTipSection from '../../ToolTipSection/ToolTipSection.vue';

const emit = defineEmits(['click-sidebar']);
const SIDEBAR_BUTTONS = ['ic_section', 'ic_ai_section', 'ic_capacity'];
const activeSidebarButton = ref();

const handleAction = (keyIcon: string, keyAction: any) => {
  activeSidebarButton.value = keyIcon;
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
</style>
