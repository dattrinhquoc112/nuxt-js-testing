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
    @handle-release="handleCheckConditionPublish"
    @handle-store-changes="checkVersionAndUpdate({}, ACTION_LIST.SAVE)"
    @click-sidebar="
      (keyAction) =>
        checkVersionAndUpdate({ keyAction }, ACTION_LIST.SHOW_SECTION)
    "
    @handle-back="handleBack"
    @handle-activity-settings="isShowActivitySettingModal = true"
    @handle-edit-info="isShowEditInfoModal = true"
    :project-name="webEditorName"
  >
    <vi-alert
      v-if="isOpenAlert"
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
    <vi-scroll
      id="editor_content"
      class="editor__content"
      :class="{ 'editor__content--mobile': RWDMode === RWD_MODE.MOBILE }"
    >
      <editor
        ref="editorRef"
        :limit-file-size="limitFileSize"
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
  <popup-reach-limit-noti v-model="isOpenReachLimitNoti" />
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { TEMPLATES_SECTION, TEMPLATES_AUDIO } from '@/types/templates';
import { ROUTE } from '@/constants/route';
import { SIDE_BAR_ACTION, RWD_MODE, METRICS_KEY } from '@/constants/common';
import { useProjectStore } from '@/stores/project';
import { toastMessage } from '#imports';
import { useEditorStore } from '~/stores/editor';
import { WEB_EDITOR_PREVIEW } from '~/constants/storage';
import useSnapshotThumbnail from '@/composables/snapshotThumbnail';
import useMetric from '@/composables/metric';
import useMaterials from '~/composables/materials';

const SIDEBAR_BUTTONS = ['ic_section', 'ic_ai_section', 'ic_capacity'];
const activeSidebarButton = ref();
const isOpenReachLimitNoti = ref(false);
provide('activeSidebarButton', activeSidebarButton);
const { tenantMetric, getTenantMetric } = useMetric();
const isOpenAlert = ref(false);
const materialList = ref();
const editorID = ref('');
const { isExceedLimit, isExceed75PercentLimit } = useMaterials({
  listMaterial: materialList,
  editorID,
});

const { getProject, editProject, publishProject } = useProjectStore();

const { handleGetThumbnailSnapshot } = useSnapshotThumbnail();
definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);
const isOpenReminderPU = ref(false);
const errCode = reactive({
  eventEnglishName: '',
});
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
  loading: any = 'updateContent'
) => {
  setLoading(loading, true);
  await editorRef.value.handleSaveTemplate();
  const file = await handleGetThumbnailSnapshot();
  const fileUri = file?.fileUri;
  if (fileUri) {
    await editProject(editorID.value, { thumbnail: fileUri });
  }
  setLoading(loading, false);
  isShowModal.confirmReplace = false;
  toastMessage(messageSuccess || t('landing-editor-message-version_saved'));
};

const handleCheckConditionPublish = async () => {
  errCode.eventEnglishName = '';
  const isFinishSetupEvent =
    project.value?.metaTitle &&
    project.value?.ogTitle &&
    project.value?.eventEnglishName &&
    project.value.startTime &&
    project.value.endTime;
  const isFinishedSetupAudio = true;
  if (isExceedLimit.value) {
    isOpenReachLimitNoti.value = true;
  } else if (
    !!isFinishSetupEvent &&
    !!isFinishedSetupAudio &&
    !isExceedLimit.value
  ) {
    try {
      await handleSaveTemplate(
        t('landing-editor-message-progress_saved'),
        'publish'
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
  } else {
    isOpenReminderPU.value = true;
  }
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
  toastMessage(t('landing-editor-message-version_updated'));
  listAction[configVersion.value.type]?.(configVersion.value.keyAction);
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

const handleSaveDraft = async () => {
  isShowModal.confirmSave = false;
  await handleSaveTemplate(t('landing-editor-message-progress_saved'));
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
const limitFileSize = computed(() => {
  const limitFileSizeRes = tenantMetric.value?.metrics.find(
    (item) => item.metric === METRICS_KEY.TOTAL_CAPACITY
  );
  if (limitFileSizeRes) {
    const totalCapacity = `${limitFileSizeRes.value}${limitFileSizeRes.unit} `;
    return convertToKB(totalCapacity);
  }
  return 0;
});
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
  getTenantMetric();
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
    height: calc(100vh - 64px);
    &--mobile {
      width: fit-content;
    }
  }
}
</style>
