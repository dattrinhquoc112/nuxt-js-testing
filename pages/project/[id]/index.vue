<template>
  <vi-spin v-if="loading.detail" icon-size="20px" :loading="loading.detail" />
  <div v-if="!loading.detail" class="app-container">
    <div class="header">
      <vi-breadcrumb :items="breadcrumbItems" separator="/" />
      <div class="button-action">
        <vi-button
          width="65px"
          type="standard-default"
          @click="onAction('copy')"
          >{{ $t('landing-project_mgmt-button-clone_project') }}</vi-button
        >
        <vi-button
          width="65px"
          type="dangerous-default"
          @click="onAction('unpublish')"
          >{{ $t('landing-project_mgmt-button-unpublish') }}</vi-button
        >
      </div>
    </div>
    <div class="content">
      <vi-tabs
        class="tab mt-12 mb-12"
        v-model="tabs.value"
        :items="tabs.items"
      />
      <project-information
        v-if="tabs.value === 'detail'"
        v-model:project="model.project"
      />
      <project-analysis
        v-if="tabs.value === 'analysis'"
        v-model:project="model.project"
      />
    </div>
    <vi-modal
      :modal-title="modal.title"
      :is-show="modal.isShow"
      @close="modal.close"
    >
      <vi-typography class="description" type="body-small">{{
        modal.description
      }}</vi-typography>
      <template #footer>
        <div class="modal-footer">
          <vi-button
            class="ml-auto"
            type-button="button"
            @click="modal.close"
            type="primary-default"
            width="fit-content"
            >{{ $t('common-action-button-button_close') }}</vi-button
          >
          <vi-button
            type-button="button"
            @click="modal.confirm"
            type="dangerous-primary"
            width="fit-content"
            >{{ $t('landing-project_mgmt-button-unpublish') }}</vi-button
          >
        </div>
      </template>
    </vi-modal>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project';
import type { IProject } from '~/types/project';

interface Model {
  project?: IProject;
}

definePageMeta({
  layout: 'app',
});

const route = useRoute();
const id = route.params.id as string;

const { t } = useI18n();

const { getProject, copyProject, unpublishProject } = useProjectStore();

const loading = reactive({
  detail: false,
});

const tabs = reactive({
  value: 'detail',
  items: [
    {
      name: 'detail',
      label: t('landing-navigation-menu-event_info'),
      disabled: false,
    },
    {
      name: 'analysis',
      label: t('landing-navigation-menu-event_analytics'),
      disabled: false,
    },
  ],
});

const model = reactive<Model>({});

const modal = reactive({
  isShow: false,
  title: '',
  description: '',
  open: () => {
    modal.isShow = true;
  },
  close: () => {
    modal.isShow = false;
  },
  confirm: () => {},
});

const breadcrumbItems = computed(() => [
  {
    text: t('app-navigation-menu-projects'),
    link: '/project',
  },
  { text: model.project?.name, link: '' },
]);

const onCopy = async () => {
  if (!model.project) return;
  try {
    await copyProject(model.project.id, `${model.project.name} Copy`);
    toastMessage(t('landing-common-message-copied'));
  } catch (error) {
    toastMessage(t('landing-common-message-copied-error'));
  }
};

const onUnpublish = async () => {
  if (!model.project) return;
  try {
    await unpublishProject(model.project.id);
    toastMessage(t('landing-common-message-unpublished'));
  } catch (error) {
    toastMessage(t('landing-common-message-unpublished-error'));
  }
  modal.close();
};

const onAction = (action: string) => {
  switch (action) {
    case 'copy':
      onCopy();
      break;
    case 'unpublish':
      modal.title = t('landing-project_mgmt-modal-title_unpublish_event');
      modal.description = t('landing-project_mgmt-modal-unpublish_description');
      modal.open();
      modal.confirm = onUnpublish;
      break;
    default:
      break;
  }
};

const fetchProject = async () => {
  loading.detail = true;
  const res = await getProject(id);
  model.project = res.data;
  loading.detail = false;
};

onMounted(() => {
  fetchProject();
});
</script>

<style lang="scss" scoped>
.button-action {
  display: flex;
  margin-left: auto;
  gap: 16px;
}
.fit {
  width: fit-content;
}
.mw-360 {
  max-width: 360px;
}
.br-1000 {
  border-radius: 1000px !important;
}
.description {
  color: $neutral-white-alpha-80 !important;
  word-break: break-all;
}
.browser-btn {
  margin-left: auto;
}
.content-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: stretch;
  .content-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: start;

    img {
      height: 200px;
      align-self: stretch;
      aspect-ratio: 9/5;
      border-radius: 4px;
      border: 0.5px solid $neutral-white-alpha-7;
    }

    .child-item {
      border-radius: 4px;
      border: 1px solid $neutral-white-alpha-10;
      display: flex;
      padding: 16px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 8px;
      align-self: stretch;

      img {
        height: 167px;
        align-self: stretch;
        border-radius: 4px;
      }
    }
  }
  :deep(.divider-wrap) {
    height: unset !important;
  }
}
.modal-footer {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
</style>
