<template>
  <LayoutEditor
    :rwd-mode="'MOBILE'"
    @handle-undo="handleUndo"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handle-switcher-layout="handleEvent"
    @handle-play="handleEvent"
    @handle-release="handleCheckCOnditionPublish"
    @click-sidebar="handleClickSideBar"
    @handle-back="handleBack"
    @handle-activity-settings="isShowActivitySettingModal = true"
    @handle-edit-info="isShowEditInfoModal = true"
    @handle-switch-layout="() => {}"
    @hanlde-store-changes="() => {}"
    :project-name="webEditorName"
    @handle-store-changes="handleSaveTemplate"
    @scroll-editor="handleHiddenAllControl"
  >
    <editor
      ref="editorRef"
      :list-template="listTemplateCurrent"
      :is-show-list-section="isShowListSection"
      @close-section="isShowListSection = false"
    />
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

  <vi-modal
    modal-title="離開前是否儲存目前編輯"
    :is-show="isShowModal"
    @close="isShowModal = false"
    size="small"
  >
    <vi-typography type="body-small" class="editor-leave__title">
      離開將遺失目前進度，是否儲存編輯？
    </vi-typography>
    <template #footer>
      <div class="editor-leave__footer">
        <vi-button
          type="standard-default"
          width="fit-content"
          @click="handleLeave"
        >
          不儲存直接離開
        </vi-button>
        <vi-button
          type="standard-primary"
          width="fit-content"
          @click="handleSaveDraft"
        >
          儲存進度
        </vi-button>
      </div>
    </template>
  </vi-modal>
  <EditorReminderPU
    v-model:model="isOpenReminderPU"
    @handle-click="
      () => {
        isOpenReminderPU = false;
        isShowActivitySettingModal = true;
      }
    "
  />
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { ROUTE } from '@/constants/route';
import { DEFAULT_WEB_EDITOR_NAME } from '@/constants/common';
import { useProjectStore } from '@/stores/project';
import { toastMessage } from '#imports';
import { TEMPLATES_AUDIO, TEMPLATES_SECTION } from '~/types/templates';

const { getProject, editProject, createProject, publishProject } =
  useProjectStore();
definePageMeta({
  layout: 'editor',
});

const isOpenReminderPU = ref(false);
const isShowListSection = ref(false);
const historyStatus = ref();
const isShowModal = ref(false);
const editorRef = ref();
const listTemplateCurrent = ref<any[]>(TEMPLATES_SECTION);
const handleEvent = () => {};
const isShowEditInfoModal = ref(false);
const isShowActivitySettingModal = ref(false);
const route = useRoute();
const editorID = ref('');
const webEditorName = ref(DEFAULT_WEB_EDITOR_NAME);
const project = ref();
const { t } = useI18n();
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
    console.log(res, 'res nek');
  } else {
    console.log(isFinishSetupEvent);
    isOpenReminderPU.value = true;
  }
  return !!isFinishSetupEvent && !!isFinishedSetupAudio;
};

const handleEditEditor = async (name: string) => {
  if (editorID.value) {
    const res = await editProject(editorID.value, { name });
    webEditorName.value = res.data.name;
    toastMessage(t('landing-common-message-saved'));
    isShowEditInfoModal.value = false;
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

const handleSaveTemplate = () => {
  editorRef.value.handleSaveTemplate();
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

const handleHiddenAllControl = () => {
  editorRef.value?.hiddenBoxControl();
};

const handleLeave = () => {
  isShowModal.value = false;
  navigateTo(ROUTE.PROJECT_LIST);
};

const handleSaveDraft = () => {
  // TODO: implement save draft logic
  isShowModal.value = false;
  navigateTo(ROUTE.PROJECT_LIST);
};
const handleBack = () => {
  const isSectionDirty = editorRef.value?.isSectionDirty();
  if (isSectionDirty) {
    navigateTo(ROUTE.PROJECT_LIST);
  } else {
    isShowModal.value = true;
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
</style>
