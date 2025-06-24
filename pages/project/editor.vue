<template>
  <LayoutEditor
    :rwd-mode="RWDMode"
    :isShowListSection="isShowListSection"
    @handle-undo="handleUndo"
    :history-status="historyStatus"
    :disableUndoRedo
    @handle-redo="handleRedo"
    @handle-switch-layout="
      (keyAction) => {
        checkVersionAndUpdate({ keyAction }, ACTION_LIST.SWITCH_RWD);
      }
    "
    @handle-play="checkVersionAndUpdate({}, ACTION_LIST.PREVIEW)"
    @handle-release="handlePublish"
    @handle-store-changes="handleSaveChanges"
    @click-sidebar="
      (keyAction) =>
        checkVersionAndUpdate({ keyAction }, ACTION_LIST.SHOW_SECTION)
    "
    @handle-back="handleBack"
    @handle-activity-settings="isShowActivitySettingModal = true"
    @handle-edit-info="isShowEditInfoModal = true"
    :project-name="webEditorName"
  >
    <div v-if="isOpenAlert" class="alert">
      <vi-alert
        v-model="isOpenAlert"
        :text-title="$t('landing-common-message-storage_near_limit')"
        :text-content="
          $t('landing-common-message-storage_warning', { percent: '75' })
        "
        @handle-content-click="
          () => {
            isOpenAlert = false;
            activeSidebarButton = SIDEBAR_BUTTONS[2];
          }
        "
      >
        <vi-icon name="ic_alert" size="24" color="#fff" />
      </vi-alert>
    </div>
    <vi-scroll
      id="editor_content"
      class="editor__content"
      :class="{
        'editor__content--mobile': RWDMode === RWD_MODE.MOBILE,
      }"
      :style="`height: calc(100vh - 64px - ${isOpenAlert ? 70 : 0}px);`"
    >
      <editor
        ref="editorRef"
        :limit-file-size="totalCapacity"
        :current-file-size="totalCapacityUsedRef"
        :rwd-mode="RWDMode"
        :is-exceed-limit="isExceedLimit"
        :is-exceed-75-percent-limit="isExceed75PercentLimit"
        :list-template="listTemplateCurrent"
        :is-show-list-section="isShowListSection"
        @close-section="isShowListSection = ''"
        @handle-upload-exceed-limit="isOpenAlert = true"
        @handle-exceed-percent-limit="handleExceedPercentLimit"
        @handleExceedLimit="handleExceedLimit"
      />
      <div class="section-snapshot">
        <editor-section-render
          :read-only="true"
          :section="sectionSnapshot"
          :rwd-mode="RWD_MODE.DESKTOP"
        />
      </div>
    </vi-scroll>
  </LayoutEditor>
  <popup-setting-project
    v-if="isShowActivitySettingModal"
    :show="isShowActivitySettingModal"
    v-model:project="project"
    @close="isShowActivitySettingModal = false"
    :errCode="errCode"
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
  <EditorReminderPU
    v-model:model="isOpenSettingAudioPU"
    @handle-click="handleScrollToSettingAudio"
  />

  <editor-popup-confirm-save
    :is-show="isShowModal.confirmSave"
    @close="isShowModal.confirmSave = false"
    @handle-leave="handleLeave"
    @handle-save-draft="checkVersionAndUpdate({}, ACTION_LIST.BACK)"
  />
  <editor-popup-confirm-replace-content
    :is-show="isShowModal.confirmReplace"
    @close="isShowModal.confirmReplace = false"
    @handle-save-current="handleSaveCurrentTemplate"
    @handle-update-new="handleUpdateToNewVersion"
  />
  <popup-reach-limit-noti v-model="isOpenReachLimitNoti" />
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { TEMPLATES_SECTION } from '@/types/templates';
import { WEB_EDITOR_PREVIEW } from '@/constants/storage';
import { ROUTE } from '@/constants/route';
import { SIDE_BAR_ACTION, RWD_MODE } from '@/constants/common';
import { useProjectStore } from '@/stores/project';
import { toastMessage } from '#imports';
import { useEditorStore } from '~/stores/editor';
import useSnapshotThumbnail from '@/composables/snapshotThumbnail';
import useMaterials from '~/composables/materials';

