<template>
  <div class="app-container">
    <project-free-trial-warning-modal
      :is-show-modal="
        modalMetric.warningLimitProject || modalMetric.warningLimitCapacity
      "
      @close="
        modalMetric.warningLimitProject = false;
        modalMetric.warningLimitCapacity = false;
      "
    />

    <div class="header">
      <vi-typography type="subtitle-large">{{
        $t('app-navigation-menu-projects')
      }}</vi-typography>
      <vi-button
        :is-loading="isLoadingCreate"
        class="ml-auto"
        icon-before="ic_add"
        @click="onAction(undefined, 'create')"
        :disabled="!PERMISSION.isEditor"
        >{{ $t('landing-project_mgmt-button-create') }}</vi-button
      >
    </div>
    <div class="content custom-content">
      <div class="row">
        <vi-input
          v-model="model.search"
          width="354.667px"
          class="mt-12"
          type="text"
          start-icon="ic_search"
          :placeholder="$t('landing-project_mgmt-placeholder-search')"
          :max="30"
        >
          <template v-if="model.search" #end-icon>
            <vi-icon
              name="ic_close"
              class="btn-clear"
              @click="model.search = ''"
            />
          </template>
        </vi-input>
      </div>
      <div class="type-project">
        <vi-button
          v-for="(item, index) in model.listStatus"
          :key="index"
          width="fit-content"
          :type="
            model.status === item.value
              ? 'standard-primary'
              : 'standard-default'
          "
          @click="model.status = item.value"
          class="btn-status"
          size="small"
        >
          <vi-typography type="subtitle-small">
            {{ item.label }}
          </vi-typography>
        </vi-button>
      </div>
      <div class="list-page">
        <vi-spin
          class="spin"
          height="20px"
          width="20px"
          icon-size="20px"
          :loading="loading.search"
        />
        <div
          class="not-found"
          v-show="
            !loading.search && model.projects.length === 0 && model.firstLoaded
          "
        >
          <img v-if="model.empty" src="/assets/icons/empty-folder.svg" />
          <img v-else src="/assets/icons/searchNotFound.svg" />
          <vi-typography type="subtitle-large">{{
            $t(
              model.empty
                ? 'landing-project_mgmt-description-no_content'
                : 'landing-project_mgmt-description-no_search_results'
            )
          }}</vi-typography>
          <vi-button
            v-if="model.empty"
            :is-loading="isLoadingCreate"
            type="standard-default"
            @click="onAction(undefined, 'create')"
            :disabled="!PERMISSION.isEditor"
          >
            {{ t('landing-project_mgmt-button-create') }}
          </vi-button>
        </div>

        <div
          v-show="!loading.search && model.projects.length > 0"
          class="item"
          v-for="(item, index) in model.projects"
          :key="index"
          @click="onClickProject(item)"
        >
          <div class="item-thumbnail">
            <div
              :class="{ 'blur-container': item.thumbnail }"
              :style="{ backgroundImage: `url(${getImage(item.thumbnail)})` }"
            >
              <div
                :class="{ 'img-wrapper': !!item.thumbnail }"
                :style="{ backgroundImage: `url(${getImage(item.thumbnail)})` }"
              ></div>
              <custom-image
                :src="getImage(item.thumbnail)"
                class="img-content h-fit"
              />
            </div>
          </div>
          <div class="item-info">
            <vi-typography type="caption-large-500" class="status-active">{{
              getStatus(item.status)
            }}</vi-typography>
            <div class="wrapper-title">
              <div>
                <vi-typography type="subtitle-large" class="title-page">{{
                  item.name
                }}</vi-typography>
                <vi-typography type="caption-large-300" class="url-page">
                  {{ item?.eventOfficialUrl }}
                </vi-typography>
              </div>
              <div>
                <vi-typography type="subtitle-large" class="period-time">
                  {{ getPeriodTime(item) }}
                </vi-typography>
                <vi-typography
                  type="caption-large-300"
                  class="long-time text-align-right"
                >
                  {{ getLeftDays(item) }}
                </vi-typography>
              </div>
            </div>
            <div class="wrapper-time-edit">
              <vi-typography type="caption-large-300" class="time-edit">
                {{
                  (item.updatedAt || item.createdAt) &&
                  $t('landing-project_mgmt-description-last_edited', {
                    date: getDates(
                      [item.updatedAt || item.createdAt],
                      '-',
                      'MMMM, DD HH:mm'
                    ),
                  })
                }}
              </vi-typography>
              <div
                class="action-container"
                v-click-outside="() => onShowAction(item.id, false)"
              >
                <div
                  class="action-btn"
                  :class="{
                    'action-btn-active': actionRef[item.id],
                  }"
                  @click.stop="onShowAction(item.id, !actionRef[item.id])"
                >
                  <vi-icon name="ic_more" size="24" color="#fff" />
                </div>
                <div v-if="actionRef[item.id]" class="select-option">
                  <div
                    @click.stop="() => onAction(item, 'edit')"
                    class="action-item"
                    :class="{
                      disabled: !PERMISSION.isEditor,
                    }"
                  >
                    <vi-typography class="cursor-pointer" type="body-large">
                      {{ t('landing-project_mgmt-button-edit') }}
                    </vi-typography>
                  </div>
                  <div
                    @click.stop="() => onAction(item, 'copy')"
                    class="action-item"
                    :class="{
                      disabled: !PERMISSION.isEditor,
                    }"
                  >
                    <vi-typography class="cursor-pointer" type="body-large">
                      {{ $t('landing-project_mgmt-button-copy') }}
                    </vi-typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <popup-edit-project
      v-if="modal.show"
      :show="modal.show"
      :value="model.project?.name"
      @close="modal.close"
      @edit="modal.confirm"
    />
    <Tutorial :tutorial-type="TUTORIAL_TYPE.HOME_PAGE" />
  </div>
  <div class="section-snapshot">
    <editor-section-render
      :read-only="true"
      :section="sections[1]"
      :rwd-mode="RWD_MODE.DESKTOP"
    />
  </div>
  <popup-reach-limit-noti v-model="isOpenReachLimitNoti" />
