<template>
  <div class="sidebar-editor">
    <span
      :class="{
        active: activeSidebarButton === SIDEBAR_BUTTONS[0],
      }"
    >
      <vi-button
        type="standard-subtle"
        size="large"
        width="fit-content"
        @click="activeSidebarButton = SIDEBAR_BUTTONS[0]"
      >
        <vi-icon name="ic_section" size="32" color="#fff" />
      </vi-button>
    </span>
    <span
      class="mt-4"
      :class="{
        active: activeSidebarButton === SIDEBAR_BUTTONS[1],
      }"
    >
      <vi-button
        type="standard-subtle"
        size="large"
        width="fit-content"
        @click="activeSidebarButton = SIDEBAR_BUTTONS[1]"
      >
        <vi-icon name="ic_ai_section" size="32" color="#fff" />
      </vi-button>
    </span>
    <span
      class="mt-auto"
      :class="{
        active: activeSidebarButton === SIDEBAR_BUTTONS[2],
      }"
    >
      <vi-button
        type="standard-subtle"
        size="large"
        width="fit-content"
        @click="activeSidebarButton = SIDEBAR_BUTTONS[2]"
      >
        <vi-icon name="ic_capacity" size="32" color="#fff" />
      </vi-button>
    </span>
  </div>
</template>
<script setup lang="ts">
const SIDEBAR_BUTTONS = ['ic_section', 'ic_ai_section', 'ic_capacity'];
const activeSidebarButton = ref(SIDEBAR_BUTTONS[0]);
</script>
<style lang="scss" scoped>
.sidebar-editor {
  padding: 24px 4px;
  width: fit-content;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: $neutral-white-alpha-7;
}
.active {
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid $neutral-white-alpha-10;
  background: $neutral-white-alpha-15;
}
.mt-auto {
  margin-top: auto;
}
.p-12 {
  padding: 12px;
}
.mt-4 {
  margin-top: 4px;
}
:deep() .typography.text-button {
  height: 32px !important;
}
:deep() .ui-kit-button.large.standard-subtle {
  padding: 12px !important;
}
</style>
