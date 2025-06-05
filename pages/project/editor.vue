<template>
  <LayoutEditor
    :rwd-mode="RWDMode"
    :isShowListSection="isShowListSection"
    @handle-undo="handleUndo"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handle-switch-layout="
      (keyAction) =>
        checkVersionAndUpdate({ keyAction }, ACTION_LIST.SWITCH_RWD)
    "
    @handle-play="checkVersionAndUpdate({}, ACTION_LIST.PREVIEW)"
    @handle-release="handleCheckCOnditionPublish"
    @handle-store-changes="checkVersionAndUpdate({}, ACTION_LIST.SAVE)"
    @click-sidebar="
      (keyAction) =>
        checkVersionAndUpdate({ keyAction }, ACTION_LIST.SHOW_SECTION)
    "
    @handle-back="handleBack"
    @handle-activity-settings="isShowActivitySettingModal = true"
    @handle-edit-info="isShowEditInfoModal = true"
    :project-name="webEditorName"
    @scroll-editor="handleHiddenAllControl"
  >
    <vi-scroll
      class="editor__content"
      :class="{ 'editor__content--mobile': RWDMode === RWD_MODE.MOBILE }"
    >
      <editor
        ref="editorRef"
        :rwd-mode="RWDMode"
        :list-template="listTemplateCurrent"
        :is-show-list-section="isShowListSection"
        @close-section="isShowListSection = ''"
      />
    </vi-scroll>
  </LayoutEditor>
  <popup-setting-project
    v-if="isShowActivitySettingModal"
    :show="isShowActivitySettingModal"
    :project="project"
    @close="isShowActivitySettingModal = false"
    @submit="handleSubmitSettingProject"
  />
  <popup-edit-project
    v-if="isShowEditInfoModal"
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
import { WEB_EDITOR_PREVIEW } from '@/constants/storage';
import { ROUTE } from '@/constants/route';
import { SIDE_BAR_ACTION, RWD_MODE } from '@/constants/common';
import { useProjectStore } from '@/stores/project';
import { toastMessage } from '#imports';
import { useEditorStore } from '~/stores/editor';

const { getProject, editProject, createProject, publishProject } =
  useProjectStore();
definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);
const router = useRouter();
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
const webEditorName = ref(t('landing-editor-title-untitled_project'));
const project = ref();

const configVersion = ref({
  keyAction: '',
  type: '',
});
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
  sessionStorage.setItem(WEB_EDITOR_PREVIEW, JSON.stringify(sections));
  window.open(ROUTE.EDITOR_PREVIEW, '_blank');
};

const SwitchToRWD = (e: any) => {
  RWDMode.value = e;
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
  const isFinishedSetupAudio = true;

  if (!!isFinishSetupEvent && !!isFinishedSetupAudio) {
    try {
      await publishProject(editorID.value);
      toastMessage(t('landing-project_mgmt-menu-published'));
      navigateTo(ROUTE.PROJECT_LIST);
    } catch (error: any) {
      const errCode = error?.data?.statusMessage;
      if (errCode && errCode === 'PROJECT_URL_DUPLICATE') {
        isOpenReminderPU.value = true;
      }
    }
  } else {
    isOpenReminderPU.value = true;
  }
  return !!isFinishSetupEvent && !!isFinishedSetupAudio;
};

const handleEditEditor = async (name: string) => {
  isShowEditInfoModal.value = false;

  if (editorID.value) {
    const res = await editProject(editorID.value, { name });
    if (res.data) {
      webEditorName.value = res.data.name;
      toastMessage(t('landing-common-message-saved'));
    }
  } else {
    const res = await createProject(name);
    editorID.value = res.data.id;
    router.push({
      query: {
        id: res.data.id,
      },
    });
    const resEdit = await editProject(editorID.value, { name });
    if (resEdit.data) {
      webEditorName.value = resEdit.data.name;
      toastMessage(t('landing-common-message-saved'));
    }
  }
};

const handleSubmitSettingProject = async (payload: any) => {
  isShowActivitySettingModal.value = false;
  if (!editorID.value) {
    const res = await createProject(webEditorName.value);
    if (res) {
      editorID.value = res.data.id;
      router.push({
        query: {
          id: res.data.id,
        },
      });
      const resEdit = await editProject(editorID.value, payload);
      if (resEdit) {
        project.value = resEdit.data;
        toastMessage(t('landing-common-message-saved'));
      }
    }
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
const ACTION_LIST = {
  SAVE: 'save',
  SHOW_SECTION: 'show-section',
  SWITCH_RWD: 'switch-RWD',
  PREVIEW: 'preview',
};
const listAction = {
  [ACTION_LIST.SAVE]: handleSaveTemplate,
  [ACTION_LIST.SHOW_SECTION]: (keyAction: string) =>
    handleClickSideBar(keyAction),
  [ACTION_LIST.SWITCH_RWD]: (keyAction: string) => SwitchToRWD(keyAction),
  [ACTION_LIST.PREVIEW]: handlePreview,
};
const checkVersionAndUpdate = async ({ keyAction = '' }, type: string = '') => {
  configVersion.value = {
    keyAction,
    type,
  };
  try {
    const isLatestVersion = await checkIsLatestVersion();
    if (!isLatestVersion) {
      isShowModal.confirmReplace = true;
    } else {
      listAction[type]?.(keyAction);
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
  listAction[configVersion.value.type]?.(configVersion.value.keyAction);
};

const handleHiddenAllControl = () => {
  editorRef.value?.hiddenBoxControl();
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
  const isSectionDirty = editorRef.value.checkChanges();
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
