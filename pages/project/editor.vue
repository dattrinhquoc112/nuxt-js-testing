<template>
  <LayoutEditor
    @handle-undo="handleUndo"
    :rwd-mode="RWDMode"
    :history-status="historyStatus"
    @handle-redo="handleRedo"
    @handleSwitchLayout="(e) => SwitchToRWD(e)"
    @handle-play="handlePreview"
    @handle-store-changes="handleSaveTemplate"
    @handle-release="handleEvent"
    @click-sidebar="handleClickSideBar"
    @handle-back="handleBack"
    @scroll-editor="handleHiddenAllControl"
    @handle-activity-settings="isShowActivitySettingModal = true"
    @handle-edit-info="isShowEditInfoModal = true"
    @handle-switch-layout="() => {}"
    @hanlde-store-changes="() => {}"
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
        @close-section="isShowListSection = false"
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
    :value="projectName"
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
</template>

<script setup lang="ts">
import LayoutEditor from '@/components/Editor/LayoutEditor/LayoutEditor.vue';
import { TEMPLATES_SECTION, TEMPLATES_AUDIO } from '@/types/templates';
import { RWD_MODE } from '~/constants/common';
import { WEB_EDITOR_PREVIEW } from '@/constants/storage';
import { ROUTE } from '@/constants/route';
import { DEFAULT_WEB_EDITOR_NAME } from '@/constants/common';
import { useProjectStore } from '@/stores/project';
import { toastMessage } from '#imports';

const { getProject, editProject, createProject } = useProjectStore();
definePageMeta({
  layout: 'editor',
});
const RWDMode = ref(RWD_MODE.DESKTOP);
const isShowListSection = ref(false);
const historyStatus = ref();
const isShowModal = ref(false);
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

const handleSaveTemplate = () => {
  editorRef.value.handleSaveTemplate();
};

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

const handleEditEditor = async (name: string) => {
  if (editorID.value) {
    await editProject(editorID.value, { name });
    toastMessage(t('landing-common-message-saved'));
    isShowEditInfoModal.value = false;
  } else {
    webEditorName.value = name;
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

const SwitchToRWD = (e: any) => {
  RWDMode.value = e;
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
