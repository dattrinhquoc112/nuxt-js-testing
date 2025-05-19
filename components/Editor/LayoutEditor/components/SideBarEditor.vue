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
        @click="activeSidebarButton = SIDEBAR_BUTTONS[0]"
      >
      </vi-button>
      <template #content>
        <ToolTipSection />
      </template>
    </vi-tooltip>

    <vi-tooltip
      position="right"
      align="start"
      :arrow-visible="false"
      :default-padding="false"
      :visible="isOpenTooltip"
      :delay-time="2000"
      :full-width="false"
      class="ai-tool-tooltip"
    >
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
      <template #content>
        <AIToolsTutorial @openTorialModal="isShowModal = true" />
      </template>
    </vi-tooltip>
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
    <vi-modal
      modal-title="尚未有發布的模型"
      :is-show="isShowModal"
      @close="isShowModal = false"
      size="small"
    >
      <vi-typography type="body-small" class="tutorial-modal--title">{{
        $t('ai-tools-tutorial-description')
      }}</vi-typography>
      <template #footer>
        <div class="tutorial-modal--footer">
          <vi-button
            type="standard-default"
            width="fit-content"
            @click="handleConfirmModal"
          >
            {{ $t('return') }}
          </vi-button>
          <vi-button
            type="standard-primary"
            width="fit-content"
            @click="handleCancelModal"
          >
            {{ $t('go') }}
          </vi-button>
        </div>
      </template>
    </vi-modal>
  </div>
</template>
<script setup lang="ts">
import AIToolsTutorial from '@/components/Tutorial/AIToolsTutorial.vue';
import { USER_VISITED } from '@/constants/storage';
import ToolTipSection from '../../ToolTipSection/ToolTipSection.vue';

const SIDEBAR_BUTTONS = ['ic_section', 'ic_ai_section', 'ic_capacity'];
const isShowModal = ref(false);
const activeSidebarButton = ref();
const handleConfirmModal = () => {
  isShowModal.value = false;
};
const isOpenTooltip = ref(false);
const handleCancelModal = () => {
  isShowModal.value = false;
};

onMounted(() => {
  // Check if the user is visiting the site for the first time. If so, show the guide.
  const isVisited = localStorage.getItem(USER_VISITED);
  if (!isVisited) {
    isOpenTooltip.value = true;
    localStorage.setItem(USER_VISITED, USER_VISITED);
  }
});
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
.ai-tool-tooltip :deep(.vyin-ui-kit-tooltip-content.right.start) {
  top: -50px;
}
.tutorial-modal {
  &--title {
    padding: 16px 0px;
  }
  &--footer {
    display: flex;
    gap: 16px;
    justify-content: end;
  }
}
</style>
