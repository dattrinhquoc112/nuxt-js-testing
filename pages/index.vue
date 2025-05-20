<template>
  <div />
</template>

<script setup lang="ts">
import useSDKTracking from '~/composables/SDKTracking';

useSDKTracking();
declare global {
  interface Window {
    webTrackingSDK: any;
  }
}

definePageMeta({
  layout: 'app',
});
</script>