</template>

<script lang="ts" setup>
import useMetric from '~/composables/metric';
import Tutorial from '@/components/Tutorial/Tutorial.vue';
import useProjects from '~/composables/projects';
import { TUTORIAL_TYPE, RWD_MODE } from '~/constants/common';
import { useProjectStore } from '~/stores/project';
import type { IProject, IUpdateProjectPayload } from '~/types/project';
import { TEMPLATES_SECTION } from '~/types/templates';
import useSnapshotThumbnail from '@/composables/snapshotThumbnail';
import useCheckPermission from '~/composables/checkPermission';

interface Model {
  page: number;
  size: number;
  search: string;
  status: string;
  listStatus: { value: string; label: string }[];
  project?: IProject;
  projects: IProject[];
  empty: boolean;
  firstLoaded: boolean;
}

definePageMeta({
  layout: 'app',
});
const { t } = useI18n();
const webEditorName = ref(t('landing-editor-title-untitled_project'));
const sections = ref([
  ...TEMPLATES_SECTION.slice(0, 2),
  TEMPLATES_SECTION[TEMPLATES_SECTION.length - 1],
]);
const { handleSaveTemplate, setIDWebEditor } = useWebEditor(sections, '');
const { PERMISSION } = useCheckPermission();

const isOpenReachLimitNoti = ref(false);
const { handleGetThumbnailSnapshot } = useSnapshotThumbnail();
const { getStatus, getImage } = useProjects();
const { getProjectList, copyProject, editProject, createProject } =
  useProjectStore();
const { metricInfo, modalMetric, getTenantMetric, handleModal } = useMetric();

