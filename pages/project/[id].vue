<template>
  <vi-spin
    v-if="loading.detail"
    height="100%"
    width="100%"
    icon-size="20px"
    :loading="loading.detail"
  />
  <div v-if="!loading.detail" class="app-container">
    <div class="header">
      <vi-breadcrumb :items="breadcrumbItems" separator="/" />
      <div class="button-action">
        <vi-button
          width="65px"
          type="standard-default"
          @click="onAction('copy')"
          >複製專案</vi-button
        >
        <vi-button
          width="65px"
          type="dangerous-default"
          @click="onAction('unpublish')"
          >取消發布</vi-button
        >
      </div>
    </div>
    <div class="content">
      <vi-tabs
        class="tab mt-12 mb-12"
        v-model="tabs.value"
        :items="tabs.items"
      />
      <project-information v-show="tabs.value === 'detail'" />
      <project-analysis v-show="tabs.value === 'analysis'" />
    </div>
    <vi-modal
      modal-title="取消發布"
      :is-show="modal.unpublish.isShow"
      @close="modal.unpublish.close"
    >
      <vi-typography class="description" type="body-small"
        >取消發布後，此專案將回到草稿狀態。後續可以再次發布此專案。</vi-typography
      >
      <template #footer>
        <div class="modal-footer">
          <vi-button
            class="ml-auto"
            type-button="button"
            @click="modal.unpublish.close"
            type="primary-default"
            width="fit-content"
            >{{ $t('common-action-button-button_close') }}</vi-button
          >
          <vi-button
            type-button="button"
            @click="onUnpublish"
            type="dangerous-primary"
            width="fit-content"
            >取消發布</vi-button
          >
        </div>
      </template>
    </vi-modal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ['auth'],
});
const { t } = useI18n();

const loading = reactive({
  detail: false,
});

const tabs = reactive({
  value: 'detail',
  items: [
    {
      name: 'detail',
      label: '活動資訊',
      disabled: false,
    },
    {
      name: 'analysis',
      label: '活動分析',
      disabled: false,
    },
  ],
});

const breadcrumbItems = computed(() => [
  {
    text: t('project_list'),
    link: '/project-list',
  },
  { text: '咪咪喵喵', link: '' },
]);

const modal = reactive({
  unpublish: {
    isShow: false,
    open: () => {
      modal.unpublish.isShow = true;
    },
    close: () => {
      modal.unpublish.isShow = false;
    },
  },
});

const onCopy = () => {
  // TODO: wait API
};

const onUnpublish = () => {
  // TODO: wait API
  modal.unpublish.close();
};

const onAction = (action: string) => {
  switch (action) {
    case 'copy':
      onCopy();
      break;
    case 'unpublish':
      modal.unpublish.open();
      break;
    default:
      break;
  }
};
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
