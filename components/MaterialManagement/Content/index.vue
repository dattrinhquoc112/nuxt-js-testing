<template>
  <div class="container">
    <vi-typography type="subtitle-large" class="container--title">
      {{ $t('landing-editor-section-material_title_capacity') }}</vi-typography
    >
    <div class="container--list">
      <common-info-bar
        v-for="(item, index) in MetricsMapping"
        :key="index"
        :label-left="item.label"
        :label-right="item.valueText"
        :color="item?.color"
      />
      <common-progress-bar
        :total-capacity="
          Number(MetricsMapping[METRICS_KEY.TOTAL_CAPACITY].value)
        "
        :total-usage="
          Number(MetricsMapping[METRICS_KEY.TOTAL_CAPACITY_USED].value)
        "
        :total-usage-in-project="
          Number(
            MetricsMapping[METRICS_KEY.TOTAL_CAPACITY_USED_IN_PROJECT].value
          )
        "
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { METRICS_KEY } from '~/constants/common';
import type { ITenantMetric } from '~/types/tenant';

const { t } = useI18n();
const props = defineProps({
  tenantMetric: {
    type: Object as PropType<ITenantMetric>,
    required: true,
  },
  materialList: {
    default: [],
    required: false,
  },
});
const MetricsMapping = computed(() => {
  const { metrics } = props.tenantMetric;
  const totalCapacity = metrics.find(
    (item) => item.metric === METRICS_KEY.TOTAL_CAPACITY
  );
  const totalCapacityUsage = metrics.find(
    (item) => item.metric === METRICS_KEY.TOTAL_CAPACITY_USED
  );
  // TODO: need to update
  const usedProject = props.materialList.reduce(
    (sum, item: any) => sum + (item?.fileSize ?? 0),
    0
  );
  const metricsList = {
    [METRICS_KEY.TOTAL_CAPACITY]: {
      label: t('landing-editor-section-material_total_capacity'),
      valueText: `${totalCapacity?.value}${totalCapacity?.unit}`,
      value: convertToKB(`${totalCapacity?.value}${totalCapacity?.unit}`),
    },
    [METRICS_KEY.TOTAL_CAPACITY_USED]: {
      label: t('landing-editor-section-material_total_usage'),
      valueText: `${totalCapacityUsage?.value}${totalCapacityUsage?.unit}`,
      value: convertToKB(
        `${totalCapacityUsage?.value}${totalCapacityUsage?.unit}`
      ),
    },
    [METRICS_KEY.TOTAL_CAPACITY_USED_IN_PROJECT]: {
      label: t('landing-editor-section-material_project_usage'),
      valueText: `${convertFileSize(usedProject)}`,
      value: convertToKB(`${convertFileSize(usedProject)}`),
      color: '#1EDD00',
    },
  };
  return metricsList;
});
</script>

<style lang="scss" scoped>
.container {
  &--title {
    margin-bottom: 16px;
  }
  &--list {
    color: $neutral-white-alpha-80;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
