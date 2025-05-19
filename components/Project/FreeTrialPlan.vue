<template>
  <div class="free-trial-container">
    <div class="header">
      <vi-typography type="body-small">{{
        $t('common-form-title-free_plan')
      }}</vi-typography>
    </div>
    <div class="content">
      <div class="info">
        <vi-typography type="featured-small">{{
          $t('common-form-field-field_storage')
        }}</vi-typography>
        <vi-typography type="featured-small">
          {{ props.tenantMetric?.metrics[0].value }}/{{
            props.tenantMetric?.metrics[0].limit
          }}</vi-typography
        >
      </div>
      <vi-progress
        :key="projectCreatedPercent"
        v-model="projectCreatedPercent"
        class="progress-bar"
        progress-width="100%"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ITenantMetric } from '~/types/tenant';

const props = defineProps<{
  tenantMetric: ITenantMetric | undefined;
}>();

const projectCreatedPercent = ref<number>(0);
const trainingCreatedPercent = ref<number>(0);

watch(
  () => props.tenantMetric,
  () => {
    projectCreatedPercent.value =
      (Number(props.tenantMetric?.metrics[0].value) * 100) /
      Number(props.tenantMetric?.metrics[0].limit);

    trainingCreatedPercent.value =
      (Number(props.tenantMetric?.metrics[1].value) * 100) /
      Number(props.tenantMetric?.metrics[1].limit);
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

  .content {
    display: flex;
    flex-direction: column;
    padding: 16px 16px 24px 16px;
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