const disableUndoRedo = ref(false);
const SIDEBAR_BUTTONS = ['ic_section', 'ic_ai_section', 'ic_capacity'];
const activeSidebarButton = ref();
const isOpenReachLimitNoti = ref(false);
provide('activeSidebarButton', activeSidebarButton);
const isOpenAlert = ref(false);
const materialList = ref();
const editorID = ref('');
const {
  isExceedLimit,
  isExceed75PercentLimit,
  totalCapacity,
  totalCapacityUsed,
} = useMaterials({
  listMaterial: materialList,
  editorID,
});
const totalCapacityUsedRef = computed(() => {
  return totalCapacityUsed.value;
});
const { getProject, editProject, publishProject } = useProjectStore();

const { handleGetThumbnailSnapshot } = useSnapshotThumbnail();
definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);
const isOpenReminderPU = ref(false);
const isOpenSettingAudioPU = ref(false);
const errCode = reactive({
  eventEnglishName: '',
});

const editorStore = useEditorStore();

const { checkIsLatestVersion } = useProjectStore();
const { t } = useI18n();
const isShowListSection = ref('');
const historyStatus = ref();
const isShowModal = reactive({
  confirmSave: false,
  confirmReplace: false,
});
const editorRef = ref();
let scrollTopEditor = 0;
const listTemplateCurrent = ref<any[]>(TEMPLATES_SECTION);
const isShowEditInfoModal = ref(false);
const isShowActivitySettingModal = ref(false);

const route = useRoute();

const webEditorName = ref(t('landing-editor-title-untitled_project'));
const project = ref();

watch(
  () => editorRef.value?.listMaterials,
  (newVal) => {
    if (newVal) {
      materialList.value = newVal;
    }
  },
  { immediate: true }
);
provide('materialList', materialList);
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
const handleExceedLimit = () => {
  isOpenReachLimitNoti.value = true;
  activeSidebarButton.value = '';
  isOpenAlert.value = true;
};
const handleExceedPercentLimit = () => {
  isOpenAlert.value = true;
  activeSidebarButton.value = '';
};
const sectionSnapshot = computed(() => {
  return editorRef.value?.sections[1];
});
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
    } else {
      navigateTo(ROUTE.PROJECT_LIST);
    }
  },
  {
    immediate: true,
  }
);
const handleSaveTemplate = async (
  messageSuccess: string = '',
  loading: any = 'updateContent',
  showToast = true
) => {
  try {
    editorStore.setLoading(loading, true);
    disableUndoRedo.value = true;
    await editorRef.value.handleSaveTemplate();
    const file = await handleGetThumbnailSnapshot();
    const fileUri = file?.fileUri;
    if (fileUri) {
      await editProject(editorID.value, { thumbnail: fileUri });
    }
    await editorRef.value.handleChangeHistoryWhenSaveTemplate();
    disableUndoRedo.value = false;
  } catch (error) {
  } finally {
    editorStore.setLoading(loading, false);
    showToast &&
      toastMessage(messageSuccess || t('landing-editor-message-version_saved'));
  }
};
const handleSaveChanges = async () => {
  const isLatestVersion = await checkIsLatestVersion();
  if (!isLatestVersion) {
    isShowModal.confirmReplace = true;
  } else {
    await handleSaveTemplate();
  }
};
const handlePublish = async () => {
  const isLatestVersion = await checkIsLatestVersion();
  if (!isLatestVersion) {
    isShowModal.confirmReplace = true;
  } else {
    errCode.eventEnglishName = '';
    const isFinishSetupEvent =
      project.value?.metaTitle &&
      project.value?.ogTitle &&
      project.value?.eventEnglishName &&
      project.value.startTime &&
      project.value.endTime;
    const isFinishedSetupAudio = editorRef.value.checkIsFinishedSetupAudio();

    if (
      !!isFinishSetupEvent &&
      !!isFinishedSetupAudio &&
      !isExceedLimit.value
    ) {
      try {
        await handleSaveTemplate(
          t('landing-editor-message-progress_saved'),
          'publish',
          false
        );
        await publishProject(editorID.value);
        toastMessage(t('landing-project_mgmt-menu-published'));
        navigateTo(ROUTE.PROJECT_LIST);
      } catch (error: any) {
        errCode.eventEnglishName = error?.data?.data?.detail;
        if (
          errCode.eventEnglishName &&
          errCode.eventEnglishName === 'LD_PROJECT_URL_DUPLICATED'
        ) {
          errCode.eventEnglishName = t(
            'landing-error-action-project_duplicate_name'
          );
          isOpenReminderPU.value = true;
        }
      }
    } else if (isExceedLimit.value) {
      isOpenReachLimitNoti.value = true;
    } else if (!isFinishSetupEvent) {
      isOpenReminderPU.value = true;
    } else if (!isFinishedSetupAudio) {
      isOpenSettingAudioPU.value = true;
    }
  }
};

