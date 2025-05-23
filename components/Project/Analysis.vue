<template>
  <vi-spin v-if="loading.detail" icon-size="20px" :loading="loading.detail" />
  <div v-if="!loading.detail" class="analysis-container">
    <div class="info">
      <vi-typography type="headline-xs">{{ project?.name }}</vi-typography>
      <vi-typography class="description" type="body-small">{{
        project?.startTime &&
        project?.endTime &&
        $t('landing-project_mgmt-description-event_period', {
          date1: getDates([project?.startTime || '']),
          date2: getDates([project?.endTime || '']),
        })
      }}</vi-typography>
    </div>
    <div class="analysis-parts">
      <div v-for="(part, index) in model" :key="index" class="part">
        <vi-typography class="description" type="body-small">{{
          part.title
        }}</vi-typography>
        <vi-typography type="headline-l">{{ part.value }}</vi-typography>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useProjectStore } from '~/stores/project';
import type { IProject } from '~/types/project';

const props = defineProps({
  project: {
    type: Object as PropType<IProject>,
    default: undefined,
  },
});

const { t } = useI18n();

const { getProjectAnalysis } = useProjectStore();

const loading = reactive({
  detail: false,
});

const model = ref<{ title: string; value: string }[]>([]);

const getTitle = (key: string) => {
  let title = '';
  switch (key) {
    case 'averageStayTime':
      title = t('landing-project_mgmt-subtitle-average_time');
      break;
    case 'totalAiToolUsage':
      title = t('landing-project_mgmt-subtitle-total_ai_usage');
      break;
    case 'totalVisits':
      title = t('landing-project_mgmt-subtitle-total_visits');
      break;
    default:
      break;
  }
  return title;
};

const fetchProjectAnalysis = async () => {
  if (!props.project) return;
  loading.detail = true;
  const res = await getProjectAnalysis(props.project.id);
  Object.keys(res.data).forEach((key) => {
    model.value.push({
      title: getTitle(key),
      value: res.data[key],
    });
  });
  loading.detail = false;
};

onMounted(() => {
  fetchProjectAnalysis();
});
</script>
<style lang="scss" scoped>
.fit {
  width: fit-content;
}
.description {
  color: $neutral-white-alpha-80 !important;
  word-break: break-all;
}
.analysis-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  .info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .analysis-parts {
    display: flex;
    flex-direction: row;
    .part {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      min-width: 320px;
    }
  }
}
</style>
