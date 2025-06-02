<template>
  <LayoutEditor
    @handle-undo="handleUndo"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handle-switcher-layout="checkVersionAndUpdate({}, 'switch-layout')"
    @handle-play="handleEvent"
    @handle-store-changes="checkVersionAndUpdate({}, 'save')"
    @handle-release="handleEvent"
    @click-sidebar="
      (keyAction) => checkVersionAndUpdate({ keyAction }, 'show-section')
    "
    @handle-back="handleBack"
    @scroll-editor="handleHiddenAllControl"
  >
    <editor
      ref="editorRef"
      :list-template="listTemplateCurrent"
      :is-show-list-section="isShowListSection"
      @close-section="isShowListSection = false"
    />
  </LayoutEditor>

  <editor-popup-confirm-save
    :is-show="isShowModal.confirmSave"
    @close="isShowModal.confirmSave = false"
    @handle-leave="handleLeave"
    @handle-save-draft="handleSaveDraft"
  />
  <editor-popup-confirm-replace-content
    :is-show="isShowModal.confirmReplace"
    @close="isShowModal.confirmReplace = false"
    @handle-save-current="handleSaveTemplate"
    @handle-update-new="handleUpdateToNewVersion"
  />
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { useEditorStore } from '~/stores/editor';
import { useProjectStore } from '~/stores/project';
import { TEMPLATES_SECTION, TEMPLATES_AUDIO } from '~/types/templates';

definePageMeta({
  layout: 'editor',
});
const { setLoading } = useEditorStore();
const { checkIsLatestVersion } = useProjectStore();
const { t } = useI18n();
const isShowListSection = ref(false);
const historyStatus = ref();
const isShowModal = reactive({
  confirmSave: false,
  confirmReplace: false,
});
const editorRef = ref();
const listTemplateCurrent = ref<any[]>(TEMPLATES_SECTION);
const handleEvent = () => {};
watch(
  () => editorRef.value?.historyStatus,
  (newVal) => {
    historyStatus.value = newVal;
  }
);

const handleSaveTemplate = async () => {
  setLoading('updateContent', true);
  await editorRef.value.handleSaveTemplate();
  setLoading('updateContent', false);
  isShowModal.confirmReplace = false;
  window.VIUIKit.VIMessage({
    title: t('notification-status-action-save_success'),
    width: '348px',
  });
};

const handleClickSideBar = (keyAction: string) => {
  isShowListSection.value = true;
  if (keyAction === 'toggle-section') {
    listTemplateCurrent.value = TEMPLATES_SECTION;
  }
  if (keyAction === 'toggle-audio') {
    listTemplateCurrent.value = TEMPLATES_AUDIO;
  }
};

const checkVersionAndUpdate = async ({ keyAction = '' }, type: string = '') => {
  try {
    const isLatestVersion = await checkIsLatestVersion();
    if (!isLatestVersion) {
      isShowModal.confirmReplace = true;
    } else {
      switch (type) {
        case 'save':
          handleSaveTemplate();
          break;
        case 'switch-layout':
          break;
        case 'show-section':
          handleClickSideBar(keyAction);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const handleUpdateToNewVersion = async () => {
  setLoading('updateContent', true);
  await editorRef.value.fetchContentProject();
  setLoading('updateContent', false);
  isShowModal.confirmReplace = false;
  window.VIUIKit.VIMessage({
    title: t('landing-editor-message-version_updated'),
    width: '348px',
  });
};

const handleHiddenAllControl = () => {
  editorRef.value?.hiddenBoxControl();
};

const handleLeave = () => {
  isShowModal.confirmSave = false;
  navigateTo('/project-list');
};

const handleSaveDraft = () => {
  // TODO: implement save draft logic
  isShowModal.confirmSave = false;
  navigateTo('/project-list');
  alert('Draft saved successfully!');
};
const handleBack = () => {
  const isSectionDirty = editorRef.value?.isSectionDirty();
  if (isSectionDirty) {
    navigateTo('/project-list');
  } else {
    isShowModal.confirmSave = true;
  }
};
const handleUndo = () => {
  editorRef.value?.undo();
};
const handleRedo = () => {
  editorRef.value?.redo();
};
</script>

<style lang="scss" scoped>
:deep() {
  .editor-leave {
    &__footer {
      display: flex;
      justify-content: end;
      gap: 16px;
    }
    &__title {
      margin-bottom: 16px;
    }
  }
}
</style>
