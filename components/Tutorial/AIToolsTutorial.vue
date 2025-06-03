<template>
  <div class="ai-tools-tutorial" v-show="modelValue">
    <div class="ai-tools-tutorial--title">
      <span class="ai-tools-tutorial--title__icon">
        <vi-icon name="ic_ai_section" :size="24" color="#fff" />
      </span>
      <vi-typography type="subtitle-large">{{
        $t('landing-editor-menu-section_ai_tools')
      }}</vi-typography>
      <span
        class="ai-tools-tutorial--title__icon-close"
        @click="handleCloseTooltip"
      >
        <vi-icon
          name="ic_close"
          :size="24"
          class="neutral-white-alpha-60-text"
        />
      </span>
    </div>
    <div class="ai-tools-tutorial--content">
      <vi-typography type="subtitle-large">{{ $t('audio-tts') }}</vi-typography>
      <vi-typography type="body-small">{{
        $t('ai-tools-tutorial-description')
      }}</vi-typography>
      <img
        src="/assets/images/ai-tool-tutorial-banner.png"
        alt=""
        @click="openTutorialModal"
        class="cursor-pointer"
      />
    </div>
  </div>

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
          @click="() => (isShowModal = false)"
        >
          {{ $t('return') }}
        </vi-button>
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="handleNavigatePage"
        >
          {{ $t('go') }}
        </vi-button>
      </div>
    </template>
  </vi-modal>
</template>
<script setup lang="ts">
import { useEditorStore } from '~/stores/editor';

defineProps({
  modelValue: Boolean,
});
const emit = defineEmits<{
  openTutorialModal: [];
  handleCloseTooltip: [];
  handleOpenAITools: [];
  'update:modelValue': [e: Boolean];
}>();
const { getVoiceModelList } = useEditorStore();
const isShowModal = ref(false);
const openTutorialModal = async () => {
  emit('handleOpenAITools');
  emit('update:modelValue', false);
  const res = await getVoiceModelList();
  if (!(res.data.length > 0)) {
    emit('handleOpenAITools');
    emit('update:modelValue', false);
  } else {
    isShowModal.value = true;
  }
};
const handleNavigatePage = () => {
  const audioDomain = useRuntimeConfig().public.clientAudioHost;
  const audioListURL = `${audioDomain}/project-list`;
  openLink(audioListURL);
  isShowModal.value = false;
  emit('handleCloseTooltip');
};
const handleCloseTooltip = () => {
  emit('handleCloseTooltip');
};
</script>
<style scoped lang="scss">
.ai-tools-tutorial {
  display: flex;
  width: 320px;
  z-index: 30;
  height: calc(100vh - 112px);
  max-height: 912px;
  padding-bottom: 16px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 8px;
  position: fixed;
  z-index: 30;
  left: 72px;
  top: 88px;
  border: 1px solid $neutral-white-alpha-10;
  background: $brand-navy-800;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  &--title {
    display: flex;
    width: 100%;
    color: $neutral-white-alpha-90;
    align-items: center;
    padding: 16px 24px 8px 24px;
    &__icon {
      display: flex;
      width: 24px;
      height: 24px;
      padding: 4px;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      background: linear-gradient(66deg, #0078d8 15.31%, #ff2cf0 84.69%);
      margin-right: 8px;
    }
    &__icon-close {
      cursor: pointer;
      margin-left: auto;
    }
  }
  &--content {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: white;
    text-align: left;
    text-wrap: auto;
    & img {
      width: 100%;
    }
  }
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
