<template>
  <div />
</template>

<script setup lang="ts">
declare global {
  interface Window {
    webTrackingSDK: any;
  }
}
onMounted(async () => {
  const sender = await window.webTrackingSDK.init({
    BUID: 'GAMA-aiaas-01',
    property: 'aiaas',
    sourceProperty: '10',
  });
  sender.passEvent(
    new window.webTrackingSDK.events.ClickEvent({
      eventId: '9101',
      event: 'jb_content_click',
      pageInfo: { page: 'home' },
      clickInfo: {
        sec: 'lovedaily',
        name: '【Move It】Beat智能運動啞鈴0.5KG | 在家運動好輕鬆',
        uuid: 'P09220970911',
        uri: 'https://lovedaily.jollybuy.com/Goods/Detail/P09220970911',
      },
    })
  );
});
definePageMeta({
  layout: 'app',
});
</script>
