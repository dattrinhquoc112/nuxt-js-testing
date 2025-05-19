<template>
  <div />
</template>

<script setup lang="ts">
const sender = ref();
declare global {
  interface Window {
    webTrackingSDK: any;
  }
}
watch(
  () => sender.value,
  (newValue) => {
    console.log(newValue, 'nekkk');
  },
  { immediate: true }
);
onMounted(async () => {
  sender.value = await window.webTrackingSDK.init({
    BUID: 'GAMA-aiaas-01',
    property: 'aiaas',
    sourceProperty: 'TENANT_SOTA',
    GTMId: '',
    unleashConfig: {
      clientKey: '',
      appName: '',
      experimentKey: [''],
    },
  });
});
definePageMeta({
  layout: 'app',
});
</script>
