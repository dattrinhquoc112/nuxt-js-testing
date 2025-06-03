<template>
  <LayoutEditor
    :isShowListSection="isShowListSection"
    @handle-undo="handleUndo"
    :rwd-mode="RWDMode"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handleSwitchLayout="(e) => SwitchToRWD(e)"
    @handle-play="handlePreview"
    @scroll-editor="handleHiddenAllControl"
    @handle-switcher-layout="checkVersionAndUpdate({}, 'switch-layout')"
    @handle-release="handleCheckCOnditionPublish"
    @handle-store-changes="checkVersionAndUpdate({}, 'save')"
    @click-sidebar="
      (keyAction) => checkVersionAndUpdate({ keyAction }, 'show-section')
    "
    @handle-back="handleBack"
    @handle-activity-settings="isShowActivitySettingModal = true"
    @handle-edit-info="isShowEditInfoModal = true"
    @handle-switch-layout="() => {}"
    :project-name="webEditorName"
  >
    <vi-scroll
      class="editor__content"
      :class="{ 'editor__content--mobile': RWDMode === RWD_MODE.MOBILE }"
    >
      <editor
        :rwd-mode="RWDMode"
        ref="editorRef"
        :list-template="listTemplateCurrent"
        :is-show-list-section="isShowListSection"
        @close-section="isShowListSection = ''"
      />
    </vi-scroll>
  </LayoutEditor>
  <popup-setting-project
    :show="isShowActivitySettingModal"
    :project="project"
    @close="isShowActivitySettingModal = false"
    @submit="handleSubmitSettingProject"
  />
  <popup-edit-project
    :show="isShowEditInfoModal"
    :value="webEditorName"
    @close="isShowEditInfoModal = false"
    @edit="handleEditEditor"
  />

  <EditorReminderPU
    v-model:model="isOpenReminderPU"
    @handle-click="
      () => {
        isOpenReminderPU = false;
        isShowActivitySettingModal = true;
      }
    "
  />
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
import { TEMPLATES_SECTION, TEMPLATES_AUDIO } from '@/types/templates';
import {
  RWD_MODE,
  DEFAULT_WEB_EDITOR_NAME,
  SIDE_BAR_ACTION,
} from '~/constants/common';
import { WEB_EDITOR_PREVIEW } from '@/constants/storage';
import { ROUTE } from '@/constants/route';
import { useProjectStore } from '@/stores/project';
import { toastMessage } from '#imports';
import { useEditorStore } from '~/stores/editor';

const { getProject, editProject, createProject, publishProject } =
  useProjectStore();
definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);

const isOpenReminderPU = ref(false);
const { setLoading } = useEditorStore();
const { checkIsLatestVersion } = useProjectStore();
const { t } = useI18n();
const isShowListSection = ref('');
const historyStatus = ref();
const isShowModal = reactive({
  confirmSave: false,
  confirmReplace: false,
});
const editorRef = ref();
const listTemplateCurrent = ref<any[]>(TEMPLATES_SECTION);
const isShowEditInfoModal = ref(false);
const isShowActivitySettingModal = ref(false);
const handleEvent = () => {};
const projectName = ref();
const route = useRoute();
const editorID = ref('');
const webEditorName = ref(DEFAULT_WEB_EDITOR_NAME);
const project = ref();
const handleGetProjectDetail = async (id: any) => {
  const detailProject = await getProject(id);
  if (detailProject) {
    const { data } = detailProject;
    return data;
  }
  return {};
};

watch(
  () => editorRef.value?.historyStatus,
  (newVal) => {
    historyStatus.value = newVal;
  }
);

const handlePreview = () => {
  const sections = editorRef.value?.sections;
  localStorage.setItem(WEB_EDITOR_PREVIEW, JSON.stringify(sections));
  window.open(ROUTE.EDITOR_PREVIEW, '_blank');
};
watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      editorID.value = Array.isArray(newId) ? newId[0] ?? '' : newId;
      const data = await handleGetProjectDetail(newId);
      webEditorName.value = data.name;
      const res = await getProject(editorID.value);
      project.value = res.data;
    }
  },
  {
    immediate: true,
  }
);

const handleCheckCOnditionPublish = async () => {
  const isFinishSetupEvent =
    project.value?.metaTitle &&
    project.value?.ogTitle &&
    project.value?.eventEnglishName &&
    project.value.startTime &&
    project.value.endTime;
  // TODO: need to update check setup finished audio
  const isFinishedSetupAudio = true;
  if (!!isFinishSetupEvent && !!isFinishedSetupAudio) {
    const res = await publishProject(editorID.value);
    if (res.data) {
      toastMessage(t(' landing-project_mgmt-menu-published'));
    }
  } else {
    isOpenReminderPU.value = true;
  }
  return !!isFinishSetupEvent && !!isFinishedSetupAudio;
};

const handleEditEditor = async (name: string) => {
  if (editorID.value) {
    const res = await editProject(editorID.value, { name });
    isShowEditInfoModal.value = false;
    if (res.data) {
      webEditorName.value = res.data.name;
      toastMessage(t('landing-common-message-saved'));
    }
  } else {
    webEditorName.value = name;
    await createProject(name);
  }
};

const handleSubmitSettingProject = async (payload: any) => {
  isShowActivitySettingModal.value = false;
  if (!editorID.value) {
    const res = await createProject(webEditorName.value);
    editorID.value = res.data.id;
    const resEdit = await editProject(editorID.value, payload);
    project.value = resEdit.data;
    toastMessage(t('landing-common-message-saved'));
  }
};

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
  isShowListSection.value = keyAction;
  if (keyAction === SIDE_BAR_ACTION.CLICKED_SESSION) {
    listTemplateCurrent.value = TEMPLATES_SECTION;
  }
  if (keyAction === SIDE_BAR_ACTION.CLICKED_AI_TOOLS) {
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

const SwitchToRWD = (e: any) => {
  RWDMode.value = e;
};

const handleLeave = () => {
  navigateTo(ROUTE.PROJECT_LIST);
  isShowModal.confirmSave = false;
};

const handleSaveDraft = () => {
  // TODO: implement save draft logic
  isShowModal.confirmSave = false;
  navigateTo(ROUTE.PROJECT_LIST);
};
const handleBack = () => {
  const isSectionDirty = editorRef.value?.isSectionDirty();
  if (isSectionDirty) {
    navigateTo(ROUTE.PROJECT_LIST);
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

.editor {
  &__content {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    height: calc(100vh - 64px);
    &--mobile {
      width: 375px;
    }
  }
}
</style>
