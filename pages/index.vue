<template>
  <div />
</template>

<script setup lang="ts">
onMounted(() => {
  let sender = null;
  webTrackingSDK
    .init({
      BUID: '',
      property: '',
      sourceProperty: '',
      GTMId: '',
      unleashConfig: {
        clientKey: '',
        appName: '',
        experimentKey: [''],
      },
    })
    .then((senderIns) => {
      sender = senderIns;
      console.log('init SDK done', sender);
    });
});
definePageMeta({
  layout: 'app',
});
</script>