const refetchMetric = inject(PROVIDE.FETCH_METRIC) as () => void;

const loading = reactive({
  search: false,
});
const isLoadingCreate = ref(false);
const model = reactive<Model>({
  page: 0,
  size: 150,
  search: '',
  status: 'ALL',
  empty: false,
  firstLoaded: false,
  projects: [],
  listStatus: [
    {
      value: 'ALL',
      label: t('landing-project_mgmt-menu-all'),
    },
    {
      value: 'DRAFT',
      label: t('landing-project_mgmt-menu-draft'),
    },
    {
      value: 'PUBLISHED',
      label: t('landing-project_mgmt-menu-published'),
    },
  ],
});

const modal = reactive({
  show: false,
  title: t('landing-project_mgmt-modal-title_edit_project_info'),
  open: () => {
    modal.show = true;
  },
  confirm: (name: string) => {
    model.search = name;
  },
  close: () => {
    modal.show = false;
  },
});

const actionRef = reactive<{ [key: string]: boolean }>({});

const fetchProjectList = debounce(async () => {
  loading.search = true;
  model.search = model.search.trim();
  const res = await getProjectList({
    page: model.page,
    size: model.size,
    status: model.status,
    nameKeyword: model.search,
  });
  model.projects = res.data || [];
  if (!model.firstLoaded) {
    model.empty = model.projects.length === 0;
  }
  model.firstLoaded = true;
  refetchMetric();
  loading.search = false;
}, 500);

const onShowAction = (projectID: string, show = true) => {
  actionRef[projectID] = show;
};

const onCopyProject = async (project: IProject) => {
  try {
    const newName = `${project.name}_copy`;
    if (newName.length > 50) {
      toastMessage(
        t('error_fe-data-validation-input_length_exceeded'),
        'error'
      );
    } else {
      try {
        await copyProject(project.id, newName);
        fetchProjectList();
        toastMessage(t('landing-common-message-copied'));
      } catch (error: any) {
        const errCode = error?.data?.data?.detail;
        if (errCode === 'LD_CAPACITY_EXCEED_MAXIMUM') {
          isOpenReachLimitNoti.value = true;
        }
      }
    }
  } catch (err) {
    console.log(err, 'err');
  }
};
const onCreateProject = async () => {
  isLoadingCreate.value = true;
  const res = await createProject(webEditorName.value);
  if (res) {
    const { id } = res.data;
    setIDWebEditor(id);
    try {
      handleSaveTemplate();
      const file = await handleGetThumbnailSnapshot();
      const fileUri = file?.fileUri;
      if (fileUri) {
        await editProject(id, { thumbnail: fileUri });
      }
      isLoadingCreate.value = false;
      navigateTo(`/project/editor?id=${id}`);
    } catch (error: any) {
      console.log(error?.data?.data, 'err');
    }
  }
};
const onEditProject = async (payload: IUpdateProjectPayload) => {
  if (model.project) {
    await editProject(model.project.id, payload);
    toastMessage(t('landing-common-message-saved'));
    model.project = undefined;
    fetchProjectList();
    modal.close();
  }
};

const onAction = async (project?: IProject, action = '') => {
  if (!PERMISSION.value.isEditor) {
    return;
  }
  onShowAction(project?.id || '', false);
  switch (action) {
    case 'create':
      await getTenantMetric();
      if (metricInfo.isLimitedProject || metricInfo.isLimitedCapacity) {
        handleModal();
      } else {
        onCreateProject();
      }
      break;
    case 'edit':
      modal.title = t('landing-project_mgmt-modal-title_edit_project_info');
      model.project = project;
      modal.open();
      modal.confirm = (name: string) => {
        onEditProject({
          name,
        });
      };
      break;
    case 'copy':
      if (project) {
        onCopyProject(project);
      }
      break;
    default:
      break;
  }
};