const handleScrollToSettingAudio = () => {
  isOpenSettingAudioPU.value = false;
  editorRef.value?.scrollToSetupAudio();
};

const handleEditEditor = async (name: string) => {
  isShowEditInfoModal.value = false;

  if (editorID.value) {
    const res = await editProject(editorID.value, { name });
    if (res.data) {
      webEditorName.value = res.data.name;
      toastMessage(t('landing-common-message-saved'));
    }
  }
};

const handleSaveDraft = async () => {
  isShowModal.confirmSave = false;
  await handleSaveTemplate(t('landing-editor-message-progress_saved'));
  navigateTo(ROUTE.PROJECT_LIST);
};

const ACTION_LIST = {
  SAVE: 'save',
  SHOW_SECTION: 'show-section',
  SWITCH_RWD: 'switch-RWD',
  PREVIEW: 'preview',
  BACK: 'back',
};
const listAction = {
  [ACTION_LIST.SWITCH_RWD]: (keyAction: string) => SwitchToRWD(keyAction),
  [ACTION_LIST.PREVIEW]: handlePreview,
  [ACTION_LIST.BACK]: handleSaveDraft,
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
      const isInSideBarAction =
        Object.values(SIDE_BAR_ACTION).includes(keyAction);
      editorStore.setActiveSideBar(isInSideBarAction ? keyAction : '');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
const handleBeforeAction = async () => {
  await listAction[configVersion.value.type]?.(configVersion.value.keyAction);
  const isInSideBarAction = Object.values(SIDE_BAR_ACTION).includes(
    configVersion.value.keyAction
  );
  editorStore.setActiveSideBar(
    isInSideBarAction ? configVersion.value.keyAction : ''
  );
};

const handleSaveCurrentTemplate = async () => {
  await handleSaveTemplate();
  await handleBeforeAction();
  isShowModal.confirmReplace = false;
};

const handleUpdateToNewVersion = async () => {
  editorStore.setLoading('updateContent', true);
  await editorRef.value.fetchContentProject();
  editorStore.setLoading('updateContent', false);
  toastMessage(t('landing-editor-message-version_updated'));
  await handleBeforeAction();
  isShowModal.confirmReplace = false;
};

const editorContentElement = computed(() =>
  document.querySelector('#editor_content')
);

const calcPositionControl = () => {
  if (editorContentElement.value?.scrollTop === undefined) return;
  editorRef.value?.calcPositionControl(
    editorContentElement.value.scrollTop - scrollTopEditor
  );
  scrollTopEditor = editorContentElement.value.scrollTop;
};

const handleLeave = () => {
  navigateTo(ROUTE.PROJECT_LIST);
  isShowModal.confirmSave = false;
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

watch(
  () => isExceed75PercentLimit.value,
  (newVal) => {
    if (newVal) {
      isOpenAlert.value = true;
    } else {
      isOpenAlert.value = false;
    }
  }
);

onMounted(async () => {
  if (!editorContentElement.value) return;
  scrollTopEditor = editorContentElement.value.scrollTop;
  editorContentElement.value.addEventListener('scroll', calcPositionControl);
});

onUnmounted(() => {
  if (!editorContentElement.value) return;
  editorContentElement.value.removeEventListener('scroll', calcPositionControl);
});

watch(
  () => isShowActivitySettingModal.value,
  () => {
    if (isShowActivitySettingModal.value === false) {
      errCode.eventEnglishName = '';
    }
  }
);
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
    // overflow: hidden;
    &--mobile {
      width: fit-content;
    }
  }
}
.alert {
  position: relative;
  z-index: 50;
  background-color: $neutral-black-alpha-100;
}
</style>
