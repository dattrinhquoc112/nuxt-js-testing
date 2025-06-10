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
        :materialList
      />
      <MaterialManagementCapacity :materialList />
    </template>
  </SideBarItemContainer>
</template>
<script setup lang="ts">
import useMetric from '~/composables/metric';
import { useMaterial } from '~/stores/material';
import SideBarItemContainer from '../Common/SideBarItemContainer.vue';

const route = useRoute();
const { getTenantMetric, tenantMetric } = useMetric();
const { getMaterials } = useMaterial();
const materialList = ref();
const props = defineProps({
  modelValue: Boolean,
});

watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      try {
        const idStr = Array.isArray(newId) ? newId[0] : newId;
        if (typeof idStr === 'string') {
          const res = await getMaterials(idStr);
          materialList.value = res.data;
        }
      } catch (error) {}
    }
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  getTenantMetric();
});

defineEmits<{
  'update:modelValue': [e: Boolean];
}>();
</script>
<style scoped lang="scss"></style>