const onClickProject = (item: IProject) => {
  // NOTE: DRAFT is PENDING_PUBLISH, PUBLISHED is other
  if (item.status === 'PENDING_PUBLISH') {
    navigateTo(`/project/editor?id=${item.id}`);
  } else {
    navigateTo(`/project/${item.id}`);
  }
};

const getLeftDays = (item: IProject) => {
  let str = '';

  if (item.status === 'NOT_STARTED') {
    str = t('landing-project_mgmt-description-days_until_start', {
      days: getDaysCount(new Date(), item?.startTime),
    });
  } else if (item.status === 'STARTED') {
    str = t('landing-project_mgmt-description-days_until_end', {
      days: getDaysCount(new Date(), item?.endTime),
    });
  } else {
    str = '';
  }
  return str;
};

const getPeriodTime = (item: IProject) => {
  if (item.status === 'PENDING_PUBLISH') return '';
  return getDates([item?.startTime || '', item?.endTime || '']);
};

onMounted(() => {
  fetchProjectList();
});

watch(
  () => [model.search, model.status],
  () => {
    fetchProjectList();
  }
);
</script>

<style lang="scss" scoped>
.type-project {
  display: flex;
  gap: 12px;
  button {
    border-radius: 1000px;
    text-transform: capitalize;
    padding: 8px 16px;
  }
}
.custom-content {
  display: flex;
  flex-direction: column;
}
.text-align-right {
  text-align: right;
}
.list-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 36px;
  gap: 16px;
  .item {
    padding: 16px 20px 16px 16px;
    border-radius: 8px;
    border: 1px solid $neutral-white-alpha-7;
    background: $neutral-white-alpha-7;
    display: flex;
    width: 100%;
    gap: 16px;
    cursor: pointer;
    .item-thumbnail {
      width: 336px;
      height: 188px;
      display: flex;
      img {
        width: 100%;
        object-fit: contain;
      }
    }
    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      .status-active {
        border-radius: 1000px;
        padding: 4px 8px;
        width: fit-content;
        border: 0.5px solid $neutral-white-alpha-7;
        background: $neutral-white-alpha-7;
      }
      .wrapper-title {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        .title-page,
        .period-time {
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0.25px;
          color: #fff;
        }
        .period-time {
          color: $neutral-white-alpha-60;
        }
        .url-page,
        .long-time {
          margin-top: 4px;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: 0.03px;
          color: $neutral-white-alpha-60;
        }
      }
      .wrapper-time-edit {
        position: relative;
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 11px 0;
        gap: 16px;
        .time-edit {
          color: $neutral-white-alpha-60;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: 0.03px;
        }
      }
    }
  }
  .not-found {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    color: $neutral-white-alpha-60;
    margin: auto;
    img {
      width: 80px;
      height: 80px;
    }
  }
  .spin {
    margin: auto;
  }
}
.action-container {
  position: relative;
}
.action-btn {
  display: flex;
  align-items: center;
  color: $neutral-white-alpha-70;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}
.action-btn:hover,
.action-btn-active {
  background-color: $neutral-white-alpha-15;
}
.select-option {
  position: absolute;
  top: 44px;
  right: 0px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid $neutral-white-alpha-15;
  background-color: $brand-navy-900-main;
  z-index: 20;
  .action-item {
    min-width: 180px;
    padding: 8px 16px;
    cursor: pointer;
    &:hover {
      background-color: $neutral-white-alpha-10;
    }
    &.disabled {
      background-color: $brand-navy-900-main;
      color: $neutral-white-alpha-30;
    }
  }
}

.img-content {
  z-index: 100;
}
.blur-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  width: 100%;
}
.img-wrapper {
  position: absolute;
  inset: 0;
  background-color: lightgray;
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(12px);
  z-index: 0;
}
.img-content {
  position: relative;
  z-index: 1;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
.input-search {
  width: 354.667px;
}
</style>
