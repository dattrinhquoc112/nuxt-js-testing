<template>
  <div class="app-container">
    <div class="header">
      <vi-typography type="subtitle-large">{{
        $t('app-navigation-menu-projects')
      }}</vi-typography>
      <vi-button
        class="ml-auto"
        icon-before="ic_add"
        @click="onAction(undefined, 'create')"
        >{{ $t('landing-project_mgmt-button-create') }}</vi-button
      >
    </div>
    <div class="content custom-content">
      <div class="row">
        <div class="col col-3">
          <vi-input
            v-model="model.search"
            width="100%"
            class="mt-12"
            type="text"
            start-icon="ic_search"
            :placeholder="$t('landing-project_mgmt-placeholder-search')"
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
        >
          {{ item.label }}
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
          v-show="!loading.search && listPage.length === 0"
        >
          <img src="/assets/icons/searchNotFound.svg" />
          <vi-typography type="subtitle-large"
            >目前沒有內容， 快來創作你的 AI 聲音！</vi-typography
          >
        </div>
        <div
          v-show="!loading.search && listPage.length > 0"
          class="item"
          v-for="(item, index) in listPage"
          :key="index"
          @click="onOpenDetail(item)"
        >
          <div class="item-thumbnail">
            <custom-image :src="getImage(item.thumbnail)" />
          </div>
          <div class="item-info">
            <div class="status-active">{{ getStatus(item.status) }}</div>
            <div class="wrapper-title">
              <div>
                <div class="title-page">{{ item.name }}</div>
                <div class="url-page">
                  {{ getProjectUrl(item) }}
                </div>
              </div>
              <div>
                <div class="period-time">
                  {{ getDates([item?.startTime || '', item?.endTime || '']) }}
                </div>
                <div class="long-time">
                  {{
                    item.startTime &&
                    $t('landing-project_mgmt-description-days_until_start', {
                      days: getDaysCount(item.startTime, new Date()),
                    })
                  }}
                </div>
              </div>
            </div>
            <div class="wrapper-time-edit">
              <div class="time-edit">
                {{
                  item.updatedAt &&
                  $t('landing-project_mgmt-description-last_edited', {
                    date: getDates([item.updatedAt]),
                  })
                }}
              </div>
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
                  >
                    <vi-typography class="cursor-pointer" type="body-large">
                      {{ t('landing-project_mgmt-button-edit') }}
                    </vi-typography>
                  </div>
                  <div
                    @click.stop="() => onAction(item, 'copy')"
                    class="action-item"
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
      :title="modal.title"
      :value="model.project?.name"
      @close="modal.close"
      @edit="modal.confirm"
    />
  </div>
</template>

<script lang="ts" setup>
import useProjects from '~/composables/projects';
import { useProjectStore } from '~/stores/project';
import type { IProject, IUpdateProjectPayload } from '~/types/project';

interface Model {
  page: number;
  size: number;
  search: string;
  status: string;
  listStatus: { value: string; label: string }[];
  project?: IProject;
}

definePageMeta({
  layout: 'app',
});

const { t } = useI18n();

const { getProjectUrl, getStatus, getImage } = useProjects();
const { getProjectList, copyProject, editProject, createProject } =
  useProjectStore();

const loading = reactive({
  search: false,
});

const model = reactive<Model>({
  page: 0,
  size: 150,
  search: '',
  status: 'ALL',
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

const listPage = ref<IProject[]>([]);
const actionRef = reactive<{ [key: string]: boolean }>({});

const fetchProjectList = debounce(async () => {
  loading.search = true;
  const res = await getProjectList({
    page: model.page,
    size: model.size,
    status: model.status,
    nameKeyword: model.search.trim(),
  });
  listPage.value = res.data;
  loading.search = false;
}, 500);

const onShowAction = (projectID: string, show = true) => {
  actionRef[projectID] = show;
};

const onCopyProject = async (project: IProject) => {
  await copyProject(project.id, `${project.name} Copy`);
  fetchProjectList();
  toastMessage(t('landing-common-message-copied'));
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

const onCreateProject = async (name: string) => {
  await createProject(name);
  toastMessage(t('landing-common-message-saved'));
  fetchProjectList();
  modal.close();
};

const onAction = (project?: IProject, action = '') => {
  switch (action) {
    case 'create':
      modal.title = t('landing-project_mgmt-button-create');
      model.project = undefined;
      modal.confirm = (name: string) => {
        onCreateProject(name);
      };
      modal.open();
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
  if (project) {
    onShowAction(project.id, false);
  }
};

const onOpenDetail = (item: IProject) => {
  navigateTo(`/project/${item.id}`);
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
  }
}
.custom-content {
  display: flex;
  flex-direction: column;
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
  }
}
</style>
