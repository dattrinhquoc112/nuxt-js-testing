<template>
  <SideBarItemContainer v-show="modelValue">
    <template #title>
      <CommonCloseContainer
        :label="$t('landing-editor-menu-section_materials')"
        @handle-close="$emit('update:modelValue', false)"
      >
        <vi-icon
          name="ic_capacity"
          :size="24"
          class="neutral-white-alpha-60-text"
        />
      </CommonCloseContainer>
    </template>
    <template #content>
      <MaterialManagementContent
        :tenantMetric="tenantMetric || { name: '', metrics: [] }"
        :materialList="materialList || []"
      />
      <MaterialManagementCapacity :materialList="materialList || []" />
    </template>
  </SideBarItemContainer>
</template>
<script setup lang="ts">
import useMetric from '~/composables/metric';
import SideBarItemContainer from '../Common/SideBarItemContainer.vue';

const materialList = inject<Ref<never[]> | undefined>('materialList');

const { tenantMetric, getTenantMetric } = useMetric();
defineProps({
  modelValue: Boolean,
});

defineEmits<{
  'update:modelValue': [e: Boolean];
}>();

onMounted(() => {
  getTenantMetric();
});
</script>
<style scoped lang="scss"></style>
