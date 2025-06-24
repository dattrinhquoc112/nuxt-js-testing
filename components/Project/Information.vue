<template>
  <div class="information-container">
    <div class="information-iitem mw-360">
      <custom-image :src="getImage(project?.thumbnail)" />
      <vi-button
        class="btn-status"
        type="standard-default"
        width="fit-content"
        size="small"
      >
        <vi-typography type="caption-large-500">{{
          getStatus(props.project?.status || '')
        }}</vi-typography>
      </vi-button>
      <vi-typography type="headline-xs">{{ project?.name }}</vi-typography>
      <vi-typography class="description" type="body-small">{{
        project?.startTime &&
        project?.endTime &&
        $t('landing-project_mgmt-description-event_period', {
          date1: getDates([project?.startTime || '']),
          date2: getDates([project?.endTime || '']),
        })
      }}</vi-typography>
      <div class="child-item">
        <vi-typography class="description" type="body-small">
          {{ project?.eventOfficialUrl }}
        </vi-typography>
        <vi-button
          class="browser-btn"
          type="standard-subtle"
          @click="openLink(project?.eventOfficialUrl)"
        >
          <vi-typography class="browser-text" type="subtitle-small">
            {{ $t('landing-project_mgmt-button-view_website') }}
            <vi-icon name="ic_arrow_up_right" size="16" />
          </vi-typography>
        </vi-button>
      </div>
      <vi-button
        type="standard-default"
        width="fit-content"
        @click="modal.open"
        size="small"
        :disabled="!PERMISSION.isEditor"
      >
        <vi-typography type="subtitle-small">{{
          $t('landing-project_mgmt-button-edit_info')
        }}</vi-typography>
      </vi-button>
    </div>
    <vi-divider direction="vertical" />
    <div class="information-iitem">
      <vi-typography type="subtitle-large">{{
        $t('landing-project_mgmt-title-meta_section_title')
      }}</vi-typography>
      <div class="child-item">
        <vi-typography type="headline-xs">{{
          project?.metaTitle
        }}</vi-typography>
        <vi-typography class="description" type="body-small">{{
          project?.metaDescription
        }}</vi-typography>
        <vi-typography class="description" type="body-small">{{
          project?.metaKeyword
        }}</vi-typography>
      </div>
      <vi-typography type="subtitle-large">{{
        $t('landing-project_mgmt-title-og_section_title')
      }}</vi-typography>
      <div class="child-item fit">
        <custom-image :src="getImage(props.project?.ogImageUri)" />
        <vi-typography type="headline-xs">{{ project?.ogTitle }}</vi-typography>
        <vi-typography class="description" type="body-small">{{
          project?.ogDescription
        }}</vi-typography>
      </div>
    </div>
  </div>
  <popup-edit-project
    v-if="modal.show"
    :show="modal.show"
    :value="project?.name"
    @close="modal.close"
    @edit="modal.confirm"
  />
</template>
<script setup lang="ts">
import useCheckPermission from '~/composables/checkPermission';
import useProjects from '~/composables/projects';
import { useProjectStore } from '~/stores/project';
import type { IProject } from '~/types/project';

const props = defineProps({
  project: {
    type: Object as PropType<IProject>,
    default: undefined,
  },
});

const emit = defineEmits<{
  (e: 'update:project', value: IProject): void;
}>();

const { t } = useI18n();

const { getStatus } = useProjects();
const { editProject } = useProjectStore();
const { PERMISSION } = useCheckPermission();

const modal = reactive({
  show: false,
  title: t('landing-project_mgmt-modal-title_edit_project_info'),
  open: () => {
    modal.show = true;
  },
  confirm: (name: string) => onEditProject(name),
  close: () => {
    modal.show = false;
  },
});

async function onEditProject(name: string) {
  if (props.project?.id && PERMISSION.value.isEditor) {
    await editProject(props.project?.id, { name });
    toastMessage(t('landing-common-message-saved'));
    emit('update:project', {
      ...props.project,
      name,
    } as IProject);
  }
  modal.close();
}
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
.btn-status {
  border-radius: 1000px !important;
  padding: 4px 8px !important;
  min-height: unset !important;
}
.description {
  color: $neutral-white-alpha-80 !important;
  word-break: break-all;
}
.browser-btn {
  margin-left: auto;
  .browser-text {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
.information-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: stretch;
  .information-iitem {
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
