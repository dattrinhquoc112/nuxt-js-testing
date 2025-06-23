<template>
  <SideBarItemContainer v-click-outside="handleCloseTooltip">
    <template #title>
      <common-close-container
        @handle-close="handleCloseTooltip"
        :label="$t('landing-editor-menu-section_ai_tools')"
      >
        <span class="ai-tools-tutorial__icon">
          <vi-icon name="ic_ai_section" :size="16" color="#fff" />
        </span>
      </common-close-container>
    </template>
    <template #content>
      <vi-typography type="subtitle-large">{{
        $t('landing-editor-section-title_audio_tts')
      }}</vi-typography>
      <vi-typography type="body-small">{{
        $t('landing-editor-section-description_audio_tts')
      }}</vi-typography>
      <img
        src="/assets/images/ai-tool-tutorial-banner.png"
        alt=""
        @click="openTutorialModal"
        class="cursor-pointer"
      />
    </template>
  </SideBarItemContainer>

  <vi-modal
    :modal-title="$t('landing-tutorial-modal-unpublished_model_title')"
    :is-show="isShowModal"
    @close="isShowModal = false"
    size="small"
  >
    <vi-typography type="body-small" class="tutorial-modal--title">{{
      $t('landing-tutorial-modal-unpublished_model_message')
    }}</vi-typography>
    <template #footer>
      <div class="tutorial-modal--footer">
        <vi-button
          type="standard-default"
          width="fit-content"
          @click="() => (isShowModal = false)"
        >
          {{ $t('common-action-button-button_back') }}
        </vi-button>
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="handleNavigatePage"
        >
          {{ $t('common-action-button-button_go') }}
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>
<script setup lang="ts">
import { useEditorStore } from '~/stores/editor';
import { SIDE_BAR_ACTION } from '~/constants/common';
import SideBarItemContainer from '../Common/SideBarItemContainer.vue';

const { getVoiceModelList } = useEditorStore();
const editorStore = useEditorStore();
const isShowModal = ref(false);
const openTutorialModal = async () => {
  const res = await getVoiceModelList();
  if (res.data.length > 0) {
    editorStore.setActiveSideBar(SIDE_BAR_ACTION.CLICKED_AI_TOOLS_LIST);
  } else {
    isShowModal.value = true;
  }
};
const handleNavigatePage = () => {
  const audioDomain = useRuntimeConfig().public.clientAudioHost;
  const audioListURL = `${audioDomain}/project-list`;
  openLink(audioListURL);
  isShowModal.value = false;
};
const handleCloseTooltip = () => {
  editorStore.setActiveSideBar('');
};
</script>
<style scoped lang="scss">
.ai-tools-tutorial {
  &__icon {
    display: flex;
    padding: 4px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
  }
  &__icon-close {
    cursor: pointer;
    margin-left: auto;
  }
}

.tutorial-modal {
  &--footer {
    display: flex;
    gap: 16px;
    justify-content: end;
  }
}
:deep(.body.small) {
  border: none !important;
  outline: 1px solid $neutral-white-alpha-10 !important;
}
:deep(.modal-icon-close) {
  padding: 0 !important;
}
</style>
