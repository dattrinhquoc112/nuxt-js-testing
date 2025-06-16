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

const metrics = inject<any>(PROVIDE.METRIC);
const { t } = useI18n();
defineProps({
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
  const metricsList = {
    [METRICS_KEY.TOTAL_CAPACITY]: {
      label: t('landing-editor-section-material_total_capacity'),
      value: metrics?.totalCapacity?.value.value ?? '0',
      valueText: metrics?.totalCapacity?.value.displayValue ?? '0',
    },
    [METRICS_KEY.TOTAL_CAPACITY_USED]: {
      label: t('landing-editor-section-material_total_usage'),
      value: metrics?.totalCapacityUsed?.value.value ?? '0',
      valueText: metrics?.totalCapacityUsed?.value.displayValue ?? '0',
    },
    [METRICS_KEY.TOTAL_CAPACITY_USED_IN_PROJECT]: {
      label: t('landing-editor-section-material_project_usage'),
      value: metrics?.totalCapacityUsedInPJ?.value.value ?? '0',
      valueText: metrics?.totalCapacityUsedInPJ?.value.displayValue ?? '0',
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
