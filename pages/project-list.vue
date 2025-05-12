<template>
  <div class="app-container">
    <div class="header">
      <vi-typography type="subtitle-large">{{
        $t('project_list')
      }}</vi-typography>
      <vi-button class="ml-auto" icon-before="ic_add">{{
        $t('create_web_application')
      }}</vi-button>
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
            :placeholder="$t('search_project')"
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
          v-for="(item, index) in model.modes"
          :key="index"
          width="fit-content"
          :type="model.mode === item ? 'standard-primary' : 'standard-default'"
          @click="model.mode = item"
        >
          {{ item }}
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
        >
          <div class="item-thumbnail">
            <img :src="item.thumbnail" alt="" />
          </div>
          <div class="item-info">
            <div class="status-active">{{ item.statusActive }}</div>
            <div class="wrapper-title">
              <div>
                <div class="title-page">{{ item.titlePage }}</div>
                <div class="url-page">
                  {{ item.urlPage }}
                </div>
              </div>
              <div>
                <div class="period-time">{{ item.periodTime }}</div>
                <div class="long-time">
                  {{ $t('days_left_start', { day: item.leftDays }) }}
                </div>
              </div>
            </div>
            <div class="wrapper-time-edit">
              <div class="time-edit">{{ item.editedAt }}</div>
              <vi-icon name="ic_more" size="24" color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProjectStore } from '~/stores/project';
import type { IProject } from '~/types/project';

definePageMeta({
  layout: 'app',
});

const { getProjectList } = useProjectStore();

const loading = reactive({
  search: false,
});

const model = reactive({
  search: '',
  mode: 'all',
  modes: ['all', 'draft', 'published'],
});

const listPage = ref<IProject[]>([]);

const fetchProjectList = debounce(async () => {
  loading.search = true;
  const res = await getProjectList();
  listPage.value = res.data;
  loading.search = false;
}, 500);

onMounted(() => {
  fetchProjectList();
});

watch(
  () => model.search,
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
  justify-content: center;
  flex: 1;
  margin-top: 36px;
  gap: 16px;
  .item {
    padding: 16px 20px 16px 16px;
    border-radius: 8px;
    border: 1px solid $neutral-white-alpha-7;
    background: $neutral-white-alpha-7;
    backdrop-filter: blur(5px);
    display: flex;
    width: 100%;
    gap: 16px;
    cursor: pointer;
    .item-thumbnail {
      width: 336px;
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
    img {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
