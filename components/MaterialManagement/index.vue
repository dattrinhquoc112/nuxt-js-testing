<template>
  <SideBarItemContainer v-click-outside="handleClose">
    <template #title>
      <CommonCloseContainer
        :label="$t('landing-editor-menu-section_materials')"
        @handle-close="handleClose"
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
import { useEditorStore } from '~/stores/editor';
import { useMaterial } from '~/stores/material';
import { storeToRefs } from 'pinia';
import SideBarItemContainer from '../Common/SideBarItemContainer.vue';

const materialStore = useMaterial();
const { listMaterial: materialList } = storeToRefs(materialStore);
const editorStore = useEditorStore();
const { tenantMetric, getTenantMetric } = useMetric();

const handleClose = () => {
  editorStore.setActiveSideBar('');
};
onMounted(() => {
  getTenantMetric();
});
</script>
<style scoped lang="scss"></style>
