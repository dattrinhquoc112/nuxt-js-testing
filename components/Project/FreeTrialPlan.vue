<template>
  <div class="free-trial-container">
    <div class="header">
      <vi-typography type="body-small">{{
        $t('common-form-title-free_plan')
      }}</vi-typography>
    </div>
    <div class="content-container">
      <div class="content" v-for="(metric, index) in metrics" :key="index">
        <div class="info">
          <vi-typography type="featured-small">{{
            metric.label
          }}</vi-typography>
          <vi-typography type="featured-small">
            {{ metric.description }}</vi-typography
          >
        </div>
        <vi-progress
          v-model="metric.percent"
          class="progress-bar"
          progress-width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useMetric from '~/composables/metric';
import type { ITenantMetric } from '~/types/tenant';

const props = defineProps<{
  tenantMetric: ITenantMetric | undefined;
}>();

const { metrics, handleMetrics } = useMetric();

watch(
  () => props.tenantMetric,
  () => {
    handleMetrics(props.tenantMetric);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.free-trial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  background: $neutral-white-alpha-7;
  width: 100%;

  .content-container {
    display: flex;
    padding: 16px 16px 24px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .progress-bar {
      width: 100%;
      display: flex;
      :deep(.progress-input) {
        width: 100%;
      }
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid $neutral-white-alpha-7;
    padding: 8px 0px;
    width: 100%;
  }
}
</style>
